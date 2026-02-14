import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { SalesNetworksService } from '../../../../../core/services/sales-networks.service';
import { SalesNetwork } from '../../../../../core/models/sales-network.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-case-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './case-dialog.component.html',
  styleUrls: ['./case-dialog.component.css'],
})
export class CaseDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CaseDialogComponent>);
  private salesNetworksService = inject(SalesNetworksService);

  salesNetworks = signal<SalesNetwork[]>([]);

  caseForm: FormGroup = this.fb.group({
    salesNetworkId: ['', [Validators.required]],
    problem: ['', [Validators.required]],
    solution: ['', [Validators.required]],
    result: ['', [Validators.required]],
    dateFrom: [''],
    dateTo: [''],
  });

  ngOnInit(): void {
    this.salesNetworksService.getAll().subscribe({
      next: (data: any) => {
        this.salesNetworks.set(data?.data ?? data ?? []);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.caseForm.valid) {
      const value = { ...this.caseForm.value };
      if (!value.dateFrom) delete value.dateFrom;
      if (!value.dateTo) delete value.dateTo;
      this.dialogRef.close(value);
    } else {
      Object.values(this.caseForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
