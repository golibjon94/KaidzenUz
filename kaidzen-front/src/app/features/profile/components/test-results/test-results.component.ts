import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TestsService } from '../../../../core/services/tests.service';
import { TestResult } from '../../../../core/models/test.model';

@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzEmptyModule,
    NzTagModule
  ],
  templateUrl: './test-results.component.html',
  styleUrl: './test-results.component.css',
})
export class TestResultsComponent implements OnInit {
  private testsService = inject(TestsService);

  results = signal<TestResult[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Modal state
  isVisible = signal(false);
  selectedResult = signal<TestResult | null>(null);

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
      error: (err) => {
        this.error.set('Natijalarni yuklashda xatolik');
        this.loading.set(false);
        this.results.set([]); // Xato bo'lsa jadval bo'sh qolsin, xato bermasin
      },
    });
  }

  showDetails(result: TestResult) {
    this.selectedResult.set(result);
    this.isVisible.set(true);
  }

  handleCancel() {
    this.isVisible.set(false);
    this.selectedResult.set(null);
  }
}
