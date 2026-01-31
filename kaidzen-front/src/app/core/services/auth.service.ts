import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models/user.model';
import { AuthStore } from '../stores/auth.store';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);
  private apiUrl = `${environment.apiUrl}/auth`;

  signup(data: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data).pipe(
      tap(res => {
        this.authStore.setUser(res.user);
        this.authStore.setTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  login(data: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        this.authStore.setUser(res.user);
        this.authStore.setTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.authStore.clearAuth())
    );
  }

  getMe() {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`).pipe(
      tap(res => this.authStore.setUser(res.user))
    );
  }

  refreshToken(token: string) {
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.apiUrl}/refresh`, { refreshToken: token }).pipe(
      tap(res => this.authStore.setTokens(res.accessToken, res.refreshToken))
    );
  }
}
