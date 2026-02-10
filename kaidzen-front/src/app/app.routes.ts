import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

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
        path: 'diagnostics',
        loadComponent: () => import('./features/home/pages/diagnostics/diagnostics').then(m => m.Diagnostics),
        title: 'Diagnostika - Kaidzen.uz'
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/home/pages/blog/blog-list/blog-list.component').then(m => m.BlogListComponent),
        title: 'Blog - Kaidzen.uz'
      },
      {
        path: 'blog/:id',
        loadComponent: () => import('./features/home/pages/blog/blog-details/blog-details.component').then(m => m.BlogDetailsComponent),
        title: 'Blog - Kaidzen.uz'
      },
      {
        path: 'cases',
        loadComponent: () => import('./features/home/pages/cases/case-list/case-list.component').then(m => m.CaseListComponent),
        title: 'Muvaffaqiyatli Keyslar - Kaidzen.uz'
      },
      {
        path: 'cases/:id',
        loadComponent: () => import('./features/home/pages/cases/case-details/case-details.component').then(m => m.CaseDetailsComponent),
        title: 'Keys - Kaidzen.uz'
      },
      {
        path: 'about',
        loadComponent: () => import('./features/home/pages/about/about').then(m => m.About),
        title: 'Biz haqimizda - Kaidzen.uz'
      }
    ]
  },

  // Admin Routes (lazy-loaded)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.router').then(m => m.ADMIN_ROUTES)
  },

  // User Profile (lazy-loaded)
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/user.router').then(m => m.USER_ROUTES)
  },

  // Auth Routes
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        loadComponent: () => import('./features/home/pages/auth/register.component').then(m => m.RegisterComponent),
        title: 'Ro\'yxatdan o\'tish - Kaidzen.uz'
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];
