import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-profile-overview',
  standalone: true,
  imports: [NzDescriptionsModule, NzAvatarModule, NzTagModule],
  templateUrl: './profile-overview.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileOverviewComponent {}
