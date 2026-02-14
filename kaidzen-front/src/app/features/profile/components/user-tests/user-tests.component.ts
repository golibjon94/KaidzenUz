import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TestsService } from '../../../../core/services/tests.service';
import { Test, TestResult, SubmitTestDto } from '../../../../core/models/test.model';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-tests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './user-tests.component.html',
  styleUrl: './user-tests.component.css',
})
export class UserTestsComponent implements OnInit {
  private testsService = inject(TestsService);
  private dialog = inject(MatDialog);

  tests = signal<Test[]>([]);
  selectedTest = signal<Test | null>(null);
  selectedAnswers = signal<Map<string, string>>(new Map());
  loading = signal(false);
  submitting = signal(false);
  result = signal<TestResult | null>(null);
  error = signal<string | null>(null);
  protected readonly String = String;

  // Test taking state
  currentQuestionIndex = signal(0);
  questionPath = signal<string[]>([]);
  collectedFeedback = signal<string[]>([]);

  currentQuestion = computed(() => {
    const test = this.selectedTest();
    if (!test || !test.questions || test.questions.length === 0) return null;

    const path = this.questionPath();
    if (path.length > 0) {
      const currentId = path[path.length - 1];
      return test.questions.find(q => q.id === currentId) || null;
    }

    // Fallback: sequential mode
    const index = this.currentQuestionIndex();
    if (!test.questions[index]) return null;
    return test.questions[index];
  });

  private isDynamicFlow = computed(() => {
    const test = this.selectedTest();
    if (!test || !test.questions) return false;
    return test.questions.some(q => q.isStartQuestion) ||
      test.questions.some(q => q.options.some(o => o.nextQuestionId || o.isTerminal));
  });

  progress = computed(() => {
    const test = this.selectedTest();
    if (!test || !test.questions || test.questions.length === 0) return 0;
    if (this.isDynamicFlow()) {
      const path = this.questionPath();
      const answered = this.selectedAnswers().size;
      return Math.round((answered / test.questions.length) * 100);
    }
    const index = this.currentQuestionIndex();
    return Math.round(((index + 1) / test.questions.length) * 100);
  });

  isLastQuestion = computed(() => {
    const test = this.selectedTest();
    if (!test || !test.questions) return false;

    if (this.isDynamicFlow()) {
      const current = this.currentQuestion();
      const answers = this.selectedAnswers();
      if (!current) return false;
      const selectedOptionId = answers.get(current.id);
      if (!selectedOptionId) return false;
      const selectedOption = current.options.find(o => o.id === selectedOptionId);
      // Terminal yoki keyingi savol yo'q bo'lsa - bu oxirgi savol
      return selectedOption?.isTerminal === true || !selectedOption?.nextQuestionId;
    }

    return this.currentQuestionIndex() === test.questions.length - 1;
  });

  canGoNext = computed(() => {
    const current = this.currentQuestion();
    const answers = this.selectedAnswers();
    return current ? answers.has(current.id) : false;
  });

  canGoBack = computed(() => {
    if (this.isDynamicFlow()) {
      return this.questionPath().length > 1;
    }
    return this.currentQuestionIndex() > 0;
  });

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.loading.set(true);
    this.testsService.getTests().subscribe({
      next: (data) => {
        this.tests.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Testlarni yuklashda xatolik');
        this.loading.set(false);
      },
    });
  }

  selectTest(slug: string) {
    this.loading.set(true);
    this.result.set(null);
    this.selectedAnswers.set(new Map());
    this.currentQuestionIndex.set(0);
    this.questionPath.set([]);
    this.collectedFeedback.set([]);

    this.testsService.getBySlug(slug).subscribe({
      next: (res: any) => {
        // MUHIM: Bekenddan kelgan 'data' o'ramini tekshiramiz
        const testData = res.data ? res.data : res;
        this.selectedTest.set(testData);

        // Initialize dynamic flow path
        if (testData.questions && testData.questions.length > 0) {
          const startQ = testData.questions.find((q: any) => q.isStartQuestion) || testData.questions[0];
          this.questionPath.set([startQ.id]);
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Test ma\'lumotlarini yuklashda xatolik');
        this.loading.set(false);
      },
    });
  }
  selectOption(questionId: string, optionId: string) {
    const answers = new Map(this.selectedAnswers());
    answers.set(questionId, optionId);
    this.selectedAnswers.set(answers);
  }

  isOptionSelected(questionId: string, optionId: string): boolean {
    return this.selectedAnswers().get(questionId) === optionId;
  }

  nextQuestion() {
    const current = this.currentQuestion();
    const answers = this.selectedAnswers();
    if (!current || !this.canGoNext()) return;

    const selectedOptionId = answers.get(current.id);
    if (!selectedOptionId) return;

    const selectedOption = current.options.find(o => o.id === selectedOptionId);
    if (!selectedOption) return;

    // Collect feedback
    if (selectedOption.feedbackText) {
      this.collectedFeedback.update(fb => [...fb, selectedOption.feedbackText!]);
    }

    if (this.isDynamicFlow()) {
      // Check if terminal
      if (selectedOption.isTerminal || !selectedOption.nextQuestionId) {
        this.confirmSubmit();
        return;
      }
      // Navigate to next question via dynamic flow
      this.questionPath.update(path => [...path, selectedOption.nextQuestionId!]);
    } else {
      // Sequential fallback
      if (!this.isLastQuestion()) {
        this.currentQuestionIndex.update(i => i + 1);
      }
    }
  }

  previousQuestion() {
    if (this.isDynamicFlow()) {
      const path = this.questionPath();
      if (path.length > 1) {
        // Remove last feedback if it was from the current question's selected option
        const currentQ = this.currentQuestion();
        if (currentQ) {
          const answers = this.selectedAnswers();
          answers.delete(currentQ.id);
          this.selectedAnswers.set(new Map(answers));
        }
        this.questionPath.set(path.slice(0, -1));
      }
    } else {
      this.currentQuestionIndex.update(i => Math.max(0, i - 1));
    }
  }

  confirmSubmit() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Testni yakunlash',
        message: 'Haqiqatan ham testni yakunlamoqchimisiz? Javoblarni qayta o\'zgartirib bo\'lmaydi.',
        okText: 'Ha, yakunlash',
        cancelText: 'Bekor qilish',
      },
      width: '560px',
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.submitTest();
      }
    });
  }

  submitTest() {
    const test = this.selectedTest();
    if (!test) return;

    this.submitting.set(true);
    const dto: SubmitTestDto = {
      testId: test.id,
      answers: Array.from(this.selectedAnswers().entries()).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      })),
    };

    this.testsService.submitTest(dto).subscribe({
      next: (result) => {
        this.result.set(result);
        this.submitting.set(false);
        // Automatically return to test list after 3 seconds
        setTimeout(() => {
          this.backToList();
        }, 3000);
      },
      error: () => {
        this.error.set('Testni topshirishda xatolik');
        this.submitting.set(false);
      },
    });
  }

  backToList() {
    this.selectedTest.set(null);
    this.result.set(null);
    this.selectedAnswers.set(new Map());
    this.currentQuestionIndex.set(0);
    this.questionPath.set([]);
    this.collectedFeedback.set([]);
    this.loadTests();
  }
}
