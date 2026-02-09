import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AnyPipe } from '../../../../../core/pipes/any.pipe';

@Component({
  selector: 'app-add-test',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    NzButtonModule, NzIconModule, NzFormModule, NzInputModule,
    NzInputNumberModule, NzSwitchModule, NzTabsModule,
    NzSelectModule, NzCheckboxModule, NzSpinModule, AnyPipe
  ],
  templateUrl: './add-test.html',
  styleUrl: './add-test.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTest implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private notification = inject(NzNotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(false);
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

  get questions() { return this.testForm.get('questions') as FormArray; }
  get resultLogic() { return this.testForm.get('resultLogic') as FormArray; }

  ngOnInit() {
    this.setupAutoSlug();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode.set(true);
      this.currentTestId.set(id);
      this.loadTest(id);
    } else {
      this.addQuestion();
    }
  }

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

  private loadTest(id: string) {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/tests/admin/${id}`).subscribe({
      next: (res) => {
        const test = res.data || res;
        this.questions.clear();
        this.resultLogic.clear();
        this.testForm.patchValue(test);

        test.questions?.forEach((q: any) => this.addQuestion(q));
        test.resultLogic?.forEach((l: any) => this.addResultLogic(l));

        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Xatolik', 'Tahrirlash uchun ma\'lumot topilmadi');
        this.loading.set(false);
      }
    });
  }

  addQuestion(data: any = null) {
    const qGroup = this.fb.group({
      text: [data?.text || '', Validators.required],
      order: [data?.order || this.questions.length + 1],
      isStartQuestion: [data?.isStartQuestion || false],
      options: this.fb.array([])
    });
    this.questions.push(qGroup);

    const qIdx = this.questions.length - 1;
    if (data?.options) {
      data.options.forEach((o: any) => this.addOption(qIdx, o));
    } else {
      this.addOption(qIdx);
    }
  }

  addOption(qIdx: number, data: any = null) {
    const options = this.questions.at(qIdx).get('options') as FormArray;
    options.push(this.fb.group({
      text: [data?.text || '', Validators.required],
      score: [data?.score || 0],
      order: [data?.order || options.length + 1],
      nextQuestionId: [data?.nextQuestionId || null],
      feedbackText: [data?.feedbackText || ''],
      isTerminal: [data?.isTerminal || false]
    }));
  }

  getQuestionLabels(): { index: number; text: string }[] {
    return this.questions.controls.map((q: any, idx: number) => ({
      index: idx,
      text: q.get('text')?.value || `Savol ${idx + 1}`
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

  goBack() {
    this.router.navigate(['/admin/tests']);
  }

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
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/tests']);
      },
      error: () => {
        this.notification.error('Xatolik', 'Saqlashda xatolik yuz berdi');
        this.isSubmitting.set(false);
      }
    });
  }
}
