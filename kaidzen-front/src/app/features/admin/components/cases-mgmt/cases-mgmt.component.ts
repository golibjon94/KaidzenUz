import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { AdminCasesService } from '../../services/admin-cases.service';
import { BusinessCase } from '../../../../core/models/case.model';

@Component({
  selector: 'app-cases-mgmt',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule, NzEmptyModule],
  templateUrl: './cases-mgmt.component.html',
  styleUrl: './cases-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasesMgmtComponent implements OnInit {
  private casesService = inject(AdminCasesService);

  cases = signal<BusinessCase[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadCases();
  }

  loadCases() {
    this.loading.set(true);
    this.casesService.getCases().subscribe({
      next: (data) => {
        this.cases.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.cases.set([]);
        this.loading.set(false);
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
