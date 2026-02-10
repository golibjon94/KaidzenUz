import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <mat-sidenav-container class="min-h-screen bg-gray-50">
      <mat-sidenav
        class="bg-white border-r"
        [mode]="'side'"
        [opened]="!isCollapsed()"
        [fixedInViewport]="true"
        [fixedTopGap]="0"
      >
        <div class="h-16 flex items-center justify-center border-b overflow-hidden px-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0">
              <span class="text-white font-bold text-lg">K</span>
            </div>
            <span class="text-lg font-bold text-gray-800">Admin Panel</span>
          </div>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
            <mat-icon class="mr-3" fontIcon="dashboard"></mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
            <mat-icon class="mr-3" fontIcon="group"></mat-icon>
            <span>Foydalanuvchilar</span>
          </a>
          <a mat-list-item routerLink="/admin/diagnostics" routerLinkActive="active">
            <mat-icon class="mr-3" fontIcon="assignment"></mat-icon>
            <span>Diagnostikalar</span>
          </a>
          <a mat-list-item routerLink="/admin/consultants" routerLinkActive="active">
            <mat-icon class="mr-3" fontIcon="support_agent"></mat-icon>
            <span>Konsultantlar</span>
          </a>

          <mat-divider class="my-2"></mat-divider>

          <div class="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase">Sozlamalar</div>
          <a mat-list-item routerLink="/admin/profile" routerLinkActive="active">
            <mat-icon class="mr-3" fontIcon="person"></mat-icon>
            <span>Profil</span>
          </a>
          <a mat-list-item routerLink="/admin/settings" routerLinkActive="active">
            <mat-icon class="mr-3" fontIcon="settings"></mat-icon>
            <span>Tizim</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="bg-white border-b px-6 flex items-center justify-between" color="">
          <button mat-icon-button type="button" (click)="isCollapsed.set(!isCollapsed())">
            <mat-icon [fontIcon]="isCollapsed() ? 'menu' : 'menu_open'"></mat-icon>
          </button>

          <div class="flex items-center gap-3">
            <button
              mat-button
              type="button"
              [matMenuTriggerFor]="userMenu"
              class="flex items-center gap-2"
            >
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                <mat-icon fontIcon="person"></mat-icon>
              </span>
              <span class="font-medium">Administrator</span>
              <mat-icon class="text-gray-400" fontIcon="arrow_drop_down"></mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item routerLink="/admin/profile">
                <mat-icon fontIcon="person"></mat-icon>
                <span>Profil</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item class="text-red-500">
                <mat-icon fontIcon="logout"></mat-icon>
                <span>Chiqish</span>
              </button>
            </mat-menu>
          </div>
        </mat-toolbar>

        <div class="p-6 bg-gray-50">
          <div class="bg-white min-h-[calc(100vh-148px)] rounded-lg p-6 shadow-sm border">
            <router-outlet></router-outlet>
          </div>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  isCollapsed = signal(false);
}
