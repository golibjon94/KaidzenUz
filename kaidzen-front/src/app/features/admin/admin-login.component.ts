import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-login.component.html',
  styles: [`
    :host { display: block; }

    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3a5f 0%, #1a237e 50%, #283593 100%);
      padding: 24px;
    }

    .login-container {
      width: 100%;
      max-width: 420px;
    }

    /* Logo */
    .login-logo {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-circle {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .login-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 8px;
    }

    .login-subtitle {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      margin: 0;
    }

    /* Card */
    .login-card {
      background: #fff;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    /* Labels */
    .field-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8px;
      margin-top: 16px;
    }

    .field-label:first-of-type {
      margin-top: 0;
    }

    /* Phone row */
    .phone-row {
      display: flex;
      align-items: flex-start;
      gap: 0;
    }

    .phone-prefix {
      height: 56px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      background: #f1f5f9;
      color: #334155;
      font-weight: 600;
      font-size: 0.9rem;
      border: 1px solid #e2e8f0;
      border-right: none;
      border-radius: 4px 0 0 4px;
    }

    /* Login button */
    .login-btn {
      height: 48px;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 10px !important;
      margin-top: 24px;
    }

    /* Home link */
    .home-link {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #f1f5f9;
    }

    .home-link button {
      color: #64748b;
    }

    /* Footer */
    .login-footer {
      text-align: center;
      margin-top: 24px;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
  `],
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  hidePassword = true;

  loginForm: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  handleLogin() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const loginData = {
        ...this.loginForm.value,
        phone: `+998${this.loginForm.value.phone}`,
      };
      this.authService.login(loginData).subscribe({
        next: () => {
          const user = this.authStore.user();
          if (user?.role === 'ADMIN') {
            this.snackBar.open('Admin paneliga xush kelibsiz!', 'Yopish', { duration: 3000 });
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.snackBar.open("Sizda admin huquqlari yo'q!", 'Yopish', { duration: 3000 });
            this.authService.logout().subscribe();
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.snackBar.open("Login yoki parol noto'g'ri!", 'Yopish', { duration: 3000 });
          this.isLoading.set(false);
        },
      });
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
