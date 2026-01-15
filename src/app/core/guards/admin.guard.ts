import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use getCurrentUserValue() to get the BehaviorSubject value synchronously
  const currentUser = authService.getCurrentUserValue();

  console.log(currentUser)

  if (!currentUser) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (currentUser.role !== 'admin') {
    router.navigate(['/home']);
    return false;
  }

  return true;
};

