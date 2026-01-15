import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'sms',
    loadComponent: () => import('./pages/admin-sms/admin-sms').then(m => m.AdminSmsComponent)
  },
  {
    path: '',
    redirectTo: 'sms',
    pathMatch: 'full'
  }
];

