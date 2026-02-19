import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RegisterCompanyCredentials, User } from 'src/app/shared/models/User';


export type UserRole = 'admin' | 'user' | 'guest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private userSignal = signal<User | null>(null);

  public userRole = computed<UserRole>(() => {
    const user = this.userSignal();
    if (!user) return 'guest';

    return user.role;
  });

  register(credentials: RegisterCompanyCredentials): Observable<User> {
    console.log('Registering user:', credentials);
    return this.login(credentials.email, credentials.password);
  }

  login(email: string, password: string): Observable<User> {
    const fakeUser: User = { email, name: 'Usuario Demo', role: 'user' };

    this.userSignal.set(fakeUser);
    this.currentUserSubject.next(fakeUser);
    this.router.navigate(['/check-in']);
    return of(fakeUser);
  }

  logout(): void {
    this.userSignal.set(null);
    this.currentUserSubject.next(null);
  }

  isAuthenticated = computed(() => this.userSignal() !== null);
}
