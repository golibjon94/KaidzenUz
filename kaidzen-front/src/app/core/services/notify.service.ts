import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  constructor(private snackBar: MatSnackBar) {}

  private getConfig(panelClass: string): MatSnackBarConfig {
    return {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    };
  }

  success(message: string): void {
    this.snackBar.open(message, '✕', this.getConfig('snackbar-success'));
  }

  warning(message: string): void {
    this.snackBar.open(message, '✕', this.getConfig('snackbar-warning'));
  }

  error(message: string): void {
    this.snackBar.open(message, '✕', this.getConfig('snackbar-error'));
  }

  info(message: string): void {
    this.snackBar.open(message, '✕', this.getConfig('snackbar-info'));
  }
}
