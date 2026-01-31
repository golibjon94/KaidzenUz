import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User, UpdateUserDto } from '../models/user.model';
import { AuthStore } from '../stores/auth.store';
import { tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);
  private apiUrl = `${environment.apiUrl}/users`;

  getMe() {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => this.authStore.setUser(user))
    );
  }

  updateMe(data: UpdateUserDto) {
    return this.http.patch<User>(`${this.apiUrl}/me`, data).pipe(
      tap(user => this.authStore.setUser(user))
    );
  }

  // Admin endpoints
  getUsers() {
    return this.http.get<{data: User[]}>(this.apiUrl).pipe(
      tap(res => console.log('Users response:', res)),
      map(res => res.data)
    );
  }
}
