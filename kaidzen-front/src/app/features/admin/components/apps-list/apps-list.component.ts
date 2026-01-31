import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { FormsModule } from '@angular/forms';
import { AdminAppsService } from '../../services/admin-apps.service';
import { Application } from '../../../../core/models/application.model';
import { ApplicationStatus } from '../../../../core/models/enums';

@Component({
  selector: 'app-apps-list',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzTagModule, NzSelectModule, NzEmptyModule, FormsModule],
  templateUrl: './apps-list.component.html',
  styleUrl: './apps-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppsListComponent implements OnInit {
  private appsService = inject(AdminAppsService);

  apps = signal<Application[]>([]);
  loading = signal(true);
  statuses = Object.values(ApplicationStatus);

  ngOnInit() {
    this.loadApps();
  }

  loadApps() {
    this.loading.set(true);
    this.appsService.getApplications().subscribe({
      next: (data) => {
        this.apps.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.apps.set([]);
        this.loading.set(false);
      }
    });
  }

  updateStatus(id: string, status: any) {
    this.appsService.updateStatus(id, status as ApplicationStatus).subscribe(() => {
      this.loadApps();
    });
  }
}
