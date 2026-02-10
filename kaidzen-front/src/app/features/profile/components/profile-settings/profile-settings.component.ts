import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthStore } from '../../../../core/stores/auth.store';
import { UsersService } from '../../../../core/services/users.service';
import { NotifyService } from '../../../../core/services/notify.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css',
})
export class ProfileSettingsComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private usersService = inject(UsersService);
  private notify = inject(NotifyService);

  user = this.authStore.user;
  loading = signal(false);

  form = this.fb.group({
    fullName: [this.user()?.fullName || '', [Validators.required]],
    address: [this.user()?.address || '']
  });

  submit() {
    if (this.form.valid) {
      this.loading.set(true);
      this.usersService.updateProfile(this.form.value).subscribe({
        next: (user) => {
          this.authStore.setUser(user);
          this.notify.success('Profil muvaffaqiyatli yangilandi');
          this.loading.set(false);
        },
        error: () => {
          this.notify.error('Xatolik yuz berdi');
          this.loading.set(false);
        }
      });
    }
  }
}
