import { Component, OnInit, inject, signal, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

// Ng-Zorro Modullari
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
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { AnyPipe } from '../../../../core/pipes/any.pipe';

interface Test {
  id: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  _count?: { questions: number };
}

@Component({
  selector: 'app-tests-mgmt',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    NzTableModule, NzButtonModule, NzTagModule, NzIconModule,
    NzEmptyModule, NzModalModule, NzFormModule, NzInputModule,
    NzInputNumberModule, NzSwitchModule, NzTabsModule, NzPopconfirmModule,
    NzBadgeModule, AnyPipe
  ],
  templateUrl: './tests-mgmt.component.html',
  styleUrl: './tests-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsMgmtComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private notification = inject(NzNotificationService);
  private platformId = inject(PLATFORM_ID);

  // States (Signals)
  tests = signal<Test[]>([]);
  loading = signal(false);
  isVisible = signal(false);
  isSubmitting = signal(false);
  editMode = signal(false);
  currentTestId = signal<string | null>(null);

  // Form Initializatsiya
  testForm = this.fb.group({
    title: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    description: [''],
    isActive: [true],
    questions: this.fb.array([]),
    resultLogic: this.fb.array([])
  });

  get questions() { return this.testForm.get('questions') as FormArray; }
  get resultLogic() { return this.testForm.get('resultLogic') as FormArray; }

  ngOnInit() {
    this.loadTests();
    this.setupAutoSlug();
  }

  // Avtomatik slug yaratish (Faqat brauzerda va tahrirlash bo'lmaganda)
  private setupAutoSlug() {
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
    this.http.get<any>(`${environment.apiUrl}/tests/admin/all`).subscribe({
      next: (res) => {
        this.tests.set(Array.isArray(res) ? res : res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Xatolik', 'Ma\'lumotlarni yuklashda xatolik yuz berdi');
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
    this.addQuestion(); // Bitta bo'sh savol bilan boshlash
    this.isVisible.set(true);
  }

  editTest(id: string) {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/tests/admin/${id}`).subscribe({
      next: (res) => {
        const test = res.data || res;
        this.editMode.set(true);
        this.currentTestId.set(id);

        // Formni tozalash va to'ldirish
        this.questions.clear();
        this.resultLogic.clear();
        this.testForm.patchValue(test);

        // Dinamik savollarni qo'shish
        test.questions?.forEach((q: any) => this.addQuestion(q));
        test.resultLogic?.forEach((l: any) => this.addResultLogic(l));

        this.loading.set(false);
        this.isVisible.set(true);
      },
      error: () => this.notification.error('Xatolik', 'Tahrirlash uchun ma\'lumot topilmadi')
    });
  }

  // Dinamik Form Metodlari
  addQuestion(data: any = null) {
    const qGroup = this.fb.group({
      text: [data?.text || '', Validators.required],
      order: [data?.order || this.questions.length + 1],
      options: this.fb.array([])
    });
    this.questions.push(qGroup);

    const qIdx = this.questions.length - 1;
    if (data?.options) {
      data.options.forEach((o: any) => this.addOption(qIdx, o));
    } else {
      this.addOption(qIdx); // Kamida 1 ta variant
    }
  }

  addOption(qIdx: number, data: any = null) {
    const options = this.questions.at(qIdx).get('options') as FormArray;
    options.push(this.fb.group({
      text: [data?.text || '', Validators.required],
      score: [data?.score || 0],
      order: [data?.order || options.length + 1]
    }));
  }

  addResultLogic(data: any = null) {
    this.resultLogic.push(this.fb.group({
      minScore: [data?.minScore || 0, [Validators.required, Validators.min(0)]],
      maxScore: [data?.maxScore || 0, [Validators.required, Validators.min(0)]],
      resultText: [data?.resultText || '', Validators.required],
      recommendation: [data?.recommendation || '']
    }));
  }

  removeQuestion(idx: number) { this.questions.removeAt(idx); }
  removeOption(qIdx: number, oIdx: number) { (this.questions.at(qIdx).get('options') as FormArray).removeAt(oIdx); }
  removeResultLogic(idx: number) { this.resultLogic.removeAt(idx); }

  handleCancel() { this.isVisible.set(false); }

  submitForm() {
    if (this.testForm.invalid) {
      this.notification.warning('Diqqat', 'Iltimos, barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    this.isSubmitting.set(true);
    const url = this.editMode() ? `${environment.apiUrl}/tests/${this.currentTestId()}` : `${environment.apiUrl}/tests`;
    const method = this.editMode() ? 'put' : 'post';

    this.http[method](url, this.testForm.value).subscribe({
      next: () => {
        this.notification.success('Muvaffaqiyat', 'Muvaffaqiyatli saqlandi');
        this.isVisible.set(false);
        this.loadTests();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.notification.error('Xatolik', 'Saqlashda xatolik yuz berdi');
        this.isSubmitting.set(false);
      }
    });
  }

  deleteTest(id: string) {
    this.http.delete(`${environment.apiUrl}/tests/${id}`).subscribe({
      next: () => { this.notification.success('Muvaffaqiyat', 'O\'chirildi'); this.loadTests(); },
      error: () => this.notification.error('Xatolik', 'O\'chirishda xatolik')
    });
  }
}
