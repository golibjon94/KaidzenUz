import { Injectable, inject } from '@angular/core';
import { SalesNetworksService } from '../../../core/services/sales-networks.service';

@Injectable({
  providedIn: 'root',
})
export class AdminSalesNetworksService {
  private salesNetworksService = inject(SalesNetworksService);

  getAll() {
    return this.salesNetworksService.getAll();
  }

  create(name: string) {
    return this.salesNetworksService.create({ name });
  }

  update(id: string, name: string) {
    return this.salesNetworksService.update(id, { name });
  }

  remove(id: string) {
    return this.salesNetworksService.remove(id);
  }
}
