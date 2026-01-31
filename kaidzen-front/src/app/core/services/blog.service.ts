import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BlogPost, CreatePostDto } from '../models/blog.model';
import { BlogStatus } from '../models/enums';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/blog`;

  getPosts(status?: BlogStatus) {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<{data: BlogPost[]}>(this.apiUrl, { params }).pipe(
      map(res => res.data || [])
    );
  }

  getBySlug(slug: string) {
    return this.http.get<{data: BlogPost}>(`${this.apiUrl}/${slug}`).pipe(
      map(res => res.data)
    );
  }

  // Admin methods
  createPost(data: CreatePostDto) {
    return this.http.post<BlogPost>(this.apiUrl, data);
  }

  updatePost(id: string, data: Partial<CreatePostDto>) {
    return this.http.patch<BlogPost>(`${this.apiUrl}/${id}`, data);
  }

  deletePost(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
