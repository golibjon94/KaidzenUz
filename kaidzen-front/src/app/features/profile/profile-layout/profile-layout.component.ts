import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStore } from '../../../core/stores/auth.store';
import { NotifyService } from '../../../core/services/notify.service';
import Swal from 'sweetalert2';

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
          this.notify.error('Xatolik yuz berdi');
        },
      });
    });
  }
}
