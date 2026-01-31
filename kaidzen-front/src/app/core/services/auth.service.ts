import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/user.model';
import { SignupDto, LoginDto } from '../models/auth.model';
import { AuthStore } from '../stores/auth.store';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);
  private apiUrl = `${environment.apiUrl}/auth`;

  signup(data: SignupDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data).pipe(
      tap(res => {
        this.authStore.setUser(res.user);
        this.authStore.setTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  login(data: LoginDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        this.authStore.setUser(res.user);
        this.authStore.setTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  logout() {
    const refreshToken = this.authStore.refreshToken();
    return this.http.post(`${this.apiUrl}/logout`, { refreshToken }).pipe(
      tap(() => this.authStore.clearAuth())
    );
  }

  refreshToken(token: string) {
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.apiUrl}/refresh`, { refreshToken: token }).pipe(
      tap(res => this.authStore.setTokens(res.accessToken, res.refreshToken))
    );
  }
}
