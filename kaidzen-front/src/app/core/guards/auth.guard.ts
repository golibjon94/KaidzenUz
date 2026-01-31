import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  // Agar foydalanuvchi login qilmagan bo'lsa, home sahifasiga qaytarish
  // (Home sahifasida login modalini ochish mantiqi bor)
  router.navigate(['/']);
  return false;
};
