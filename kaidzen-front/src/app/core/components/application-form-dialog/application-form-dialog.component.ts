import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationsService } from '../../services/applications.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-application-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="dialog-wrapper">
      <!-- Decorative top accent -->
      <div class="accent-bar"></div>

      <!-- Close button -->
      <button
        class="close-btn"
        aria-label="Yopish"
        (click)="close()"
        type="button"
      >
        <mat-icon>close</mat-icon>
      </button>

      <!-- Header -->
      <div class="dialog-header">
        <div class="header-icon">
          <mat-icon>mail_outline</mat-icon>
        </div>
        <h2 class="dialog-title">Ariza qoldirish</h2>
        <p class="dialog-subtitle">
          Ma'lumotlaringizni qoldiring, biz siz bilan bog'lanamiz
        </p>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dialog-form">
        <!-- Full Name -->
        <mat-form-field appearance="outline" class="form-field-full">
          <mat-label>To'liq ism sharif</mat-label>
          <mat-icon matPrefix class="field-icon">person_outline</mat-icon>
          <input
            matInput
            formControlName="fullName"
            required
            placeholder="Ism Familiya"
          />
          @if (form.get('fullName')?.hasError('required') &&
          form.get('fullName')?.touched) {
            <mat-error>Ism kiritish majburiy</mat-error>
          }
        </mat-form-field>

        <!-- Phone -->
        <mat-form-field appearance="outline" class="form-field-full">
          <mat-label>Telefon raqam</mat-label>
          <mat-icon matPrefix class="field-icon">phone_outlined</mat-icon>
          <input
            matInput
            formControlName="phone"
            required
            placeholder="+998 90 123 45 67"
          />
          @if (form.get('phone')?.hasError('required') &&
          form.get('phone')?.touched) {
            <mat-error>Telefon raqam kiritish majburiy</mat-error>
          }
        </mat-form-field>

        <!-- Company Name -->
        <mat-form-field appearance="outline" class="form-field-full">
          <mat-label>Kompaniya nomi (ixtiyoriy)</mat-label>
          <mat-icon matPrefix class="field-icon">business_outlined</mat-icon>
          <input
            matInput
            formControlName="companyName"
            placeholder="Kompaniya nomi"
          />
        </mat-form-field>

        <!-- Message -->
        <mat-form-field appearance="outline" class="form-field-full">
          <mat-label>Xabar</mat-label>
          <mat-icon matPrefix class="field-icon field-icon-top"
          >chat_bubble_outline</mat-icon
          >
          <textarea
            matInput
            rows="3"
            formControlName="message"
            placeholder="Qisqacha ehtiyojingizni yozing..."
          ></textarea>
          @if (form.get('message')?.hasError('required') &&
          form.get('message')?.touched) {
            <mat-error>Xabar kiritish majburiy</mat-error>
          }
        </mat-form-field>

        <!-- Actions -->
        <div class="dialog-actions">
          <button
            mat-stroked-button
            type="button"
            (click)="close()"
            [disabled]="loading"
            class="btn-cancel"
          >
            Bekor qilish
          </button>
          <button
            mat-flat-button
            color="primary"
            type="submit"
            [disabled]="form.invalid || loading"
            class="btn-submit"
          >
            @if (loading) {
              <span class="btn-content">
              <mat-icon class="spin-icon">autorenew</mat-icon>
              Yuborilmoqda...
            </span>
            } @else {
              <span class="btn-content">
              <mat-icon>send</mat-icon>
              Yuborish
            </span>
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .dialog-wrapper {
        position: relative;
        padding: 32px 28px 28px;
        overflow: hidden;
      }

      /* Decorative accent bar at top */
      .accent-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #1565c0, #42a5f5, #1565c0);
        border-radius: 0 0 2px 2px;
      }

      /* Close button */
      .close-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9e9e9e;
        transition: all 0.2s ease;
        z-index: 10;
      }

      .close-btn:hover {
        background: #f5f5f5;
        color: #616161;
      }

      .close-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      /* Header */
      .dialog-header {
        text-align: center;
        margin-bottom: 28px;
      }

      .header-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
      }

      .header-icon mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #1565c0;
      }

      .dialog-title {
        font-size: 22px;
        font-weight: 700;
        color: #212121;
        margin: 0 0 6px;
        letter-spacing: -0.3px;
      }

      .dialog-subtitle {
        font-size: 14px;
        color: #757575;
        margin: 0;
        line-height: 1.4;
      }

      /* Form */
      .dialog-form {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .form-field-full {
        width: 100%;
      }

      /* Icon inside fields */
      .field-icon {
        color: #9e9e9e;
        font-size: 20px;
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }

      .field-icon-top {
        align-self: flex-start;
        margin-top: 2px;
      }

      /* Override mat-form-field spacing to prevent overlap */
      :host ::ng-deep .mat-mdc-form-field {
        margin-bottom: 2px;
      }

      :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        margin-bottom: 4px;
      }

      :host ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: #fafbfc;
        border-radius: 12px !important;
      }

      :host ::ng-deep .mdc-notched-outline__leading,
      :host ::ng-deep .mdc-notched-outline__trailing,
      :host ::ng-deep .mdc-notched-outline__notch {
        border-color: #e0e0e0 !important;
      }

      :host
        ::ng-deep
        .mat-mdc-form-field-focus-indicator
        + .mdc-notched-outline
        .mdc-notched-outline__leading,
      :host
        ::ng-deep
        .mat-mdc-form-field.mat-focused
        .mdc-notched-outline__leading,
      :host
        ::ng-deep
        .mat-mdc-form-field.mat-focused
        .mdc-notched-outline__trailing,
      :host
        ::ng-deep
        .mat-mdc-form-field.mat-focused
        .mdc-notched-outline__notch {
        border-color: #1565c0 !important;
        border-width: 2px;
      }

      :host ::ng-deep .mdc-notched-outline {
        border-radius: 12px !important;
      }

      :host ::ng-deep .mdc-notched-outline__leading {
        border-radius: 12px 0 0 12px !important;
      }

      :host ::ng-deep .mdc-notched-outline__trailing {
        border-radius: 0 12px 12px 0 !important;
      }

      /* Actions */
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 12px;
        padding-top: 20px;
        border-top: 1px solid #f0f0f0;
      }

      .btn-cancel {
        border-radius: 12px !important;
        padding: 0 24px !important;
        height: 44px !important;
        font-weight: 500 !important;
        color: #616161 !important;
        border-color: #e0e0e0 !important;
        transition: all 0.2s ease !important;
      }

      .btn-cancel:hover:not(:disabled) {
        background: #f5f5f5 !important;
        border-color: #bdbdbd !important;
      }

      .btn-submit {
        border-radius: 12px !important;
        padding: 0 28px !important;
        height: 44px !important;
        font-weight: 600 !important;
        background: linear-gradient(
          135deg,
          #1565c0,
          #1976d2
        ) !important;
        color: white !important;
        box-shadow: 0 4px 14px rgba(21, 101, 192, 0.3) !important;
        transition: all 0.25s ease !important;
      }

      .btn-submit:hover:not(:disabled) {
        box-shadow: 0 6px 20px rgba(21, 101, 192, 0.4) !important;
        transform: translateY(-1px);
      }

      .btn-submit:disabled {
        background: #e0e0e0 !important;
        box-shadow: none !important;
        color: #9e9e9e !important;
      }

      .btn-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .btn-content mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      /* Spin animation */
      .spin-icon {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      /* Responsive */
      @media (max-width: 480px) {
        .dialog-wrapper {
          padding: 24px 20px 20px;
        }

        .dialog-actions {
          flex-direction: column-reverse;
        }

        .btn-cancel,
        .btn-submit {
          width: 100%;
        }
      }
    `,
  ],
})
export class ApplicationFormDialogComponent {
  private fb = inject(FormBuilder);
  private service = inject(ApplicationsService);
  private notify = inject(NotifyService);
  private dialogRef = inject(MatDialogRef<ApplicationFormDialogComponent>);

  loading = false;
  form = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    companyName: [''],
    message: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.service.submitApplication(this.form.value as any).subscribe({
      next: () => {
        this.notify.success(
          "Arizangiz muvaffaqiyatli yuborildi. Tez orada bog'lanamiz"
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.notify.error("Ariza yuborishda xatolik. Qayta urinib ko'ring");
        this.loading = false;
      },
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
