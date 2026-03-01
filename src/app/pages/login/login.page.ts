import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText, IonInput, IonIcon, IonButton, IonToggle } from '@ionic/angular/standalone';
import { LoginFormComponent } from 'src/app/shared/components/login-form/login-form.component';
import { AuthService } from 'src/app/core/services/auth-service';
import { LoginCredentials } from 'src/app/shared/models/User';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LoginFormComponent]
})
export class LoginPage  {

  errorMessage = signal('');
  
  private authService = inject(AuthService);

  handleSubmit(credentials: LoginCredentials): void {
    this.errorMessage.set('');
    
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: (res) => console.log('Éxito:', res),
      error: (err) => {
        const message = err.error?.detail || 'Correo o contraseña incorrectos';
        if (environment.apiUrl) {
          console.log("HAY URL DE API")
        } else {
          console.log("NO HAY URL DE API")
        }
        this.errorMessage.set(message);
        console.log(message)
      }
    });
  }



}
