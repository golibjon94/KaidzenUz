import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TestResult } from '../../../../core/models/test.model';

@Component({
  selector: 'app-test-result-details-dialog',
  standalone: true,
  imports: [CommonModule, DatePipe, MatDialogModule, MatButtonModule],
  template: `
    <div class="space-y-6">
      <div class="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white overflow-hidden">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div class="relative z-10">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h3 class="text-2xl font-bold">{{ data.test?.title }}</h3>
              <p class="text-blue-100 text-sm">Test natijasi</p>
            </div>
            <button mat-stroked-button class="!text-white !border-white/40" (click)="close()">Yopish</button>
          </div>

          <div class="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p class="text-sm text-blue-100 mb-1">Topshirilgan sana</p>
            <p class="font-bold">{{ data.createdAt | date:'dd MMMM yyyy, HH:mm' }}</p>
          </div>
        </div>
      </div>

      <div class="px-8 pb-8 space-y-6">
        <div>
          <h4 class="text-xl font-bold text-gray-900 mb-3">Natija</h4>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border-2 border-blue-200">
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ data.result }}</p>
          </div>
        </div>

        <div class="flex justify-end">
          <button mat-raised-button color="primary" (click)="close()">Tushunarli</button>
        </div>
      </div>
    </div>
  `,
})
export class TestResultDetailsDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<TestResultDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TestResult,
  ) {}

  close() {
    this.dialogRef.close();
  }
}
