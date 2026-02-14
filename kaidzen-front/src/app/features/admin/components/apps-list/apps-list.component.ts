import { Component, OnInit, inject, signal, ChangeDetectionStrategy, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    ClipboardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './apps-list.component.html',
  styleUrl: './apps-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppsListComponent implements OnInit {
  private appsService = inject(AdminAppsService);
  private notify = inject(NotifyService);
  private clipboard = inject(Clipboard);

  apps = signal<Application[]>([]);
  dataSource = new MatTableDataSource<Application>([]);
  loading = signal(true);

  statuses: ApplicationStatus[] = [ApplicationStatus.PENDING, ApplicationStatus.CONTACTED];

  displayedColumns: string[] = ['position', 'fullName', 'phone', 'status'];

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

  constructor() {
    effect(() => {
      this.dataSource.data = this.apps();
    });
  }

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

  copyPhone(phone: string) {
    this.clipboard.copy(phone);
    this.notify.success('Telefon raqami nusxalandi');
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

  getStatusLabel(status: ApplicationStatus): string {
    const labels: Partial<Record<ApplicationStatus, string>> = {
      [ApplicationStatus.PENDING]: 'Gaplashilmagan',
      [ApplicationStatus.CONTACTED]: 'Gaplashilgan',
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: ApplicationStatus): string {
    const classes: Partial<Record<ApplicationStatus, string>> = {
      [ApplicationStatus.PENDING]: 'badge-pending',
      [ApplicationStatus.CONTACTED]: 'badge-contacted',
    };
    return classes[status] || 'badge-pending';
  }
}
