import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface UiModalData {
  title?: string;
  width?: string;
}

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="ui-modal-wrapper" [style.width]="data.width || width">
      @if (data.title || title) {
        <div class="ui-modal-header">
          <h3 class="ui-modal-title">{{ data.title || title }}</h3>
          <button
            class="ui-modal-close"
            aria-label="Yopish"
            (click)="close()"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="ui-modal-divider"></div>
      }
      <div class="ui-modal-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ui-modal-wrapper {
        max-width: 100%;
        overflow: hidden;
      }

      .ui-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px 16px;
        gap: 16px;
      }

      .ui-modal-title {
        font-size: 18px;
        font-weight: 700;
        color: #212121;
        margin: 0;
        letter-spacing: -0.2px;
        line-height: 1.3;
      }

      .ui-modal-close {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9e9e9e;
        transition: all 0.2s ease;
      }

      .ui-modal-close:hover {
        background: #f5f5f5;
        color: #616161;
      }

      .ui-modal-close mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .ui-modal-divider {
        height: 1px;
        background: #f0f0f0;
        margin: 0 24px;
      }

      .ui-modal-body {
        padding: 20px 24px 24px;
      }
    `,
  ],
})
export class UiModalComponent {
  @Input() title?: string;
  @Input() width: string = '540px';

  constructor(
    private dialogRef: MatDialogRef<UiModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UiModalData
  ) {}

  close(result?: any) {
    this.dialogRef.close(result);
  }
}
