import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Diagnostic } from '../models/diagnostic.model';

export interface CreateDiagnosticDto {
  name: string;
}

export interface UpdateDiagnosticDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiagnosticsService {
  private http = inject(HttpClient);
  private apiUrl = '/diagnostics';

  getAll() {
    return this.http.get<Diagnostic[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<Diagnostic>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateDiagnosticDto) {
    return this.http.post<Diagnostic>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateDiagnosticDto) {
    return this.http.patch<Diagnostic>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
