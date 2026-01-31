import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { AdminAppsService } from '../../services/admin-apps.service';
import { Application } from '../../../../core/models/application.model';
import { ApplicationStatus } from '../../../../core/models/enums';

@Component({
  selector: 'app-apps-list',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzTagModule, NzSelectModule, FormsModule],
  templateUrl: './apps-list.component.html',
  styleUrl: './apps-list.component.css',
})
export class AppsListComponent implements OnInit {
  private appsService = inject(AdminAppsService);

  apps: Application[] = [];
  loading = true;
  statuses = Object.values(ApplicationStatus);

  ngOnInit() {
    this.loadApps();
  }

  loadApps() {
    this.loading = true;
    this.appsService.getApplications().subscribe({
      next: (data) => {
        this.apps = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateStatus(id: string, status: any) {
    this.appsService.updateStatus(id, status as ApplicationStatus).subscribe(() => {
      this.loadApps();
    });
  }
}
