import { Injectable, inject } from '@angular/core';
import { DiagnosticsService } from '../../../core/services/diagnostics.service';

@Injectable({
  providedIn: 'root',
})
export class AdminDiagnosticsService {
  private diagnosticsService = inject(DiagnosticsService);

  getAll() {
    return this.diagnosticsService.getAll();
  }

  create(name: string) {
    return this.diagnosticsService.create({ name });
  }

  update(id: string, name: string) {
    return this.diagnosticsService.update(id, { name });
  }

  remove(id: string) {
    return this.diagnosticsService.remove(id);
  }
}
