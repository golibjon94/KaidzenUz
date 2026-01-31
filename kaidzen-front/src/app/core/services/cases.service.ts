import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BusinessCase } from '../models/case.model';

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cases`;

  getAll() {
    return this.http.get<BusinessCase[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<BusinessCase>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<BusinessCase>) {
    return this.http.post<BusinessCase>(this.apiUrl, data);
  }

  update(id: string, data: Partial<BusinessCase>) {
    return this.http.patch<BusinessCase>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
