import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
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
  imports: [CommonModule, NzTableModule, NzButtonModule, NzTagModule, NzIconModule],
  templateUrl: './tests-mgmt.component.html',
  styleUrl: './tests-mgmt.component.css',
})
export class TestsMgmtComponent implements OnInit {
  private http = inject(HttpClient);

  tests: Test[] = [];
  loading = true;

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.loading = true;
    this.http.get<Test[]>(`${environment.apiUrl}/tests`).subscribe({
      next: (data) => {
        this.tests = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
