import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ModalController, IonSpinner } from '@ionic/angular/standalone';
import { LoginFormComponent } from 'src/app/shared/components/login-form/login-form.component';
import { AuthService } from 'src/app/core/services/auth-service';
import { LoginCredentials } from 'src/app/shared/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonContent, CommonModule, FormsModule, LoginFormComponent]
})
export class LoginPage  {

  errorMessage = signal('');
  isLoading = signal(false);
  
  private authService = inject(AuthService);

  handleSubmit(credentials: LoginCredentials): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        const message = err.error?.detail || 'Invalid credentials';
        this.errorMessage.set(message);
      }
    });
  }



}
