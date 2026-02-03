import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Ng-Zorro Modullari
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

// Ng-Zorro Notification Servisi
import { NzNotificationService } from 'ng-zorro-antd/notification'; // Message o'rniga

// Shaxsiy Servislar va Store
import { AuthService } from '../../../../core/services/auth.service';
import { AuthStore } from '../../../../core/stores/auth.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzIconModule,
    NzTooltipModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NzNotificationService);
  private modal = inject(NzModalService);
  public authStore = inject(AuthStore);

  isLoginModalVisible = signal(false);
  isLoading = signal(false);

  // Login formasi
  loginForm: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
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
        phone: `+998${this.loginForm.value.phone}`
      };

      this.authService.login(loginData).subscribe({
        next: () => {
          this.authService.getMe().subscribe({
            next: () => {
              this.notification.success(
                'Muvaffaqiyat',
                'Tizimga muvaffaqiyatli kirdingiz!'
              );
              this.isLoginModalVisible.set(false);
              this.loginForm.reset();
              this.isLoading.set(false);
              this.router.navigate(['/profile']);
            },
            error: () => {
              this.notification.error(
                'Xatolik',
                'Profil ma\'lumotlarini yuklashda xatolik yuz berdi!'
              );
              this.isLoading.set(false);
            }
          });
        },
        error: () => {
          this.notification.error(
            'Kirish rad etildi',
            'Login yoki parol noto\'g\'ri!'
          );
          this.isLoading.set(false);
        }
      });
    } else {
      // Formani validatsiyadan o'tkazish
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  logout() {
    this.modal.confirm({
      nzTitle: 'Tizimdan chiqish',
      nzContent: 'Haqiqatan ham tizimdan chiqmoqchimisiz?',
      nzOkText: 'Chiqish',
      nzOkDanger: true,
      nzOnOk: () => {
        this.authService.logout().subscribe({
          next: () => {
            this.notification.success(
              'Tizimdan chiqish',
              'Siz hisobingizdan muvaffaqiyatli chiqdingiz'
            );
            this.router.navigate(['/']);
          },
          error: () => {
            this.notification.error(
              'Xatolik',
              'Tizimdan chiqishda muammo yuz berdi'
            );
          }
        });
      },
      nzCancelText: 'Bekor qilish'
    });
  }

  // Navigatsiya metodlari
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
