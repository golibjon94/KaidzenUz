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
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { environment } from '../../../../../environments/environment';

interface Test {
  id: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    questions: number;
  };
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
    NzTabsModule,
    NzPopconfirmModule,
    NzCardModule,
    NzDividerModule
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
  editMode = signal(false);
  currentTestId = signal<string | null>(null);

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

    // Auto-generate slug from title
    this.testForm.get('title')?.valueChanges.subscribe(value => {
      if (value && !this.editMode()) {
        const slug = value.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        this.testForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  loadTests() {
    this.loading.set(true);
    this.http.get<Test[] | {data: Test[]}>(`${environment.apiUrl}/tests/admin/all`).subscribe({
      next: (res) => {
        // Handle both array and object with data property
        const data = Array.isArray(res) ? res : (res as any).data || [];
        this.tests.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.message.error('Testlarni yuklashda xatolik');
        this.tests.set([]);
        this.loading.set(false);
      }
    });
  }

  showModal() {
    this.editMode.set(false);
    this.currentTestId.set(null);
    this.testForm.reset({ isActive: true });
    this.questions.clear();
    this.resultLogic.clear();
    this.addQuestion();
    this.addResultLogic();
    this.isVisible.set(true);
  }

  editTest(id: string) {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/tests/admin/${id}`).subscribe({
      next: (res) => {
        const test = res.data || res; // Handle wrapped response

        this.editMode.set(true);
        this.currentTestId.set(id);

        // Clear arrays
        this.questions.clear();
        this.resultLogic.clear();

        // Populate form
        this.testForm.patchValue({
          title: test.title,
          slug: test.slug,
          description: test.description,
          isActive: test.isActive
        });

        // Populate questions
        if (test.questions && test.questions.length > 0) {
          test.questions.forEach((q: any) => {
            const questionGroup = this.fb.group({
              text: [q.text, Validators.required],
              order: [q.order, Validators.required],
              options: this.fb.array([])
            });

            const optionsArray = questionGroup.get('options') as FormArray;
            if (q.options && q.options.length > 0) {
              q.options.forEach((o: any) => {
                optionsArray.push(this.fb.group({
                  text: [o.text, Validators.required],
                  score: [o.score, Validators.required],
                  order: [o.order, Validators.required]
                }));
              });
            } else {
              // Add at least one empty option if none exist
              this.addOptionToGroup(optionsArray);
            }

            this.questions.push(questionGroup);
          });
        } else {
          this.addQuestion();
        }

        // Populate result logic
        if (test.resultLogic && test.resultLogic.length > 0) {
          test.resultLogic.forEach((l: any) => {
            this.resultLogic.push(this.fb.group({
              minScore: [l.minScore, [Validators.required, Validators.min(0)]],
              maxScore: [l.maxScore, [Validators.required, Validators.min(0)]],
              resultText: [l.resultText, Validators.required],
              recommendation: [l.recommendation, Validators.required]
            }));
          });
        } else {
          this.addResultLogic();
        }

        this.loading.set(false);
        this.isVisible.set(true);
      },
      error: () => {
        this.message.error('Test ma\'lumotlarini yuklashda xatolik');
        this.loading.set(false);
      }
    });
  }

  deleteTest(id: string) {
    this.http.delete(`${environment.apiUrl}/tests/${id}`).subscribe({
      next: () => {
        this.message.success('Test o\'chirildi');
        this.loadTests();
      },
      error: () => {
        this.message.error('Testni o\'chirishda xatolik');
      }
    });
  }

  toggleActive(id: string) {
    this.http.put(`${environment.apiUrl}/tests/${id}/toggle-active`, {}).subscribe({
      next: () => {
        this.message.success('Status o\'zgartirildi');
        this.loadTests();
      },
      error: () => {
        this.message.error('Statusni o\'zgartirishda xatolik');
      }
    });
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

    // Add 2 default options
    this.addOption(this.questions.length - 1);
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
    this.addOptionToGroup(options);
  }

  private addOptionToGroup(options: FormArray) {
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

      const request = this.editMode()
        ? this.http.put(`${environment.apiUrl}/tests/${this.currentTestId()}`, this.testForm.value)
        : this.http.post(`${environment.apiUrl}/tests`, this.testForm.value);

      request.subscribe({
        next: () => {
          this.message.success(this.editMode() ? 'Test yangilandi' : 'Test yaratildi');
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

      // Mark nested form arrays as touched
      this.questions.controls.forEach((q: any) => {
        q.markAllAsTouched();
        const options = q.get('options') as FormArray;
        options.controls.forEach((o: any) => o.markAllAsTouched());
      });

      this.resultLogic.controls.forEach((l: any) => l.markAllAsTouched());
    }
  }
}
