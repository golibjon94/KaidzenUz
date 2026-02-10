import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotifyService } from '../../../../core/services/notify.service';
import Swal from 'sweetalert2';

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
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './tests-mgmt.component.html',
  styleUrl: './tests-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsMgmtComponent implements OnInit {
  private http = inject(HttpClient);
  private notify = inject(NotifyService);
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
        this.notify.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
        this.loading.set(false);
      },
    });
  }

  addTest() {
    this.router.navigate(['/admin/tests/add']);
  }

  editTest(id: string) {
    this.router.navigate(['/admin/tests/edit', id]);
  }

  confirmDelete(id: string) {
    Swal.fire({
      title: "Testni o'chirish",
      text: "Haqiqatan ham o'chirmoqchimisiz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Ha, o'chirish",
      cancelButtonText: 'Bekor qilish',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.deleteTest(id);
    });
  }

  deleteTest(id: string) {
    Swal.fire({
      title: 'O\'chirilmoqda... ',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.http.delete(`${environment.apiUrl}/tests/${id}`).subscribe({
      next: () => {
        Swal.close();
        this.notify.success("Test o'chirildi");
        this.loadTests();
      },
      error: () => {
        Swal.close();
        this.notify.error("O'chirishda xatolik");
      },
    });
  }
}
