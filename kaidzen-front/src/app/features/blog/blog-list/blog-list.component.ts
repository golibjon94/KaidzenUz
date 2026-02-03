import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BlogService } from '../../../core/services/blog.service';
import { BlogPost } from '../../../core/models/blog.model';
import { BlogStatus } from '../../../core/models/enums';
import { environment } from '../../../../environments/environment';
import {HeaderComponent} from '../../home/components/header/header.component';
import {FooterComponent} from '../../home/components/footer/footer.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NzCardModule, NzButtonModule, NzIconModule, HeaderComponent, FooterComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  private blogService = inject(BlogService);
  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  baseUrl = environment.apiUrl.replace('/api', '');

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    this.blogService.getPosts(BlogStatus.PUBLISHED).subscribe({
      next: (data) => {
        this.posts.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
