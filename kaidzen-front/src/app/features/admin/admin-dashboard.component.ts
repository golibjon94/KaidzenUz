import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AdminUsersService } from './services/admin-users.service';
import { AdminAppsService } from './services/admin-apps.service';
import { AdminBlogService } from './services/admin-blog.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NzGridModule, NzCardModule, NzIconModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  private usersService = inject(AdminUsersService);
  private appsService = inject(AdminAppsService);
  private blogService = inject(AdminBlogService);
  private cdr = inject(ChangeDetectorRef);

  stats = {
    usersCount: 0,
    appsCount: 0,
    postsCount: 0,
    activeTests: 0
  };

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      users: this.usersService.getUsers(),
      apps: this.appsService.getApplications(),
      posts: this.blogService.getPosts()
    }).subscribe({
      next: (res) => {
        this.stats.usersCount = res.users.length;
        this.stats.appsCount = res.apps.length;
        this.stats.postsCount = res.posts.length;
        this.cdr.markForCheck();
      }
    });
  }
}
