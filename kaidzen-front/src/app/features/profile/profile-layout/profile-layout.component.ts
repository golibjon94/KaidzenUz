import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import {NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStore } from '../../../core/stores/auth.store';
import { NotifyService } from '../../../core/services/notify.service';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    NzIconModule, NzAvatarModule, NzModalModule, NzTagModule, NzTooltipModule
  ],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.css',
})
export class ProfileLayoutComponent {
  public authStore = inject(AuthStore);
  private authService = inject(AuthService);
  private modal = inject(NzModalService);
  private notify = inject(NotifyService);
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
            this.notify.success('Tizimdan chiqdingiz');
            this.router.navigate(['/']);
          },
          error: () => this.notify.error('Xatolik yuz berdi')
        });
      },
      nzCancelText: 'Bekor qilish'
    });
  }
}
