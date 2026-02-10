import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminBlogService } from '../../services/admin-blog.service';
import { BlogPost } from '../../../../core/models/blog.model';
import { environment } from '../../../../../environments/environment';
import { NotifyService } from '../../../../core/services/notify.service';

@Component({
  selector: 'app-blog-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './blog-mgmt.component.html',
  styleUrl: './blog-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogMgmtComponent implements OnInit {
  private blogService = inject(AdminBlogService);
  private notify = inject(NotifyService);
  private router = inject(Router);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  displayedColumns: string[] = ['image', 'title', 'slug', 'status', 'createdAt', 'actions'];

  baseUrl = environment.apiUrl.replace('/api', '');

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
      },
    });
  }

  goAdd() {
    this.router.navigate(['/admin/blog/add']);
  }

  goEdit(id: string) {
    this.router.navigate(['/admin/blog/edit', id]);
  }

  deletePost(id: string) {
    if (confirm("O'chirishni tasdiqlaysizmi? Ushbu maqolani qayta tiklab bo'lmaydi.")) {
      this.blogService.deletePost(id).subscribe({
        next: () => {
          this.notify.success("Maqola muvaffaqiyatli o'chirildi");
          this.loadPosts();
        },
        error: () => {
          this.notify.error("Maqolani o'chirishda xatolik yuz berdi");
        },
      });
    }
  }
}
