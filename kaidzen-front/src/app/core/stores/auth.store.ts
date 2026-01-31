import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  address?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  // Signals
  private _user = signal<User | null>(null);
  private _loading = signal(false);

  // LocalStorage dan tokenlarni olish (SSR da ehtiyot bo'lish kerak)
  private getInitialToken(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private _accessToken = signal<string | null>(this.getInitialToken('accessToken'));
  private _refreshToken = signal<string | null>(this.getInitialToken('refreshToken'));

  // Computed signals
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._accessToken() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');

  // Methods
  setUser(user: User | null) {
    this._user.set(user);
  }

  setTokens(accessToken: string, refreshToken: string) {
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  clearAuth() {
    this._user.set(null);
    this._accessToken.set(null);
    this._refreshToken.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  getAccessToken() {
    return this._accessToken();
  }
}
