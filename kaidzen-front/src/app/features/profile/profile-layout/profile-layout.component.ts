import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStore } from '../../../core/stores/auth.store';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NzIconModule, NzAvatarModule, NzModalModule],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.css',
})
export class ProfileLayoutComponent {
  public authStore = inject(AuthStore);
  private authService = inject(AuthService);
  private modal = inject(NzModalService);
  private message = inject(NzMessageService);
  private router = inject(Router);

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
}
