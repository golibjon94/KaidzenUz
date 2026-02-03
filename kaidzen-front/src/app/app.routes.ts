import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { ProfileLayoutComponent } from './features/profile/profile-layout/profile-layout.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

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
      },
      {
        path: 'diagnostika',
        loadComponent: () => import('./features/diagnostika/diagnostika-list/diagnostika-list.component').then(m => m.CaseListComponent),
        title: 'Diagnostika - Kaidzen.uz'
      },
      // {
      //   path: 'diagnostika/:id',
      //   loadComponent: () => import('./features/blog/blog-list/blog-list.component').then(m => m.BlogListComponent),
      //   title: 'Diagnostika  - Kaidzen.uz'
      // },
      {
        path: 'blog',
        loadComponent: () => import('./features/blog/blog-list/blog-list.component').then(m => m.BlogListComponent),
        title: 'Blog - Kaidzen.uz'
      },
      {
        path: 'blog/:id',
        loadComponent: () => import('./features/blog/blog-details/blog-details.component').then(m => m.BlogDetailsComponent),
        title: 'Blog - Kaidzen.uz'
      },
      {
        path: 'cases',
        loadComponent: () => import('./features/cases/case-list/case-list.component').then(m => m.CaseListComponent),
        title: 'Muvaffaqiyatli Keyslar - Kaidzen.uz'
      },
      {
        path: 'cases/:id',
        loadComponent: () => import('./features/cases/case-details/case-details.component').then(m => m.CaseDetailsComponent),
        title: 'Keys - Kaidzen.uz'
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about').then(m => m.About),
        title: 'Biz haqimizda - Kaidzen.uz'
      }
    ]
  },

  // Admin Routes
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/admin/admin-login.component').then(m => m.AdminLoginComponent),
        title: 'Admin Login - Kaidzen.uz'
      },
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
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
      }
    ]
  },

  // User Profile
  {
    path: 'profile',
    component: ProfileLayoutComponent,
    canActivate: [authGuard],
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
      },
      {
        path: 'results',
        loadComponent: () => import('./features/profile/components/test-results/test-results.component').then(m => m.TestResultsComponent),
        title: 'Test natijalari - Kaidzen.uz'
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/profile/components/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent),
        title: 'Sozlamalar - Kaidzen.uz'
      }
    ]
  },

  // Auth Routes
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent),
        title: 'Ro\'yxatdan o\'tish - Kaidzen.uz'
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];
