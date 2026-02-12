import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from 'src/app/shared/models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();


    login(email: string, password: string): Observable<User> {

    console.log(email, password);

    const fakeUser: User = {
      email,
      name: 'Usuario Demo'
    };

    this.currentUserSubject.next(fakeUser);
    return of(fakeUser);
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
}
