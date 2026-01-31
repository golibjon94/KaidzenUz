import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-profile-overview',
  standalone: true,
  imports: [CommonModule, NzDescriptionsModule, NzAvatarModule, NzTagModule, NzButtonModule],
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
