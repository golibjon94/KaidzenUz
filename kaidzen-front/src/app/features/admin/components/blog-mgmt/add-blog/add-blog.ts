import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { QuillModule } from 'ngx-quill';

import { AdminBlogService } from '../../../services/admin-blog.service';
import { FileService } from '../../../../../core/services/file.service';
import { NotifyService } from '../../../../../core/services/notify.service';
import { BlogStatus } from '../../../../../core/models/enums';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
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
  private notify = inject(NotifyService);

  baseUrl = environment.apiUrl.replace('/api', '');

  loading = signal(false);
  saving = signal(false);

  editingId = signal<string | null>(null);
  isEdit = computed(() => !!this.editingId());

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
        this.notify.error("Maqolani yuklab bo'lmadi");
        this.loading.set(false);
        this.router.navigate(['/admin/blog']);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileService.uploadFile(file).subscribe({
        next: (res) => {
          this.form.patchValue({ imageId: res.data.id });
          this.imagePreviewUrl.set(this.baseUrl + res.data.url);
          this.notify.success('Rasm muvaffaqiyatli yuklandi');
        },
        error: () => {
          this.notify.error('Rasmni yuklashda xatolik yuz berdi');
        },
      });
    }
  }

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
      this.notify.warning("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const request = this.isEdit()
      ? this.blogService.updatePost(this.editingId()!, payload)
      : this.blogService.createPost(payload as any);

    request.subscribe({
      next: () => {
        this.notify.success(this.isEdit() ? 'Maqola yangilandi' : 'Maqola yaratildi');
        this.saving.set(false);
        this.router.navigate(['/admin/blog']);
      },
      error: () => {
        this.notify.error('Saqlashda xatolik yuz berdi');
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
