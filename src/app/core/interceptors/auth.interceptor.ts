import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. PRIMERO comprobamos si la petición va a Groq
  // Si la URL contiene 'groq.com', dejamos pasar la petición tal cual viene del servicio
  if (req.url.includes('api.groq.com')) {
    return next(req);
  }

  const token = localStorage.getItem('auth_token'); 

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};