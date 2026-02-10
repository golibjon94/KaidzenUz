import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  sidenavOpened = signal(true);

  toggleSidenav() {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  logout() {
    Swal.fire({
      title: 'Tizimdan chiqish',
      text: 'Admin paneldan chiqmoqchimisiz?',
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
          this.router.navigate(['/admin/login']);
        },
        error: () => {
          Swal.close();
        },
      });
    });
  }
}
