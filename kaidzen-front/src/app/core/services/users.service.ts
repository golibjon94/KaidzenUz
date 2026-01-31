import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll() {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  update(id: string, data: Partial<User>) {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
