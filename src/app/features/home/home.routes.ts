import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    canActivate: [authGuard]
  }
];

