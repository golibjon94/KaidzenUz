import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { FormsModule } from '@angular/forms';
import { TestsService } from '../../../../core/services/tests.service';
import { Test, TestResult, SubmitTestDto } from '../../../../core/models/test.model';

@Component({
  selector: 'app-user-tests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzRadioModule,
    NzResultModule,
    NzSkeletonModule,
    NzProgressModule,
    NzModalModule,
    NzEmptyModule,
    NzTagModule
  ],
  templateUrl: './user-tests.component.html',
  styleUrl: './user-tests.component.css',
})
export class UserTestsComponent implements OnInit {
  private testsService = inject(TestsService);
  private modal = inject(NzModalService);

  tests = signal<Test[]>([]);
  selectedTest = signal<Test | null>(null);
  selectedAnswers = signal<Map<string, string>>(new Map());
  loading = signal(false);
  submitting = signal(false);
  result = signal<TestResult | null>(null);
  error = signal<string | null>(null);

  // Test taking state
  currentQuestionIndex = signal(0);

  currentQuestion = computed(() => {
    const test = this.selectedTest();
    const index = this.currentQuestionIndex();
    if (!test || !test.questions || test.questions.length === 0) return null;
    return test.questions[index];
  });

  progress = computed(() => {
    const test = this.selectedTest();
    const index = this.currentQuestionIndex();
    if (!test || !test.questions || test.questions.length === 0) return 0;
    return Math.round(((index + 1) / test.questions.length) * 100);
  });

  isLastQuestion = computed(() => {
    const test = this.selectedTest();
    const index = this.currentQuestionIndex();
    if (!test || !test.questions) return false;
    return index === test.questions.length - 1;
  });

  canGoNext = computed(() => {
    const current = this.currentQuestion();
    const answers = this.selectedAnswers();
    return current ? answers.has(current.id) : false;
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
      error: (err) => {
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

    this.testsService.getBySlug(slug).subscribe({
      next: (test) => {
        this.selectedTest.set(test);
        this.loading.set(false);
      },
      error: (err) => {
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
    if (this.canGoNext() && !this.isLastQuestion()) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  previousQuestion() {
    this.currentQuestionIndex.update(i => Math.max(0, i - 1));
  }

  confirmSubmit() {
    this.modal.confirm({
      nzTitle: 'Testni yakunlash',
      nzContent: 'Haqiqatan ham testni yakunlamoqchimisiz? Javoblarni qayta o\'zgartirib bo\'lmaydi.',
      nzOkText: 'Ha, yakunlash',
      nzCancelText: 'Bekor qilish',
      nzOnOk: () => this.submitTest()
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
      },
      error: (err) => {
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
    this.loadTests(); // Refresh list to update counts if needed
  }
}
