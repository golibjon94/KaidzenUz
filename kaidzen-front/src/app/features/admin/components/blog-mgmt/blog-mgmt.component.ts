import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminBlogService } from '../../services/admin-blog.service';
import { FileService } from '../../../../core/services/file.service';
import { BlogPost } from '../../../../core/models/blog.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-blog-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzEmptyModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzUploadModule
  ],
  templateUrl: './blog-mgmt.component.html',
  styleUrl: './blog-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogMgmtComponent implements OnInit {
  private blogService = inject(AdminBlogService);
  private fileService = inject(FileService);
  private fb = inject(FormBuilder);
  private notification = inject(NzNotificationService);
  private modal = inject(NzModalService);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  isModalVisible = signal(false);
  isSubmitting = signal(false);
  editingPost = signal<BlogPost | null>(null);

  baseUrl = environment.apiUrl.replace('/api', '');

  blogForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    content: ['', [Validators.required]],
    imageId: [null],
    status: ['DRAFT', [Validators.required]]
  });

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

  showModal(post?: BlogPost) {
    if (post) {
      this.editingPost.set(post);
      this.blogForm.patchValue({
        title: post.title,
        slug: post.slug,
        content: post.content,
        imageId: post.imageId,
        status: post.status
      });
    } else {
      this.editingPost.set(null);
      this.blogForm.reset({ status: 'DRAFT' });
    }
    this.isModalVisible.set(true);
  }

  handleCancel() {
    this.isModalVisible.set(false);
    this.blogForm.reset();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileService.uploadFile(file as any).subscribe({
      next: (res) => {
        // Backend returns { data: { id: "uuid", url: "/uploads/filename.ext" } } due to TransformInterceptor
        this.blogForm.patchValue({ imageId: res.data.id });
        this.notification.success('Muvaffaqiyat', 'Rasm muvaffaqiyatli yuklandi');
      },
      error: () => {
        this.notification.error('Xatolik', 'Rasmni yuklashda xatolik yuz berdi');
      }
    });
    return false;
  };

  submitForm() {
    if (this.blogForm.valid) {
      this.isSubmitting.set(true);
      const postData = { ...this.blogForm.value };

      const request = this.editingPost()
        ? this.blogService.updatePost(this.editingPost()!.id, postData)
        : this.blogService.createPost(postData);

      request.subscribe({
        next: () => {
          this.notification.success('Muvaffaqiyat', this.editingPost() ? 'Maqola yangilandi' : 'Maqola yaratildi');
          this.isModalVisible.set(false);
          this.isSubmitting.set(false);
          this.loadPosts();
        },
        error: () => {
          this.notification.error('Xatolik', 'Xatolik yuz berdi');
          this.isSubmitting.set(false);
        }
      });
    } else {
      Object.values(this.blogForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
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
