import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminAppsService } from '../../services/admin-apps.service';
import { Application } from '../../../../core/models/application.model';
import { ApplicationStatus } from '../../../../core/models/enums';
import { NotifyService } from '../../../../core/services/notify.service';

@Component({
  selector: 'app-apps-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './apps-list.component.html',
  styleUrl: './apps-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppsListComponent implements OnInit {
  private appsService = inject(AdminAppsService);
  private notify = inject(NotifyService);

  apps = signal<Application[]>([]);
  loading = signal(true);
  statuses = Object.values(ApplicationStatus);
  displayedColumns: string[] = ['fullName', 'phone', 'companyName', 'message', 'status', 'createdAt'];

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
    this.appsService.updateStatus(id, status as ApplicationStatus).subscribe({
      next: () => {
        this.notify.success('Status muvaffaqiyatli yangilandi');
        this.loadApps();
      },
      error: () => {
        this.notify.error('Status yangilashda xatolik yuz berdi');
      }
    });
  }
}
