import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStore } from '../../../core/stores/auth.store';
import { NotifyService } from '../../../core/services/notify.service';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.css',
})
export class ProfileLayoutComponent {
  public authStore = inject(AuthStore);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private notify = inject(NotifyService);
  private router = inject(Router);

  logout() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Tizimdan chiqish',
        message: 'Haqiqatan ham tizimdan chiqmoqchimisiz?',
        okText: 'Chiqish',
        cancelText: 'Bekor qilish',
      },
      width: '520px',
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.authService.logout().subscribe({
        next: () => {
          this.notify.success('Tizimdan chiqdingiz');
          this.router.navigate(['/']);
        },
        error: () => this.notify.error('Xatolik yuz berdi'),
      });
    });
  }
}
