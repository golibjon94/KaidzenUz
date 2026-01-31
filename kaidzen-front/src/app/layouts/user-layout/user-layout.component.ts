import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NzLayoutModule, NzMenuModule],
  template: `
    <nz-layout class="min-h-screen bg-gray-50">
      <nz-header class="bg-white border-b px-6 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
          <div class="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span class="text-white font-bold text-lg">K</span>
          </div>
          <span class="text-xl font-bold text-gray-800">Kaidzen.uz</span>
        </div>
        <div class="flex items-center gap-4">
          <a routerLink="/" class="text-gray-600 hover:text-primary">Asosiyga qaytish</a>
        </div>
      </nz-header>
      <nz-content class="p-6 max-w-7xl mx-auto w-full">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="col-span-1">
            <div class="bg-white rounded-lg shadow-sm border p-4">
              <ul nz-menu nzMode="inline" class="border-none">
                <li nz-menu-item nzSelected routerLink="/profile/overview">Profil</li>
                <li nz-menu-item routerLink="/profile/diagnostics">Mening diagnostikalarim</li>
                <li nz-menu-item routerLink="/profile/settings">Sozlamalar</li>
                <li nz-menu-divider></li>
                <li nz-menu-item class="text-red-500">Chiqish</li>
              </ul>
            </div>
          </div>
          <div class="col-span-1 md:col-span-3">
            <div class="bg-white rounded-lg shadow-sm border p-6 min-h-[600px]">
              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styles: [`
    .text-primary {
      color: #1890ff;
    }
    .bg-primary {
      background-color: #1890ff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLayoutComponent {}
