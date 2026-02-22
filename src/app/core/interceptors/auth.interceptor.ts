import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Cogemos el nombre exacto que usa tu compañero: 'auth_token'
  const token = localStorage.getItem('auth_token'); 

  // Si el token existe, lo pegamos en la cabecera "Authorization"
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Si no hay token, la petición sigue normal (como en el login)
  return next(req);
};