import { Component, inject, signal, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';
import { NotifyService } from '../../../../core/services/notify.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './forgot-password.component.html',
  styles: [`:host { display: block; }`],
})
export class ForgotPasswordComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotifyService);

  // Step tracking: 1 = phone, 2 = OTP, 3 = new password
  currentStep = signal<1 | 2 | 3>(1);
  isLoading = signal(false);
  hidePassword = true;

  // OTP state
  countdown = signal(0);
  testOtpCode = signal<string | null>(null);
  private countdownInterval: any = null;

  // Step 1: Phone form
  phoneForm: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
  });

  // Step 2: OTP form
  otpForm: FormGroup = this.fb.group({
    otpCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^\d{4}$/)]],
  });

  // Step 3: New password form
  passwordForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnDestroy() {
    this.clearCountdown();
  }

  get fullPhone(): string {
    return `+998${this.phoneForm.value.phone}`;
  }

  // --- Step 1: Send OTP for reset ---
  sendOtp() {
    if (this.phoneForm.invalid) {
      Object.values(this.phoneForm.controls).forEach(c => {
        if (c.invalid) { c.markAsDirty(); c.updateValueAndValidity(); }
      });
      return;
    }

    this.isLoading.set(true);

    this.authService.sendOtpForReset(this.fullPhone).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.currentStep.set(2);
        this.startCountdown();
        if (res.data?.code) {
          this.testOtpCode.set(res.data.code);
          this.notify.success(`SMS kod yuborildi! Test kod: ${res.data.code}`);
        } else {
          this.testOtpCode.set(null);
          this.notify.success('SMS kod yuborildi!');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err?.status === 404) {
          this.notify.error('Bu telefon raqam tizimda topilmadi.');
        } else {
          this.notify.error('SMS yuborishda xatolik!');
        }
      },
    });
  }

  // --- Step 2: Verify OTP and go to password step ---
  verifyOtp() {
    if (this.otpForm.invalid) {
      Object.values(this.otpForm.controls).forEach(c => {
        if (c.invalid) { c.markAsDirty(); c.updateValueAndValidity(); }
      });
      return;
    }

    // OTP ni step 3 da resetPassword bilan birga tekshiramiz
    this.currentStep.set(3);
    this.clearCountdown();
    this.notify.success('Yangi parolni kiriting.');
  }

  // --- Step 3: Reset password ---
  handleResetPassword() {
    if (this.passwordForm.invalid) {
      Object.values(this.passwordForm.controls).forEach(c => {
        if (c.invalid) { c.markAsDirty(); c.updateValueAndValidity(); }
      });
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.notify.error('Parollar mos kelmaydi!');
      return;
    }

    this.isLoading.set(true);
    const code = this.otpForm.value.otpCode;

    this.authService.resetPassword(this.fullPhone, code, newPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notify.success('Parol muvaffaqiyatli yangilandi! Endi tizimga kiring.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err?.status === 400) {
          this.notify.error('Kod noto\'g\'ri yoki muddati o\'tgan.');
        } else {
          this.notify.error('Parolni yangilashda xatolik!');
        }
      },
    });
  }

  // --- Resend OTP ---
  resendOtp() {
    this.isLoading.set(true);

    this.authService.sendOtpForReset(this.fullPhone).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.startCountdown();
        if (res.data?.code) {
          this.testOtpCode.set(res.data.code);
          this.notify.success(`SMS kod qayta yuborildi! Test kod: ${res.data.code}`);
        } else {
          this.testOtpCode.set(null);
          this.notify.success('SMS kod qayta yuborildi!');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.notify.error('SMS yuborishda xatolik!');
      },
    });
  }

  // --- Countdown timer ---
  private startCountdown() {
    this.clearCountdown();
    this.countdown.set(60);
    this.countdownInterval = setInterval(() => {
      const val = this.countdown() - 1;
      this.countdown.set(val);
      if (val <= 0) this.clearCountdown();
    }, 1000);
  }

  private clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
}
