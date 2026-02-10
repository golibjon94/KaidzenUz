import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  okText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="p-6 max-w-lg">
      @if (data.title) {
        <h3 class="text-xl font-bold text-gray-900 mb-3">{{ data.title }}</h3>
      }
      <p class="text-gray-700 leading-relaxed">{{ data.message }}</p>

      <div class="mt-6 flex justify-end gap-3">
        <button mat-stroked-button (click)="close(false)">
          {{ data.cancelText || 'Bekor qilish' }}
        </button>
        <button mat-raised-button color="primary" (click)="close(true)">
          {{ data.okText || 'Tasdiqlash' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
