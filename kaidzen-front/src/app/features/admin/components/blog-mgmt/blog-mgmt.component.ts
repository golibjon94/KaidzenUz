import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminBlogService } from '../../services/admin-blog.service';
import { BlogPost } from '../../../../core/models/blog.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-blog-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzEmptyModule,
    NzModalModule
  ],
  templateUrl: './blog-mgmt.component.html',
  styleUrl: './blog-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogMgmtComponent implements OnInit {
  private blogService = inject(AdminBlogService);
  private notification = inject(NzNotificationService);
  private modal = inject(NzModalService);
  private router = inject(Router);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);

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
      }
    });
  }

  goAdd() {
    this.router.navigate(['/admin/blog/add']);
  }

  goEdit(id: string) {
    this.router.navigate(['/admin/blog/edit', id]);
  }

  deletePost(id: string) {
    this.modal.confirm({
      nzTitle: 'O\'chirishni tasdiqlaysizmi?',
      nzContent: 'Ushbu maqolani qayta tiklab bo\'lmaydi',
      nzOkText: 'O\'chirish',
      nzOkDanger: true,
      nzOnOk: () => {
        this.blogService.deletePost(id).subscribe(() => {
          this.notification.success('Muvaffaqiyat', 'Maqola o\'chirildi');
          this.loadPosts();
        });
      }
    });
  }
}
