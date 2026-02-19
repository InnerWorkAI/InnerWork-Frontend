import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText, IonInput, IonIcon, IonButton, IonToggle } from '@ionic/angular/standalone';
import { LoginFormComponent } from 'src/app/shared/components/login-form/login-form.component';
import { AuthService } from 'src/app/core/services/auth-service';
import { LoginCredentials } from 'src/app/shared/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LoginFormComponent]
})
export class LoginPage  {

  isLoading = signal(false);
  errorMessage = signal('');
  
  private authService = inject(AuthService);

  handleSubmit(credentials: LoginCredentials): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: (res) => console.log('Éxito:', res),
      error: (err) => {
        console.error('DETALLE DEL ERROR 422:', err.error);
      }
    });
  }



}
