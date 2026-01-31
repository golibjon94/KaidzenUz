import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-profile-overview',
  standalone: true,
  imports: [CommonModule, NzDescriptionsModule, NzAvatarModule, NzTagModule],
  templateUrl: './profile-overview.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileOverviewComponent {
  authStore = inject(AuthStore);
  user = this.authStore.user;
}
