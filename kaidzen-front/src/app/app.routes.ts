import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { ProfileLayoutComponent } from './features/profile/profile-layout/profile-layout.component';

export const routes: Routes = [
  // Home Page (Landing)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Kaidzen.uz - Biznes Diagnostika va Konsalting'
      }
    ]
  },

  // Admin Dashboard
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard - Kaidzen.uz'
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/components/users-list/users-list.component').then(m => m.UsersListComponent),
        title: 'Foydalanuvchilar - Kaidzen.uz'
      },
      {
        path: 'tests',
        loadComponent: () => import('./features/admin/components/tests-mgmt/tests-mgmt.component').then(m => m.TestsMgmtComponent),
        title: 'Testlar boshqaruvi - Kaidzen.uz'
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/admin/components/blog-mgmt/blog-mgmt.component').then(m => m.BlogMgmtComponent),
        title: 'Blog boshqaruvi - Kaidzen.uz'
      },
      {
        path: 'cases',
        loadComponent: () => import('./features/admin/components/cases-mgmt/cases-mgmt.component').then(m => m.CasesMgmtComponent),
        title: 'Keyslar boshqaruvi - Kaidzen.uz'
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/admin/components/apps-list/apps-list.component').then(m => m.AppsListComponent),
        title: 'Arizalar - Kaidzen.uz'
      }
    ]
  },

  // User Profile
  {
    path: 'profile',
    component: ProfileLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./features/profile/profile-overview.component').then(m => m.ProfileOverviewComponent),
        title: 'Mening profilim - Kaidzen.uz'
      },
      {
        path: 'tests',
        loadComponent: () => import('./features/profile/components/user-tests/user-tests.component').then(m => m.UserTestsComponent),
        title: 'Mening testlarim - Kaidzen.uz'
      }
    ]
  },

  // AuthService (Hozircha bo'sh)
  {
    path: 'auth',
    loadChildren: () => [
        { path: 'login', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
        { path: 'register', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];
