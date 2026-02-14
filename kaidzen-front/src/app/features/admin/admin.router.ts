import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin Login - Sarash.uz'
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard - Sarash.uz'
      },
      {
        path: 'users',
        loadComponent: () => import('./components/users-list/users-list.component').then(m => m.UsersListComponent),
        title: 'Foydalanuvchilar - Sarash.uz'
      },
      {
        path: 'tests',
        loadComponent: () => import('./components/tests-mgmt/tests-mgmt.component').then(m => m.TestsMgmtComponent),
        title: 'Testlar boshqaruvi - Sarash.uz'
      },
      {
        path: 'tests/add',
        loadComponent: () => import('./components/tests-mgmt/add-test/add-test').then(m => m.AddTest),
        title: 'Yangi test yaratish - Sarash.uz'
      },
      {
        path: 'tests/edit/:id',
        loadComponent: () => import('./components/tests-mgmt/add-test/add-test').then(m => m.AddTest),
        title: 'Testni tahrirlash - Sarash.uz'
      },
      {
        path: 'blog',
        loadComponent: () => import('./components/blog-mgmt/blog-mgmt.component').then(m => m.BlogMgmtComponent),
        title: 'Blog boshqaruvi - Sarash.uz'
      },
      {
        path: 'blog/add',
        loadComponent: () => import('./components/blog-mgmt/add-blog/add-blog').then(m => m.AddBlog),
        title: 'Yangi blog yaratish - Sarash.uz'
      },
      {
        path: 'blog/edit/:id',
        loadComponent: () => import('./components/blog-mgmt/add-blog/add-blog').then(m => m.AddBlog),
        title: 'Blogni tahrirlash - Sarash.uz'
      },
      {
        path: 'cases',
        loadComponent: () => import('./components/cases-mgmt/cases-mgmt.component').then(m => m.CasesMgmtComponent),
        title: 'Keyslar boshqaruvi - Sarash.uz'
      },
      {
        path: 'applications',
        loadComponent: () => import('./components/apps-list/apps-list.component').then(m => m.AppsListComponent),
        title: 'Arizalar - Sarash.uz'
      },
      {
        path: 'diagnostics',
        loadComponent: () => import('./components/diagnostics/diagnostics').then(m => m.Diagnostics),
        title: 'Diagnostikalar - Sarash.uz'
      },
      {
        path: 'sales-networks',
        loadComponent: () => import('./components/sales-networks/sales-networks').then(m => m.SalesNetworks),
        title: 'Savdo tarmoqlari - Sarash.uz'
      }
    ]
  }
];
