import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TestsService } from '../../../../core/services/tests.service';
import { TestResult } from '../../../../core/models/test.model';
import { TestResultDetailsDialogComponent } from './test-result-details-dialog.component';

@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './test-results.component.html',
  styleUrl: './test-results.component.css',
})
export class TestResultsComponent implements OnInit {
  private testsService = inject(TestsService);
  private dialog = inject(MatDialog);

  results = signal<TestResult[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadResults();
  }

  loadResults() {
    this.loading.set(true);
    this.testsService.getMyResults().subscribe({
      next: (res: any) => {
        // API dan kelayotgan 'res.data' ni tekshiramiz
        // Agar 'data' mavjud bo'lsa uni olamiz, aks holda bo'sh massiv qaytaramiz
        const actualData = res && res.data ? res.data : (Array.isArray(res) ? res : []);

        this.results.set(actualData);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Natijalarni yuklashda xatolik');
        this.loading.set(false);
        this.results.set([]); // Xato bo'lsa jadval bo'sh qolsin, xato bermasin
      },
    });
  }

  showDetails(result: TestResult) {
    this.dialog.open(TestResultDetailsDialogComponent, {
      data: result,
      width: '800px',
      maxWidth: '92vw',
      panelClass: 'test-result-details-dialog',
    });
  }
}
