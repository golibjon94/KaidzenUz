import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BusinessCase, CreateCaseDto } from '../models/case.model';

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cases`;

  getCases() {
    return this.http.get<BusinessCase[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<BusinessCase>(`${this.apiUrl}/${id}`);
  }

  // Admin methods
  createCase(data: CreateCaseDto) {
    return this.http.post<BusinessCase>(this.apiUrl, data);
  }

  deleteCase(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
