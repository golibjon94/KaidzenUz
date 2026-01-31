import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AdminCasesService } from '../../services/admin-cases.service';
import { BusinessCase } from '../../../../core/models/case.model';

@Component({
  selector: 'app-cases-mgmt',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule],
  templateUrl: './cases-mgmt.component.html',
  styleUrl: './cases-mgmt.component.css',
})
export class CasesMgmtComponent implements OnInit {
  private casesService = inject(AdminCasesService);

  cases: BusinessCase[] = [];
  loading = true;

  ngOnInit() {
    this.loadCases();
  }

  loadCases() {
    this.loading = true;
    this.casesService.getCases().subscribe({
      next: (data) => {
        this.cases = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteCase(id: string) {
    if (confirm('Rostdan ham ushbu keysni o\'chirmoqchimisiz?')) {
      this.casesService.deleteCase(id).subscribe(() => {
        this.loadCases();
      });
    }
  }
}
