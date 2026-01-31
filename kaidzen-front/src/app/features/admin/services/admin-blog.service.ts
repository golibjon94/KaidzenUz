import { Injectable, inject } from '@angular/core';
import { BlogService } from '../../../core/services/blog.service';
import { CreatePostDto } from '../../../core/models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class AdminBlogService {
  private blogService = inject(BlogService);

  getPosts() {
    return this.blogService.getPosts();
  }

  createPost(data: CreatePostDto) {
    return this.blogService.createPost(data);
  }

  updatePost(id: string, data: Partial<CreatePostDto>) {
    return this.blogService.updatePost(id, data);
  }

  deletePost(id: string) {
    return this.blogService.deletePost(id);
  }
}
