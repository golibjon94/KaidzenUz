import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BlogPost } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/blog`;

  getAll() {
    return this.http.get<BlogPost[]>(this.apiUrl);
  }

  getBySlug(slug: string) {
    return this.http.get<BlogPost>(`${this.apiUrl}/${slug}`);
  }

  create(data: Partial<BlogPost>) {
    return this.http.post<BlogPost>(this.apiUrl, data);
  }

  update(id: string, data: Partial<BlogPost>) {
    return this.http.patch<BlogPost>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
