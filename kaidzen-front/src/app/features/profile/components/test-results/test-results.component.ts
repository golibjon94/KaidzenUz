import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TestsService } from '../../../../core/services/tests.service';
import { TestResult } from '../../../../core/models/test.model';

@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './test-results.component.html',
  styleUrl: './test-results.component.css',
})
export class TestResultsComponent implements OnInit {
  private testsService = inject(TestsService);

  results = signal<TestResult[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadResults();
  }

  loadResults() {
    this.loading.set(true);
    this.testsService.getMyResults().subscribe({
      next: (data) => {
        this.results.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Natijalarni yuklashda xatolik');
        this.loading.set(false);
      },
    });
  }
}
