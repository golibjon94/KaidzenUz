import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
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
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  public authStore = inject(AuthStore);

  isLoginModalVisible = signal(false);
  isLoading = signal(false);

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
              this.message.success('Tizimga muvaffaqiyatli kirdingiz!');
              this.isLoginModalVisible.set(false);
              this.loginForm.reset();
              this.isLoading.set(false);
              this.router.navigate(['/profile']);
            },
            error: () => {
              this.message.error('Profil ma\'lumotlarini yuklashda xatolik!');
              this.isLoading.set(false);
            }
          });
        },
        error: (err) => {
          this.message.error('Login yoki parol noto\'g\'ri!');
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

  goToRegister() {
    this.isLoginModalVisible.set(false);
    this.router.navigate(['/auth/register']);
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
            this.message.success('Tizimdan chiqdingiz');
            this.router.navigate(['/']);
          },
          error: () => {
            this.message.error('Xatolik yuz berdi');
          }
        });
      },
      nzCancelText: 'Bekor qilish'
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToTests() {
    this.router.navigate(['/profile/tests']);
  }
}
