import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const role = authService.userRole();
    
    if (role === 'admin') {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/dashboard']);
    }
    return false;
  }

  return true;
};