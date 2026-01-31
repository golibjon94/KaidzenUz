import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Application, CreateApplicationDto } from '../models/application.model';
import { ApplicationStatus } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/applications`;

  submitApplication(data: CreateApplicationDto) {
    return this.http.post<Application>(this.apiUrl, data);
  }

  // Admin methods
  getApplications() {
    return this.http.get<Application[]>(this.apiUrl);
  }

  updateStatus(id: string, status: ApplicationStatus) {
    return this.http.patch<Application>(`${this.apiUrl}/${id}/status`, { status });
  }
}
