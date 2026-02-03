import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CasesService } from '../../../core/services/cases.service';
import { BusinessCase } from '../../../core/models/case.model';
import { HeaderComponent } from '../../home/components/header/header.component';
import { FooterComponent } from '../../home/components/footer/footer.component';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NzCardModule, NzButtonModule, NzIconModule, HeaderComponent, FooterComponent],
  templateUrl: './diagnostika-list.component.html',
  styleUrls: ['./diagnostika-list.component.css']
})
export class CaseListComponent implements OnInit {
  private casesService = inject(CasesService);
  cases = signal<BusinessCase[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadCases();
  }

  loadCases() {
    this.loading.set(true);
    this.casesService.getCases().subscribe({
      next: (data) => {
        this.cases.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
