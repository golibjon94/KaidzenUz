import { Component, signal, inject, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AuthStore } from './core/stores/auth.store';
import { SeoService } from './core/services/seo.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    MatProgressBarModule
  ],
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Sarash-front');
  loading = signal(false);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private seoService = inject(SeoService);
  private router = inject(Router);
  ngOnInit() {
    this.seoService.init();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading.set(false);
      }
    });

    if (this.authStore.isAuthenticated()) {
      this.authService.getMe().subscribe({
        error: () => {
          this.authStore.clearAuth();
        }
      });
    }
  }
}
