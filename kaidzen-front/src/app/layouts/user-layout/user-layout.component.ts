import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <mat-toolbar class="bg-white border-b px-6 shadow-sm" color="">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <button mat-icon-button type="button" class="md:hidden" (click)="drawerOpen.set(!drawerOpen())">
              <mat-icon fontIcon="menu"></mat-icon>
            </button>

            <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
              <div class="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span class="text-white font-bold text-lg">K</span>
              </div>
              <span class="text-xl font-bold text-gray-800">Kaidzen.uz</span>
            </div>
          </div>

          <a routerLink="/" class="text-gray-600 hover:text-primary">Asosiyga qaytish</a>
        </div>
      </mat-toolbar>

      <div class="p-6 max-w-7xl mx-auto w-full">
        <mat-sidenav-container class="bg-transparent" [hasBackdrop]="true">
          <mat-sidenav
            #sidenav
            class="bg-white rounded-lg shadow-sm border md:w-[320px]"
            [mode]="'over'"
            [opened]="drawerOpen()"
            (closedStart)="drawerOpen.set(false)"
          >
            <mat-nav-list>
              <a mat-list-item routerLink="/profile/overview" routerLinkActive="active" (click)="drawerOpen.set(false)">Profil</a>
              <a mat-list-item routerLink="/profile/diagnostics" routerLinkActive="active" (click)="drawerOpen.set(false)">Mening diagnostikalarim</a>
              <a mat-list-item routerLink="/profile/settings" routerLinkActive="active" (click)="drawerOpen.set(false)">Sozlamalar</a>
              <mat-divider></mat-divider>
              <button mat-list-item type="button" class="text-red-500">Chiqish</button>
            </mat-nav-list>
          </mat-sidenav>

          <mat-sidenav-content>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="col-span-1 hidden md:block">
                <div class="bg-white rounded-lg shadow-sm border p-2">
                  <mat-nav-list>
                    <a mat-list-item routerLink="/profile/overview" routerLinkActive="active">Profil</a>
                    <a mat-list-item routerLink="/profile/diagnostics" routerLinkActive="active">Mening diagnostikalarim</a>
                    <a mat-list-item routerLink="/profile/settings" routerLinkActive="active">Sozlamalar</a>
                    <mat-divider></mat-divider>
                    <button mat-list-item type="button" class="text-red-500">Chiqish</button>
                  </mat-nav-list>
                </div>
              </div>

              <div class="col-span-1 md:col-span-3">
                <div class="bg-white rounded-lg shadow-sm border p-6 min-h-[600px]">
                  <router-outlet></router-outlet>
                </div>
              </div>
            </div>
          </mat-sidenav-content>
        </mat-sidenav-container>
      </div>
    </div>
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
export class UserLayoutComponent {
  drawerOpen = signal(false);
}
