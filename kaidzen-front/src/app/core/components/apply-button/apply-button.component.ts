import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationFormDialogComponent } from '../application-form-dialog/application-form-dialog.component';

@Component({
  selector: 'app-apply-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button class="apply-btn" (click)="open()">
      <span class="apply-btn-bg"></span>
      <span class="apply-btn-content">
        <span class="apply-btn-label">{{ label }}</span>
        <span class="apply-btn-icon-wrap">
          <mat-icon class="apply-btn-icon">arrow_forward</mat-icon>
        </span>
      </span>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .apply-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        height: 52px;
        padding: 0 28px 0 32px;
        border: none;
        border-radius: 26px;
        cursor: pointer;
        overflow: hidden;
        background: linear-gradient(135deg, #1565c0, #1976d2);
        color: white;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.2px;
        box-shadow:
          0 4px 16px rgba(21, 101, 192, 0.35),
          0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .apply-btn:hover {
        transform: translateY(-2px);
        box-shadow:
          0 8px 28px rgba(21, 101, 192, 0.45),
          0 4px 8px rgba(0, 0, 0, 0.12);
      }

      .apply-btn:active {
        transform: translateY(0) scale(0.98);
        box-shadow:
          0 2px 8px rgba(21, 101, 192, 0.3),
          0 1px 3px rgba(0, 0, 0, 0.1);
      }

      /* Shimmer effect on hover */
      .apply-btn-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          105deg,
          transparent 30%,
          rgba(255, 255, 255, 0.15) 50%,
          transparent 70%
        );
        transform: translateX(-100%);
        transition: transform 0.6s ease;
      }

      .apply-btn:hover .apply-btn-bg {
        transform: translateX(100%);
      }

      .apply-btn-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .apply-btn-label {
        white-space: nowrap;
      }

      .apply-btn-icon-wrap {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .apply-btn:hover .apply-btn-icon-wrap {
        background: rgba(255, 255, 255, 0.3);
        transform: translateX(3px);
      }

      .apply-btn-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export class ApplyButtonComponent {
  private dialog = inject(MatDialog);
  @Input() label = 'Ariza qoldirish';

  open() {
    this.dialog.open(ApplicationFormDialogComponent, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'custom-dialog-container',
      disableClose: false,
    });
  }
}
