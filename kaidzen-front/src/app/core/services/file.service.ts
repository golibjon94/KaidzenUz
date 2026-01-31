import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/file`;

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{data: {url: string}}>(`${this.apiUrl}/upload`, formData);
  }

  deleteFile(filename: string) {
    return this.http.delete<any>(`${this.apiUrl}/${filename}`);
  }
}
