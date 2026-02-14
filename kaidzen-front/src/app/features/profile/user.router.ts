import { Routes } from '@angular/router';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { authGuard } from '../../core/guards/auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./profile-overview.component').then(m => m.ProfileOverviewComponent),
        title: 'Mening profilim - Sarash.uz'
      },
      {
        path: 'tests',
        loadComponent: () => import('./components/user-tests/user-tests.component').then(m => m.UserTestsComponent),
        title: 'Mening testlarim - Sarash.uz'
      },
      {
        path: 'results',
        loadComponent: () => import('./components/test-results/test-results.component').then(m => m.TestResultsComponent),
        title: 'Test natijalari - Sarash.uz'
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent),
        title: 'Sozlamalar - Sarash.uz'
      }
    ]
  }
];
