import { Component, signal, inject, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AuthStore } from './core/stores/auth.store';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('kaidzen-front');
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);

  ngOnInit() {
    if (this.authStore.isAuthenticated()) {
      this.authService.getMe().subscribe({
        error: () => {
          this.authStore.clearAuth();
        }
      });
    }
  }
}
