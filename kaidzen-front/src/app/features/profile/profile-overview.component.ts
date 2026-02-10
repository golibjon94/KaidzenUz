import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-profile-overview',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './profile-overview.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileOverviewComponent {
  authStore = inject(AuthStore);
  router = inject(Router);
  user = this.authStore.user;

  goToTests() {
    this.router.navigate(['/profile/tests']);
  }

  goToResults() {
    this.router.navigate(['/profile/results']);
  }
}
