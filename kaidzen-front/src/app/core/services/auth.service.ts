import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models/user.model';
import { SignupDto, LoginDto } from '../models/auth.model';
import { AuthStore } from '../stores/auth.store';
import { tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);
  private apiUrl = `${environment.apiUrl}/auth`;
  private usersUrl = `${environment.apiUrl}/users`;

  getMe() {
    return this.http.get<{ data: User }>(`${this.usersUrl}/me`).pipe(
      tap(res => {
        this.authStore.setUser(res.data);
      })
    );
  }

  signup(data: SignupDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data).pipe(
      tap(res => {
        this.authStore.setTokens(res.accessToken, res.refreshToken);
        this.authStore.setUser(res.user);
      })
    );
  }

  login(data: LoginDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        this.authStore.setTokens(res.accessToken, res.refreshToken);
        this.authStore.setUser(res.user);
      })
    );
  }

  logout() {
    const refreshToken = this.authStore.refreshToken();
    return this.http.post(`${this.apiUrl}/logout`, { refreshToken }).pipe(
      tap(() => this.authStore.clearAuth()),
      catchError(err => {
        this.authStore.clearAuth();
        throw err;
      })
    );
  }

  refreshToken(token: string) {
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.apiUrl}/refresh`, { refreshToken: token }).pipe(
      tap(res => this.authStore.setTokens(res.accessToken, res.refreshToken))
    );
  }
}
