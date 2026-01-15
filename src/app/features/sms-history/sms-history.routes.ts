import { Routes } from '@angular/router';

export const smsHistoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/sms-history/sms-history').then(m => m.SmsHistoryComponent)
  }
];

