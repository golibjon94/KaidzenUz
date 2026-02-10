import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../../../core/services/auth.service';
import { AuthStore } from '../../../../core/stores/auth.store';
import { NotifyService } from '../../../../core/services/notify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public authStore = inject(AuthStore);
  public notify = inject(NotifyService);

  isLoginModalVisible = signal(false);
  isLoading = signal(false);
  hidePassword = true;

  loginForm: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showLoginModal() {
    this.isLoginModalVisible.set(true);
  }

  handleLoginCancel() {
    this.isLoginModalVisible.set(false);
    this.loginForm.reset();
  }

  handleLogin() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const loginData = {
        ...this.loginForm.value,
        phone: `+998${this.loginForm.value.phone}`,
      };

      this.authService.login(loginData).subscribe({
        next: () => {
          this.authService.getMe().subscribe({
            next: () => {
              this.notify.success('Tizimga muvaffaqiyatli kirdingiz!');
              this.isLoginModalVisible.set(false);
              this.loginForm.reset();
              this.isLoading.set(false);
              this.router.navigate(['/profile']);
            },
            error: () => {
              this.notify.error('Profil yuklashda xatolik!');
              this.isLoading.set(false);
            },
          });
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

  logout() {
    Swal.fire({
      title: 'Tizimdan chiqish',
      text: 'Haqiqatan ham tizimdan chiqmoqchimisiz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Chiqish',
      cancelButtonText: 'Bekor qilish',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) return;

      Swal.fire({
        title: 'Chiqilmoqda... ',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      this.authService.logout().subscribe({
        next: () => {
          Swal.close();
          this.notify.success('Tizimdan chiqdingiz');
          this.router.navigate(['/']);
        },
        error: () => {
          Swal.close();
          this.notify.error('Chiqishda xatolik yuz berdi');
        },
      });
    });
  }

  goToRegister() {
    this.isLoginModalVisible.set(false);
    this.router.navigate(['/auth/register']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToTests() {
    if (this.authStore.isAuthenticated()) {
      this.router.navigate(['/profile/tests']);
    } else {
      this.showLoginModal();
    }
  }
}
