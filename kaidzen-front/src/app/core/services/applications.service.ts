import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/applications`;

  submit(data: Partial<Application>) {
    return this.http.post<Application>(this.apiUrl, data);
  }

  getAll() {
    return this.http.get<Application[]>(this.apiUrl);
  }

  updateStatus(id: string, status: string) {
    return this.http.patch<Application>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
