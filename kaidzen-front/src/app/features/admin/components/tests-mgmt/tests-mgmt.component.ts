import { Component, OnInit, inject, signal, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { environment } from '../../../../../environments/environment';

interface Test {
  id: string;
  title: string;
  slug: string;
  description: string;
  createdAt: string;
}

@Component({
  selector: 'app-tests-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzEmptyModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzTabsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tests-mgmt.component.html',
  styleUrl: './tests-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsMgmtComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);

  tests = signal<Test[]>([]);
  loading = signal(true);
  isVisible = signal(false);
  isSubmitting = signal(false);

  testForm = this.fb.group({
    title: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    description: [''],
    isActive: [true],
    questions: this.fb.array([]),
    resultLogic: this.fb.array([])
  });

  get questions() {
    return this.testForm.get('questions') as FormArray;
  }

  get resultLogic() {
    return this.testForm.get('resultLogic') as FormArray;
  }

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.loading.set(true);
    this.http.get<{data: Test[]} | Test[]>(`${environment.apiUrl}/tests`).subscribe({
      next: (res) => {
        // Handle both array and object with data property
        const data = Array.isArray(res) ? res : (res as any).data || [];
        this.tests.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.tests.set([]);
        this.loading.set(false);
      }
    });
  }

  showModal() {
    this.testForm.reset({ isActive: true });
    this.questions.clear();
    this.resultLogic.clear();
    this.addQuestion();
    this.addResultLogic();
    this.isVisible.set(true);
  }

  handleCancel() {
    this.isVisible.set(false);
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      text: ['', Validators.required],
      order: [this.questions.length + 1, Validators.required],
      options: this.fb.array([])
    });
    this.questions.push(questionGroup);
    this.addOption(this.questions.length - 1);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getOptions(questionIndex: number) {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number) {
    const options = this.getOptions(questionIndex);
    const optionGroup = this.fb.group({
      text: ['', Validators.required],
      score: [0, Validators.required],
      order: [options.length + 1, Validators.required]
    });
    options.push(optionGroup);
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.getOptions(questionIndex).removeAt(optionIndex);
  }

  addResultLogic() {
    const logicGroup = this.fb.group({
      minScore: [0, [Validators.required, Validators.min(0)]],
      maxScore: [0, [Validators.required, Validators.min(0)]],
      resultText: ['', Validators.required],
      recommendation: ['', Validators.required]
    });
    this.resultLogic.push(logicGroup);
  }

  removeResultLogic(index: number) {
    this.resultLogic.removeAt(index);
  }

  submitForm() {
    if (this.testForm.valid) {
      this.isSubmitting.set(true);
      this.http.post(`${environment.apiUrl}/tests`, this.testForm.value).subscribe({
        next: () => {
          this.message.success('Test muvaffaqiyatli yaratildi');
          this.isVisible.set(false);
          this.loadTests();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.message.error('Xatolik yuz berdi');
          this.isSubmitting.set(false);
        }
      });
    } else {
      Object.values(this.testForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
