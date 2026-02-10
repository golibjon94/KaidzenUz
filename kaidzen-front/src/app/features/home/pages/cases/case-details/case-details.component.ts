import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CasesService } from '../../../../../core/services/cases.service';
import { BusinessCase } from '../../../../../core/models/case.model';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-case-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, HeaderComponent, FooterComponent],
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.css']
})
export class CaseDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private casesService = inject(CasesService);

  caseItem = signal<BusinessCase | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCase(id);
    }
  }

  loadCase(id: string) {
    this.loading.set(true);
    this.casesService.getById(id).subscribe({
      next: (data) => {
        this.caseItem.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
