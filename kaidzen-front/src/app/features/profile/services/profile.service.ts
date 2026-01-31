import { Injectable, inject } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { TestsService } from '../../../core/services/tests.service';
import { UpdateUserDto } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private usersService = inject(UsersService);
  private testsService = inject(TestsService);

  getMe() {
    return this.usersService.getMe();
  }

  updateMe(data: UpdateUserDto) {
    return this.usersService.updateMe(data);
  }

  getMyResults() {
    return this.testsService.getMyResults();
  }
}
