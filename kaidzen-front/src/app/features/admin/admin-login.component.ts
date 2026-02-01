import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../core/services/auth.service';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzCardModule
  ],
  templateUrl: './admin-login.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `]
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private notification = inject(NzNotificationService);

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
            this.notification.success('Muvaffaqiyat', 'Admin paneliga xush kelibsiz!');
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.notification.error('Xatolik', 'Sizda admin huquqlari yo\'q!');
            this.authService.logout().subscribe();
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.notification.error('Xatolik', 'Login yoki parol noto\'g\'ri!');
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
