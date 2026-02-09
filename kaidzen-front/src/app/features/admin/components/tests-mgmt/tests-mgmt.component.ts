import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

// Ng-Zorro Modullari
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

interface Test {
  id: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  _count?: { questions: number };
}

@Component({
  selector: 'app-tests-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule, NzButtonModule, NzTagModule, NzIconModule,
    NzEmptyModule, NzPopconfirmModule, NzBadgeModule
  ],
  templateUrl: './tests-mgmt.component.html',
  styleUrl: './tests-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsMgmtComponent implements OnInit {
  private http = inject(HttpClient);
  private notification = inject(NzNotificationService);
  private router = inject(Router);

  tests = signal<Test[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/tests/admin/all`).subscribe({
      next: (res) => {
        this.tests.set(Array.isArray(res) ? res : res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Xatolik', 'Ma\'lumotlarni yuklashda xatolik yuz berdi');
        this.loading.set(false);
      }
    });
  }

  addTest() {
    this.router.navigate(['/admin/tests/add']);
  }

  editTest(id: string) {
    this.router.navigate(['/admin/tests/edit', id]);
  }

  deleteTest(id: string) {
    this.http.delete(`${environment.apiUrl}/tests/${id}`).subscribe({
      next: () => { this.notification.success('Muvaffaqiyat', 'O\'chirildi'); this.loadTests(); },
      error: () => this.notification.error('Xatolik', 'O\'chirishda xatolik')
    });
  }
}
