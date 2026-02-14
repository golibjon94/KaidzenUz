import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AnyPipe } from '../../../../../core/pipes/any.pipe';
import { NotifyService } from '../../../../../core/services/notify.service';
import { DiagnosticsService } from '../../../../../core/services/diagnostics.service';
import { Diagnostic } from '../../../../../core/models/diagnostic.model';

@Component({
  selector: 'app-add-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AnyPipe,
  ],
  templateUrl: './add-test.html',
  styleUrl: './add-test.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTest implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private notify = inject(NotifyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private diagnosticsService = inject(DiagnosticsService);

  loading = signal(false);
  isSubmitting = signal(false);
  editMode = signal(false);
  currentTestId = signal<string | null>(null);
  diagnostics = signal<Diagnostic[]>([]);
  selectedDiagnosticId = signal<string | null>(null);

  private optionLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  testForm = this.fb.group({
    title: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    isActive: [true],
    questions: this.fb.array([]),
  });

  get questions() {
    return this.testForm.get('questions') as FormArray;
  }

  ngOnInit() {
    this.setupAutoSlug();
    this.loadDiagnostics();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode.set(true);
      this.currentTestId.set(id);
      this.loadTest(id);
    } else {
      this.addQuestion();
    }
  }

  private loadDiagnostics() {
    this.diagnosticsService.getAll().subscribe({
      next: (res: any) => {
        this.diagnostics.set(res.data || res);
      },
      error: () => {
        this.notify.error('Diagnostikalarni yuklashda xatolik');
      },
    });
  }

  onDiagnosticChange(diagnosticId: string) {
    this.selectedDiagnosticId.set(diagnosticId);
    const diagnostic = this.diagnostics().find(d => d.id === diagnosticId);
    if (diagnostic) {
      this.testForm.patchValue({ title: diagnostic.name });
    }
  }

  private setupAutoSlug() {
    this.testForm.get('title')?.valueChanges.subscribe((value) => {
      if (value && !this.editMode()) {
        const slug = value
          .toLowerCase()
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
        this.testForm.patchValue(test);

        test.questions?.forEach((q: any) => this.addQuestion(q));

        this.loading.set(false);
      },
      error: () => {
        this.notify.error("Tahrirlash uchun ma'lumot topilmadi");
        this.loading.set(false);
      },
    });
  }

  addQuestion(data: any = null) {
    const qGroup = this.fb.group({
      text: [data?.text || '', Validators.required],
      order: [data?.order || this.questions.length + 1],
      isStartQuestion: [data?.isStartQuestion || false],
      options: this.fb.array([]),
    });
    this.questions.push(qGroup);

    const qIdx = this.questions.length - 1;
    if (data?.options) {
      data.options.forEach((o: any) => this.addOption(qIdx, o));
    } else {
      this.addOption(qIdx);
      this.addOption(qIdx);
    }
  }

  addOption(qIdx: number, data: any = null) {
    const options = this.questions.at(qIdx).get('options') as FormArray;
    options.push(
      this.fb.group({
        text: [data?.text || '', Validators.required],
        order: [data?.order || options.length + 1],
        nextQuestionId: [data?.nextQuestionId || null],
        feedbackText: [data?.feedbackText || ''],
        isTerminal: [data?.isTerminal || false],
      }),
    );
  }

  getOptionLetter(index: number): string {
    return this.optionLetters[index] || String(index + 1);
  }

  getQuestionLabels(): { index: number; text: string }[] {
    return this.questions.controls.map((q: any, idx: number) => ({
      index: idx,
      text: q.get('text')?.value || `Savol ${idx + 1}`,
    }));
  }

  removeQuestion(idx: number) {
    this.questions.removeAt(idx);
  }

  removeOption(qIdx: number, oIdx: number) {
    (this.questions.at(qIdx).get('options') as FormArray).removeAt(oIdx);
  }

  goBack() {
    this.router.navigate(['/admin/tests']);
  }

  submitForm() {
    if (this.testForm.invalid) {
      this.notify.warning("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    this.isSubmitting.set(true);
    const url = this.editMode()
      ? `${environment.apiUrl}/tests/${this.currentTestId()}`
      : `${environment.apiUrl}/tests`;
    const method = this.editMode() ? 'put' : 'post';

    this.http[method](url, this.testForm.value).subscribe({
      next: () => {
        this.notify.success('Muvaffaqiyatli saqlandi');
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/tests']);
      },
      error: () => {
        this.notify.error('Saqlashda xatolik yuz berdi');
        this.isSubmitting.set(false);
      },
    });
  }
}
