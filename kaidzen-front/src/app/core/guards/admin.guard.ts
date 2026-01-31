import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../stores/auth.store';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);

  // SSR da guardni o'tkazib yuborish (serverda localStorage yo'q)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Agar token umuman yo'q bo'lsa
  if (!authStore.isAuthenticated()) {
    router.navigate(['/admin/login']);
    return false;
  }

  // 2. Agar user ma'lumotlari allaqachon yuklangan bo'lsa
  if (authStore.user()) {
    if (authStore.isAdmin()) {
      return true;
    }
    router.navigate(['/admin/login']);
    return false;
  }

  // 3. Token bor, lekin user ma'lumotlari yo'q (masalan, sahifa yangilanganda)
  return authService.getMe().pipe(
    map(res => {
      if (res.data.role === 'ADMIN') {
        return true;
      }
      router.navigate(['/admin/login']);
      return false;
    }),
    catchError(() => {
      authStore.clearAuth(); // Xatolik bo'lsa tokenni tozalash
      router.navigate(['/admin/login']);
      return of(false);
    })
  );
};
