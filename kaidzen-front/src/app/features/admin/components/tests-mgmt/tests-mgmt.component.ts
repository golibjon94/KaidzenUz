import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { environment } from '../../../../../environments/environment';

interface Test {
  id: string;
  title: string;
  slug: string;
  description: string;
  createdAt: string;
}

@Component({
  selector: 'app-tests-mgmt',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzTagModule, NzIconModule, NzEmptyModule],
  templateUrl: './tests-mgmt.component.html',
  styleUrl: './tests-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsMgmtComponent implements OnInit {
  private http = inject(HttpClient);

  tests = signal<Test[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.loading.set(true);
    this.http.get<{data: Test[]}>(`${environment.apiUrl}/tests`).subscribe({
      next: (res) => {
        this.tests.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.tests.set([]);
        this.loading.set(false);
      }
    });
  }
}
