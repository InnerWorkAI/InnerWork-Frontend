import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { RegisterCompanyCredentials, User } from 'src/app/shared/models/User';
import { ApiService } from './api-service';
import { HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

export type UserRole = 'admin' | 'user' | 'guest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);

  private router = inject(Router);

  public currentUser = computed<User | null>(() => {
      const token = this.tokenSignal();
      if (!token) return null;

      try {
        const decoded: any = jwtDecode(token);
        return {
          email: decoded.email || '',
          name: decoded.name || 'Usuario',
          role: decoded.role,
          id: decoded.sub
        };
      } catch (e) {
        return null;
      }
    });

  private tokenSignal = signal<string | null>(localStorage.getItem('auth_token'));

  public userRole = computed(() => this.currentUser()?.role || 'guest');


  registerCompany(credentials: RegisterCompanyCredentials): Observable<User> {
    return this.apiService.post<any>('companies', credentials).pipe(
        switchMap(() => this.login(credentials.email, credentials.password))
    );
  }

  login(email: string, password: string): Observable<any> {
      const body = new HttpParams()
        .set('username', email)
        .set('password', password);

      return this.apiService.post<any>('auth/login', body).pipe(
        tap((response) => {
          localStorage.setItem('auth_token', response.access_token);
          
          this.tokenSignal.set(response.access_token);
          
          if (this.userRole() === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        })
      );
    }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.tokenSignal.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated = computed(() => this.tokenSignal() !== null);

  completeSetup(token: string, password: string) {
  return this.apiService.post(`users/reset-password`, { 
    'token': token, 
    'new_password': password 
  });
  }

  forgotPassword(email: string) {
    return this.apiService.post(`users/request-password-reset`, { email });
  }
}
