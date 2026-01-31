import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { AdminBlogService } from '../../services/admin-blog.service';
import { BlogPost } from '../../../../core/models/blog.model';

@Component({
  selector: 'app-blog-mgmt',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzTagModule, NzIconModule, NzEmptyModule],
  templateUrl: './blog-mgmt.component.html',
  styleUrl: './blog-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogMgmtComponent implements OnInit {
  private blogService = inject(AdminBlogService);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    this.blogService.getPosts().subscribe({
      next: (data) => {
        this.posts.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.posts.set([]);
        this.loading.set(false);
      }
    });
  }

  deletePost(id: string) {
    if (confirm('Rostdan ham ushbu maqolani o\'chirmoqchimisiz?')) {
      this.blogService.deletePost(id).subscribe(() => {
        this.loadPosts();
      });
    }
  }
}
