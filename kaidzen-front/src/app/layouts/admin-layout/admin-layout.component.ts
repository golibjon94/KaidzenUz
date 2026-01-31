import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule
  ],
  template: `
    <nz-layout class="min-h-screen">
      <nz-sider nzCollapsible [(nzCollapsed)]="isCollapsed" [nzTrigger]="null" class="bg-white border-r">
        <div class="h-16 flex items-center justify-center border-b overflow-hidden">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0">
              <span class="text-white font-bold text-lg">K</span>
            </div>
            @if (!isCollapsed()) {
              <span class="text-lg font-bold text-gray-800">Admin Panel</span>
            }
          </div>
        </div>
        <ul nz-menu nzMode="inline" class="border-none mt-2">
          <li nz-menu-item nzSelected routerLink="/admin/dashboard">
            <span nz-icon nzType="dashboard"></span>
            <span>Dashboard</span>
          </li>
          <li nz-menu-item routerLink="/admin/users">
            <span nz-icon nzType="team"></span>
            <span>Foydalanuvchilar</span>
          </li>
          <li nz-menu-item routerLink="/admin/diagnostics">
            <span nz-icon nzType="solution"></span>
            <span>Diagnostikalar</span>
          </li>
          <li nz-menu-item routerLink="/admin/consultants">
            <span nz-icon nzType="solution"></span>
            <span>Konsultantlar</span>
          </li>
          <li nz-submenu nzTitle="Sozlamalar" nzIcon="setting">
            <ul>
              <li nz-menu-item>Profil</li>
              <li nz-menu-item>Tizim</li>
            </ul>
          </li>
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header class="bg-white border-b px-6 flex items-center justify-between">
          <span
            class="text-xl cursor-pointer hover:text-blue-600 transition-colors"
            nz-icon
            [nzType]="isCollapsed() ? 'menu-unfold' : 'menu-fold'"
            (click)="isCollapsed.set(!isCollapsed())"
          ></span>

          <div class="flex items-center gap-4">
            <div nz-dropdown [nzDropdownMenu]="userMenu" class="cursor-pointer flex items-center gap-2">
              <nz-avatar nzIcon="user" class="bg-blue-600"></nz-avatar>
              <span class="font-medium">Administrator</span>
              <span nz-icon nzType="down" class="text-xs text-gray-400"></span>
            </div>
            <nz-dropdown-menu #userMenu="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item routerLink="/admin/profile">Profil</li>
                <li nz-menu-divider></li>
                <li nz-menu-item class="text-red-500">Chiqish</li>
              </ul>
            </nz-dropdown-menu>
          </div>
        </nz-header>
        <nz-content class="p-6 bg-gray-50">
          <div class="bg-white min-h-[calc(100vh-148px)] rounded-lg p-6 shadow-sm border">
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    :host ::ng-deep .ant-layout-header {
      background: #fff;
      padding: 0 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  isCollapsed = signal(false);
}
