import { Component, OnInit, inject, signal, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminCasesService } from '../../services/admin-cases.service';
import { BusinessCase } from '../../../../core/models/case.model';
import { NotifyService } from '../../../../core/services/notify.service';
import { CaseDialogComponent } from './case-dialog/case-dialog.component';

@Component({
  selector: 'app-cases-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './cases-mgmt.component.html',
  styleUrl: './cases-mgmt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasesMgmtComponent implements OnInit {
  private casesService = inject(AdminCasesService);
  private notify = inject(NotifyService);
  private dialog = inject(MatDialog);
  private platformId = inject(PLATFORM_ID);

  cases = signal<BusinessCase[]>([]);
  loading = signal(true);
  displayedColumns: string[] = ['title', 'problem', 'solution', 'date', 'actions'];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCases();
    } else {
      this.loading.set(false);
    }
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
      },
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(CaseDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.casesService.createCase(result).subscribe({
          next: () => {
            this.notify.success('Keys muvaffaqiyatli yaratildi');
            this.loadCases();
          },
          error: () => {
            this.notify.error('Xatolik yuz berdi');
          },
        });
      }
    });
  }

  deleteCase(id: string) {
    if (confirm("Ushbu keysni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.")) {
      this.casesService.deleteCase(id).subscribe({
        next: () => {
          this.notify.success("Keys muvaffaqiyatli o'chirildi");
          this.loadCases();
        },
        error: () => {
          this.notify.error("O'chirishda xatolik yuz berdi");
        },
      });
    }
  }
}
