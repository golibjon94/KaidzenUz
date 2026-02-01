import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { CookieService } from '../services/cookie.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private cookieService = inject(CookieService);

  private _user = signal<User | null>(null);
  private _loading = signal(false);

  private _accessToken = signal<string | null>(this.cookieService.get('access_token'));
  private _refreshToken = signal<string | null>(this.cookieService.get('refresh_token'));
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

    // set(name, value, days, path) - ob'ekt emas, raqam bering!
    this.cookieService.set('access_token', accessToken, 7, '/');
    this.cookieService.set('refresh_token', refreshToken, 7, '/');
  }

  clearAuth() {
    this._user.set(null);
    this._accessToken.set(null);
    this._refreshToken.set(null);

    this.cookieService.delete('access_token', '/');
    this.cookieService.delete('refresh_token', '/');
  }
  getAccessToken() {
    return this._accessToken();
  }
}
