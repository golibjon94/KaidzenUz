import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  results = signal<TestResult[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  private openResultId: string | null = null;
  private openLatest = false;

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras.state
      ?? (typeof globalThis !== 'undefined' && 'history' in globalThis ? globalThis.history?.state : null);
    this.openResultId = state?.openResultId ?? null;
    this.openLatest = state?.openLatest === true;
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
        this.tryOpenLatestResult();
      },
      error: () => {
        this.error.set('Natijalarni yuklashda xatolik');
        this.loading.set(false);
        this.results.set([]); // Xato bo'lsa jadval bo'sh qolsin, xato bermasin
      },
    });
  }

  private tryOpenLatestResult() {
    if (!this.openLatest) return;
    const results = this.results();
    if (results.length === 0) return;

    const target = this.openResultId
      ? results.find(result => result.id === this.openResultId)
      : results[0];

    if (target) {
      this.showDetails(target);
    }

    this.openLatest = false;
    this.openResultId = null;
  }

  showDetails(result: TestResult) {
    this.dialog.open(TestResultDetailsDialogComponent, {
      data: result,
      width: '800px',
      maxWidth: '92vw',
      panelClass: 'test-result-details-dialog',
    });
  }

  downloadPdf(event: Event, resultId: string) {
    event.stopPropagation();
    this.testsService.downloadResultPdf(resultId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test-result-${resultId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.error.set('PDF yuklashda xatolik yuz berdi');
      },
    });
  }
}
