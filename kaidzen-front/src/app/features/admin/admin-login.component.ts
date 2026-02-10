import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
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
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-login.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: rgba(162, 159, 159, 0.3);
    }
  `]
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);

  loginForm: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  handleLogin() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const loginData = {
        ...this.loginForm.value,
        phone: `+998${this.loginForm.value.phone}`
      };
      this.authService.login(loginData).subscribe({
        next: () => {
          const user = this.authStore.user();
          if (user?.role === 'ADMIN') {
            this.snackBar.open('Admin paneliga xush kelibsiz!', 'Yopish', { duration: 3000 });
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.snackBar.open('Sizda admin huquqlari yo\'q!', 'Yopish', { duration: 3000 });
            this.authService.logout().subscribe();
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.snackBar.open('Login yoki parol noto\'g\'ri!', 'Yopish', { duration: 3000 });
          this.isLoading.set(false);
        }
      });
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
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
