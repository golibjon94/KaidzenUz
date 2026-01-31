import { Injectable, inject } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private usersService = inject(UsersService);

  getUsers() {
    return this.usersService.getUsers();
  }
}
