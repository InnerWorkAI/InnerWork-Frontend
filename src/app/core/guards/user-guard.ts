import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userRole() === 'user') {
    return true;
  }

  console.warn('Acceso denegado: Se requiere rol de usuario');
  return router.parseUrl('/login');
};
