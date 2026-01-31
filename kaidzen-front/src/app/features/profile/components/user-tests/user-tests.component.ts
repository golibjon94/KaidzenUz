import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
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
    NzSkeletonModule
  ],
  templateUrl: './user-tests.component.html',
  styleUrl: './user-tests.component.css',
})
export class UserTestsComponent implements OnInit {
  private testsService = inject(TestsService);

  tests = signal<Test[]>([]);
  selectedTest = signal<Test | null>(null);
  selectedAnswers = signal<Map<string, string>>(new Map());
  loading = signal(false);
  submitting = signal(false);
  result = signal<TestResult | null>(null);
  error = signal<string | null>(null);

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

  canSubmit(): boolean {
    const test = this.selectedTest();
    if (!test) return false;
    return test.questions.length === this.selectedAnswers().size;
  }

  submitTest() {
    const test = this.selectedTest();
    if (!test || !this.canSubmit()) return;

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
  }
}
