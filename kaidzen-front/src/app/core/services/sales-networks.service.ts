import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SalesNetwork } from '../models/sales-network.model';

export interface CreateSalesNetworkDto {
  name: string;
}

export interface UpdateSalesNetworkDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SalesNetworksService {
  private http = inject(HttpClient);
  private apiUrl = '/sales-networks';

  getAll() {
    return this.http.get<SalesNetwork[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<SalesNetwork>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateSalesNetworkDto) {
    return this.http.post<SalesNetwork>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateSalesNetworkDto) {
    return this.http.patch<SalesNetwork>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
