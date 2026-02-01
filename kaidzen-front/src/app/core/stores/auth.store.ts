import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { CookieService } from '../services/cookie.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private cookieService = inject(CookieService);

  // Signals
  private _user = signal<User | null>(null);
  private _loading = signal(false);

  // Initialize tokens from cookies (works on both SSR and Browser)
  private _accessToken = signal<string | null>(this.cookieService.get('accessToken'));
  private _refreshToken = signal<string | null>(this.cookieService.get('refreshToken'));

  // Computed signals
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();
  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');

  // Methods
  setUser(user: User | null) {
    this._user.set(user);
  }

  setTokens(accessToken: string, refreshToken: string) {
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);

    this.cookieService.set('accessToken', accessToken);
    this.cookieService.set('refreshToken', refreshToken);
  }

  clearAuth() {
    this._user.set(null);
    this._accessToken.set(null);
    this._refreshToken.set(null);

    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
  }

  getAccessToken() {
    return this._accessToken();
  }
}
