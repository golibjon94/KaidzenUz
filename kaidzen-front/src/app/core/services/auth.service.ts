import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { AuthResponse, User } from '../models/user.model';
import { SignupDto, LoginDto } from '../models/auth.model';
import { AuthStore } from '../stores/auth.store';
import { tap, catchError, of } from 'rxjs';
import { SsrCookieService } from 'ngx-cookie-service-ssr'; // Qo'shildi

import { LocalStorageEnum } from '../models/enums';

const USER_KEY = makeStateKey<User>('auth_user');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);
  private cookieService = inject(SsrCookieService); // Inject qilindi
  private apiUrl = '/auth';
  private usersUrl = '/users';

  // Cookie sozlamalari (Options)
  private cookieOptions = { path: '/', secure: true, sameSite: 'Lax' as const };

  getMe() {
    if (this.transferState.hasKey(USER_KEY)) {
      const user = this.transferState.get(USER_KEY, null);
      this.transferState.remove(USER_KEY);
      if (user) {
        this.authStore.setUser(user);
        return of({ data: user });
      }
    }

    return this.http.get<{ data: User }>(`${this.usersUrl}/me`).pipe(
      tap(res => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(USER_KEY, res.data);
        }
        this.authStore.setUser(res.data);
      })
    );
  }

  signup(data: SignupDto) {
    return this.http.post<{ data: AuthResponse }>(`${this.apiUrl}/signup`, data).pipe(
      tap(res => {
        // MUHIM: Tokenlarni cookie-ga yozish
        this.setCookies(res.data.accessToken, res.data.refreshToken);
        this.authStore.setTokens(res.data.accessToken, res.data.refreshToken);
        this.authStore.setUser(res.data.user);
      })
    );
  }

  login(data: LoginDto) {
    return this.http.post<{ data: AuthResponse }>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        // MUHIM: Tokenlarni cookie-ga yozish
        this.setCookies(res.data.accessToken, res.data.refreshToken);
        this.authStore.setTokens(res.data.accessToken, res.data.refreshToken);
        this.authStore.setUser(res.data.user);
      })
    );
  }

  logout() {
    const refreshToken = this.authStore.refreshToken();
    return this.http.post(`${this.apiUrl}/logout`, { refreshToken }).pipe(
      tap(() => this.clearAllAuth()),
      catchError(err => {
        this.clearAllAuth();
        throw err;
      })
    );
  }

  updateTokenWithRefreshToken() {
    const refreshToken = this.authStore.refreshToken();
    if (!refreshToken) {
      this.removeTokensAndNavigate();
      return of(null as any);
    }
    return this.http.post<{ data: { accessToken: string, refreshToken: string } }>(`${this.apiUrl}/refresh`, { refreshToken });
  }

  removeTokensAndNavigate() {
    this.clearAllAuth();
    // Bu yerda router inject qilib navigate qilish mumkin
  }

  // Yordamchi metodlar
  private setCookies(access: string, refresh: string) {
    this.cookieService.set(LocalStorageEnum.AccessToken, access, this.cookieOptions);
    this.cookieService.set(LocalStorageEnum.RefreshToken, refresh, this.cookieOptions);
  }

  private clearAllAuth() {
    this.cookieService.delete(LocalStorageEnum.AccessToken, '/');
    this.cookieService.delete(LocalStorageEnum.RefreshToken, '/');
    this.authStore.clearAuth();
  }
}
