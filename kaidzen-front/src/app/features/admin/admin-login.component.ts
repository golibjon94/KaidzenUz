import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { AuthStore } from '../../core/stores/auth.store';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-admin-login',
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
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private notify = inject(NotifyService);

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
            this.notify.success('Admin paneliga xush kelibsiz!');
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.notify.error("Sizda admin huquqlari yo'q!");
            this.authService.logout().subscribe();
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.notify.error("Login yoki parol noto'g'ri!");
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
