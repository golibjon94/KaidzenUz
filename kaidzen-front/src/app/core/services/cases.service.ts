import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BusinessCase, CreateCaseDto } from '../models/case.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cases`;

  getCases() {
    return this.http.get<{data: BusinessCase[]}>(this.apiUrl).pipe(
      map(res => res.data || [])
    );
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
