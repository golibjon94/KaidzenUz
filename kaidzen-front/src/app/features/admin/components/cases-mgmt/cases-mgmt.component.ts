import { Component, OnInit, inject, signal, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminCasesService } from '../../services/admin-cases.service';
import { BusinessCase } from '../../../../core/models/case.model';

@Component({
  selector: 'app-cases-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzEmptyModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule
  ],
  templateUrl: './cases-mgmt.component.html',
  styleUrl: './cases-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasesMgmtComponent implements OnInit {
  private casesService = inject(AdminCasesService);
  private fb = inject(FormBuilder);
  private notification = inject(NzNotificationService);
  private modal = inject(NzModalService);
  private platformId = inject(PLATFORM_ID);

  cases = signal<BusinessCase[]>([]);
  loading = signal(true);
  isModalVisible = signal(false);
  isSubmitting = signal(false);

  caseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    problem: ['', [Validators.required]],
    solution: ['', [Validators.required]],
    result: ['', [Validators.required]],
    date: [null, [Validators.required]]
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCases();
    } else {
      this.loading.set(false); // SSR da loadingni o'chirish
    }
  }

  loadCases() {
    this.loading.set(true);
    this.casesService.getCases().subscribe({
      next: (data) => {
        this.cases.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.cases.set([]);
        this.loading.set(false);
      }
    });
  }

  showModal() {
    this.caseForm.reset();
    this.isModalVisible.set(true);
  }

  handleCancel() {
    this.isModalVisible.set(false);
  }

  submitForm() {
    if (this.caseForm.valid) {
      this.isSubmitting.set(true);
      this.casesService.createCase(this.caseForm.value).subscribe({
        next: () => {
          this.notification.success('Muvaffaqiyat', 'Keys yaratildi');
          this.isModalVisible.set(false);
          this.isSubmitting.set(false);
          this.loadCases();
        },
        error: () => {
          this.notification.error('Xatolik', 'Xatolik yuz berdi');
          this.isSubmitting.set(false);
        }
      });
    } else {
      Object.values(this.caseForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteCase(id: string) {
    this.modal.confirm({
      nzTitle: 'O\'chirishni tasdiqlaysizmi?',
      nzContent: 'Ushbu keysni qayta tiklab bo\'lmaydi',
      nzOkText: 'O\'chirish',
      nzOkDanger: true,
      nzOnOk: () => {
        this.casesService.deleteCase(id).subscribe(() => {
          this.notification.success('Muvaffaqiyat', 'Keys o\'chirildi');
          this.loadCases();
        });
      }
    });
  }
}
