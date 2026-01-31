import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { AuthStore } from './core/stores/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('kaidzen-front');
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);

  ngOnInit() {
    // Sahifa yangilanganda tokenni tekshirish va user ma'lumotlarini yuklash
    if (this.authStore.isAuthenticated()) {
      this.authService.getMe().subscribe({
        error: () => {
          // Agar token yaroqsiz bo'lsa yoki xatolik yuz bersa, auth holatini tozalash
          this.authStore.clearAuth();
        }
      });
    }
  }
}
