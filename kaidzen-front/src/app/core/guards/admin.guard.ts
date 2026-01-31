import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

export const adminGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const isAuthenticated = authStore.isAuthenticated();
  const isAdmin = authStore.isAdmin();

  if (isAuthenticated && isAdmin) {
    return true;
  }

  // Agar foydalanuvchi login qilmagan yoki admin emas bo'lsa, login sahifasiga yo'naltirish
  router.navigate(['/admin/login']);
  return false;
};
