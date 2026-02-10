import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { QuillModule } from 'ngx-quill';

import { AdminBlogService } from '../../../services/admin-blog.service';
import { FileService } from '../../../../../core/services/file.service';
import { BlogStatus } from '../../../../../core/models/enums';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule,

    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzUploadModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
  ],
  templateUrl: './add-blog.html',
  styleUrl: './add-blog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBlog implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(AdminBlogService);
  private fileService = inject(FileService);
  private notification = inject(NzNotificationService);

  baseUrl = environment.apiUrl.replace('/api', '');

  loading = signal(false);
  saving = signal(false);

  editingId = signal<string | null>(null);
  isEdit = computed(() => !!this.editingId());

  // UI uchun: yuklangan/bor rasmni ko'rsatish
  imagePreviewUrl = signal<string | null>(null);

  blogStatus = BlogStatus;

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    content: ['', [Validators.required]],
    imageId: this.fb.control<string | null>(null),
    status: this.fb.nonNullable.control<BlogStatus>(BlogStatus.DRAFT, [Validators.required]),
  });

  quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(id);
      this.loadForEdit(id);
    }

    this.setupAutoSlug();
  }

  private setupAutoSlug() {
    this.form.get('title')?.valueChanges.subscribe((value) => {
      const slugCtrl = this.form.get('slug');
      if (!slugCtrl) return;
      if (slugCtrl.dirty) return;

      const slug = this.slugify(value || '');
      slugCtrl.setValue(slug, { emitEvent: false });
    });
  }

  private loadForEdit(id: string) {
    this.loading.set(true);
    this.blogService.getById(id).subscribe({
      next: (post) => {
        this.form.patchValue({
          title: post.title,
          slug: post.slug,
          content: post.content,
          imageId: post.imageId,
          status: post.status,
        });

        if (post.image?.path) {
          this.imagePreviewUrl.set(this.baseUrl + post.image.path);
        }

        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Xatolik', 'Maqolani yuklab bo\'lmadi');
        this.loading.set(false);
        this.router.navigate(['/admin/blog']);
      },
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileService.uploadFile(file as any).subscribe({
      next: (res) => {
        this.form.patchValue({ imageId: res.data.id });
        this.imagePreviewUrl.set(this.baseUrl + res.data.url);
        this.notification.success('Muvaffaqiyat', 'Rasm muvaffaqiyatli yuklandi');
      },
      error: () => {
        this.notification.error('Xatolik', 'Rasmni yuklashda xatolik yuz berdi');
      },
    });
    return false;
  };

  removeImage() {
    this.form.patchValue({ imageId: null });
    this.imagePreviewUrl.set(null);
  }

  save() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.notification.warning('Diqqat', 'Iltimos, barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const request = this.isEdit()
      ? this.blogService.updatePost(this.editingId()!, payload)
      : this.blogService.createPost(payload as any);

    request.subscribe({
      next: () => {
        this.notification.success('Muvaffaqiyat', this.isEdit() ? 'Maqola yangilandi' : 'Maqola yaratildi');
        this.saving.set(false);
        this.router.navigate(['/admin/blog']);
      },
      error: () => {
        this.notification.error('Xatolik', 'Saqlashda xatolik yuz berdi');
        this.saving.set(false);
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/blog']);
  }

  private slugify(input: string): string {
    return (input || '')
      .toLowerCase()
      .trim()
      .replace(/['`]/g, '')
      .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
