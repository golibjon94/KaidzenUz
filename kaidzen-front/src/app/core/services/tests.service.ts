import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Test, TestResult } from '../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class TestsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tests`;

  getAll() {
    return this.http.get<Test[]>(this.apiUrl);
  }

  getBySlug(slug: string) {
    return this.http.get<Test>(`${this.apiUrl}/${slug}`);
  }

  submit(slug: string, answers: any) {
    return this.http.post<TestResult>(`${this.apiUrl}/${slug}/submit`, { answers });
  }

  // Admin methods
  create(data: Partial<Test>) {
    return this.http.post<Test>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Test>) {
    return this.http.patch<Test>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getResults() {
    return this.http.get<TestResult[]>(`${this.apiUrl}/results/me`);
  }

  getAllResults() {
    return this.http.get<TestResult[]>(`${this.apiUrl}/results/all`);
  }
}
