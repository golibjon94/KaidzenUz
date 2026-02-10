import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminUsersService } from '../../services/admin-users.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  private usersService = inject(AdminUsersService);

  users = signal<User[]>([]);
  loading = signal(true);
  displayedColumns: string[] = ['fullName', 'phone', 'role', 'createdAt', 'actions'];

  private roleLabels: Record<string, string> = {
    ADMIN: 'Admin',
    MANAGER: 'Menejer',
    USER: 'Foydalanuvchi',
    MODERATOR: 'Moderator',
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.users.set([]);
        this.loading.set(false);
      },
    });
  }

  getRoleLabel(role: string): string {
    return this.roleLabels[role] || role;
  }
}
