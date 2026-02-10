import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

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
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }
}
