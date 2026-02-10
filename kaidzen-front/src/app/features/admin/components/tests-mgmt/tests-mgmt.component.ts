import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

// Angular Material Modullari
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

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
    MatTableModule, MatButtonModule, MatChipsModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule, MatPaginatorModule
  ],
  templateUrl: './tests-mgmt.component.html',
  styleUrl: './tests-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsMgmtComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  tests = signal<Test[]>([]);
  loading = signal(false);
  displayedColumns: string[] = ['title', 'slug', 'questions', 'status', 'actions'];

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
        this.snackBar.open('Ma\'lumotlarni yuklashda xatolik yuz berdi', 'Yopish', { duration: 3000 });
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

  confirmDelete(id: string) {
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
      this.deleteTest(id);
    }
  }

  deleteTest(id: string) {
    this.http.delete(`${environment.apiUrl}/tests/${id}`).subscribe({
      next: () => {
        this.snackBar.open('Test o\'chirildi', 'Yopish', { duration: 3000 });
        this.loadTests();
      },
      error: () => this.snackBar.open('O\'chirishda xatolik', 'Yopish', { duration: 3000 })
    });
  }
}
