import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface NamePromptDialogData {
  title: string;
  label?: string;
  placeholder?: string;
  submitText?: string;
  initialName?: string;
}

@Component({
  selector: 'app-name-prompt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="p-6 w-[520px] max-w-full">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">{{ data.title }}</h3>
        <button mat-icon-button (click)="close()" aria-label="Yopish">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
          <mat-label>{{ data.label || 'Nomi' }}</mat-label>
          <input matInput formControlName="name" [placeholder]="data.placeholder || ''" />
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <mat-error>Nomi kiritish majburiy</mat-error>
          }
        </mat-form-field>

        <div class="flex justify-end gap-3 pt-2">
          <button mat-stroked-button type="button" (click)="close()">Bekor qilish</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
            {{ data.submitText || "Qo'shish" }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class NamePromptDialogComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
  });

  constructor(
    private dialogRef: MatDialogRef<NamePromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NamePromptDialogData,
  ) {
    if (typeof data.initialName === 'string') {
      this.form.patchValue({ name: data.initialName });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value.name);
  }

  close() {
    this.dialogRef.close();
  }
}
