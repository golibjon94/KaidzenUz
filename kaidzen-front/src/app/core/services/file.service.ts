import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FileService {
  private http = inject(HttpClient);
  private apiUrl = '/file';

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{data: {id: string; url: string}}>(`${this.apiUrl}/upload`, formData);
  }

  deleteFile(filename: string) {
    return this.http.delete<any>(`${this.apiUrl}/${filename}`);
  }
}
