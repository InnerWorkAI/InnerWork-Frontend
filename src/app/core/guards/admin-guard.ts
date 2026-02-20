import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userRole() === 'admin') {
    return true;
  }

  console.warn('Acceso denegado: Se requiere rol de administrador');
  return router.parseUrl('/login');
};
