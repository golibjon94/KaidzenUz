import { Injectable, inject } from '@angular/core';
import { CasesService } from '../../../core/services/cases.service';
import { CreateCaseDto } from '../../../core/models/case.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCasesService {
  private casesService = inject(CasesService);

  getCases() {
    return this.casesService.getCases();
  }

  createCase(data: CreateCaseDto) {
    return this.casesService.createCase(data);
  }

  deleteCase(id: string) {
    return this.casesService.deleteCase(id);
  }
}
