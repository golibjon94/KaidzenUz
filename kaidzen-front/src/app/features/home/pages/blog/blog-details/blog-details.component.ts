import { Component, OnInit, SecurityContext, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogService } from '../../../../../core/services/blog.service';
import { BlogPost } from '../../../../../core/models/blog.model';
import { environment } from '../../../../../../environments/environment';
import {HeaderComponent} from '../../../components/header/header.component';
import {FooterComponent} from '../../../components/footer/footer.component';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, HeaderComponent, FooterComponent],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private sanitizer = inject(DomSanitizer);

  post = signal<BlogPost | null>(null);
  loading = signal(true);
  baseUrl = environment.apiUrl.replace('/api', '');
  safeContent = computed(() => {
    const content = this.post()?.content ?? '';
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, content) ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(sanitized);
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: string) {
    this.loading.set(true);
    this.blogService.getById(id).subscribe({
      next: (data) => {
        this.post.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
