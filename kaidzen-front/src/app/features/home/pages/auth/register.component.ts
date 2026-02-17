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
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styles: [`:host { display: block; }`],
})
export class RegisterComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotifyService);

  // Step tracking: 1 = phone + OTP, 2 = profile details
  currentStep = signal<1 | 2>(1);
  isLoading = signal(false);
  hidePassword = true;

  // OTP state
  otpSent = signal(false);
  countdown = signal(0);
  testOtpCode = signal<string | null>(null);
  private countdownInterval: any = null;

  // Step 1: Phone + OTP form
  phoneForm: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    otpCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^\d{4}$/)]],
  });

  // Step 2: Profile details form
  profileForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: [''],
  });

  ngOnDestroy() {
    this.clearCountdown();
  }

  // --- Step 1: Send OTP ---
  sendOtp() {
    const phoneControl = this.phoneForm.get('phone');
    if (phoneControl?.invalid) {
      phoneControl.markAsDirty();
      phoneControl.updateValueAndValidity();
      return;
    }

    const fullPhone = `+998${this.phoneForm.value.phone}`;
    this.isLoading.set(true);

    this.authService.sendOtp(fullPhone).subscribe({
      next: (res) => {
        this.otpSent.set(true);
        this.isLoading.set(false);
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
        if (err?.status === 409) {
          this.notify.error('Bu telefon raqam allaqachon tizimda ro\'yxatdan o\'tgan. Iltimos, login va parol bilan kiring.');
        } else {
          this.notify.error('SMS yuborishda xatolik!');
        }
      },
    });
  }

  // --- Step 1: Verify OTP ---
  verifyOtp() {
    if (this.phoneForm.invalid) {
      Object.values(this.phoneForm.controls).forEach(c => {
        if (c.invalid) { c.markAsDirty(); c.updateValueAndValidity(); }
      });
      return;
    }

    const fullPhone = `+998${this.phoneForm.value.phone}`;
    const code = this.phoneForm.value.otpCode;
    this.isLoading.set(true);

    this.authService.verifyOtp(fullPhone, code).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.data?.valid) {
          this.currentStep.set(2);
          this.clearCountdown();
          this.notify.success('Telefon tasdiqlandi!');
        } else {
          this.notify.error('Kod noto\'g\'ri yoki muddati o\'tgan!');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.notify.error('Tekshirishda xatolik!');
      },
    });
  }

  // --- Step 2: Complete Registration ---
  handleRegister() {
    if (this.profileForm.invalid) {
      Object.values(this.profileForm.controls).forEach(c => {
        if (c.invalid) { c.markAsDirty(); c.updateValueAndValidity(); }
      });
      return;
    }

    this.isLoading.set(true);
    const registerData = {
      fullName: this.profileForm.value.fullName,
      phone: `+998${this.phoneForm.value.phone}`,
      password: this.profileForm.value.password,
      address: this.profileForm.value.address,
    };

    this.authService.signup(registerData).subscribe({
      next: () => {
        this.notify.success("Ro'yxatdan o'tish muvaffaqiyatli!");
        this.isLoading.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err?.status === 409) {
          this.notify.error('Bu telefon raqam allaqachon tizimda ro\'yxatdan o\'tgan!');
        } else {
          this.notify.error("Ro'yxatdan o'tishda xatolik!");
        }
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
