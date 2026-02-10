import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './case-dialog.component.html',
  styleUrls: ['./case-dialog.component.css'],
})
export class CaseDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CaseDialogComponent>);

  caseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    problem: ['', [Validators.required]],
    solution: ['', [Validators.required]],
    result: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.caseForm.valid) {
      this.dialogRef.close(this.caseForm.value);
    } else {
      Object.values(this.caseForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
