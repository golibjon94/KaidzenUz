import { Component, OnInit, inject, signal, ChangeDetectionStrategy, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
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
  dataSource = new MatTableDataSource<BlogPost>([]);
  loading = signal(true);
  displayedColumns: string[] = ['position', 'image', 'title', 'slug', 'status', 'createdAt', 'actions'];

  @ViewChild(MatPaginator) set paginator(content: MatPaginator | undefined) {
    if (content) {
      this.dataSource.paginator = content;
      this._paginator = content;
    }
  }
  private _paginator?: MatPaginator;
  get paginator(): MatPaginator | undefined {
    return this._paginator;
  }

  baseUrl = environment.apiUrl.replace('/api', '');

  constructor() {
    effect(() => {
      this.dataSource.data = this.posts();
    });
  }

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
    Swal.fire({
      title: "Maqolani o'chirish",
      text: "O'chirishni tasdiqlaysizmi? Ushbu amalni qaytarib bo'lmaydi.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Ha, o'chirish",
      cancelButtonText: 'Bekor qilish',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) return;

      Swal.fire({
        title: 'O\'chirilmoqda... ',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      this.blogService.deletePost(id).subscribe({
        next: () => {
          Swal.close();
          this.notify.success("Maqola muvaffaqiyatli o'chirildi");
          this.loadPosts();
        },
        error: () => {
          Swal.close();
          this.notify.error("Maqolani o'chirishda xatolik yuz berdi");
        },
      });
    });
  }
}
