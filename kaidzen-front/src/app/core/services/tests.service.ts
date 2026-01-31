import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Test, TestResult, SubmitTestDto } from '../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class TestsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tests`;

  getTests() {
    return this.http.get<Test[]>(this.apiUrl);
  }

  getBySlug(slug: string) {
    return this.http.get<Test>(`${this.apiUrl}/${slug}`);
  }

  submitTest(data: SubmitTestDto) {
    return this.http.post<TestResult>(`${this.apiUrl}/submit`, data);
  }

  getMyResults() {
    return this.http.get<TestResult[]>(`${this.apiUrl}/my/results`);
  }
}
