import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { SalesNetwork } from '../../../../core/models/sales-network.model';
import { NotifyService } from '../../../../core/services/notify.service';
import { AdminSalesNetworksService } from '../../services/admin-sales-networks.service';
import {
  NamePromptDialogComponent,
  NamePromptDialogData,
} from '../name-prompt-dialog/name-prompt-dialog.component';

@Component({
  selector: 'app-sales-networks',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './sales-networks.html',
  styleUrl: './sales-networks.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesNetworks implements OnInit {
  private salesNetworksService = inject(AdminSalesNetworksService);
  private notify = inject(NotifyService);
  private dialog = inject(MatDialog);

  items = signal<SalesNetwork[]>([]);
  dataSource = new MatTableDataSource<SalesNetwork>([]);
  loading = signal(false);

  displayedColumns: string[] = ['position', 'name', 'createdAt', 'actions'];

  @ViewChild(MatPaginator) set paginator(content: MatPaginator | undefined) {
    if (content) {
      this.dataSource.paginator = content;
      this._paginator = content;
    }
  }
  private _paginator?: MatPaginator;
  get paginator(): MatPaginator | undefined {
    return this._paginator;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.items();
    });
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.salesNetworksService.getAll().subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res : (res as any)?.data;
        this.items.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
        this.loading.set(false);
      },
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  openCreateDialog() {
    const data: NamePromptDialogData = {
      title: "Savdo tarmog'ini qo'shish",
      label: 'Nomi',
      submitText: "Qo'shish",
    };

    this.dialog
      .open(NamePromptDialogComponent, {
        data,
      })
      .afterClosed()
      .subscribe((name: string | undefined) => {
        if (!name) return;
        this.create(name);
      });
  }

  private create(name: string) {
    this.loading.set(true);
    this.salesNetworksService.create(name).subscribe({
      next: () => {
        this.notify.success("Savdo tarmog'i qo'shildi");
        this.load();
      },
      error: () => {
        this.notify.error("Qo'shishda xatolik");
        this.loading.set(false);
      },
    });
  }

  openEditDialog(item: SalesNetwork) {
    const data: NamePromptDialogData = {
      title: "Savdo tarmog'ini tahrirlash",
      label: 'Nomi',
      submitText: 'Saqlash',
      initialName: item.name,
    };

    this.dialog
      .open(NamePromptDialogComponent, {
        data,
      })
      .afterClosed()
      .subscribe((name: string | undefined) => {
        if (!name || name === item.name) return;
        this.update(item.id, name);
      });
  }

  private update(id: string, name: string) {
    this.loading.set(true);
    this.salesNetworksService.update(id, name).subscribe({
      next: () => {
        this.notify.success('Saqlandi');
        this.load();
      },
      error: () => {
        this.notify.error('Saqlashda xatolik');
        this.loading.set(false);
      },
    });
  }

  confirmDelete(item: SalesNetwork) {
    Swal.fire({
      title: "Savdo tarmog'ini o'chirish",
      text: "Haqiqatan ham o'chirmoqchimisiz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Ha, o'chirish",
      cancelButtonText: 'Bekor qilish',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.remove(item.id);
    });
  }

  private remove(id: string) {
    this.loading.set(true);
    this.salesNetworksService.remove(id).subscribe({
      next: () => {
        this.notify.success("O'chirildi");
        this.load();
      },
      error: () => {
        this.notify.error("O'chirishda xatolik");
        this.loading.set(false);
      },
    });
  }
}
