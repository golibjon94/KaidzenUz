import {Component, inject, signal} from '@angular/core';
import {CasesService} from '../../../../core/services/cases.service';
import {BusinessCase} from '../../../../core/models/case.model';
import {FooterComponent} from '../../components/footer/footer.component';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-diagnostics',
  imports: [
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './diagnostics.html',
  styleUrl: './diagnostics.css',
})
export class Diagnostics {
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
