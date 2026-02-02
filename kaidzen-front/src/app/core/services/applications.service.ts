import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application, CreateApplicationDto } from '../models/application.model';
import { ApplicationStatus } from '../models/enums';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private http = inject(HttpClient);
  private apiUrl = '/applications';

  submitApplication(data: CreateApplicationDto) {
    return this.http.post<Application>(this.apiUrl, data);
  }

  // Admin methods
  getApplications() {
    return this.http.get<{data: Application[]}>(this.apiUrl).pipe(
      map(res => res.data || [])
    );
  }

  updateStatus(id: string, status: ApplicationStatus) {
    return this.http.patch<Application>(`${this.apiUrl}/${id}/status`, { status });
  }
}
