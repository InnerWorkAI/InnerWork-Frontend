import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';
import { RegisterCompanyCredentials } from 'src/app/shared/models/User';
import { AuthService } from 'src/app/core/services/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RegisterFormComponent]
})
export class RegisterPage implements OnInit {

  errorMessage = signal('');
  
  constructor(private authService: AuthService) { }
  ngOnInit() {
  }

  handleSubmit(credentials: RegisterCompanyCredentials): void {
    this.errorMessage.set('');

    this.authService.registerCompany(credentials).subscribe({
      next: (user) => {
        console.log('Registro exitoso:', user);
      },
      error: (err) => {
        const message = err.error?.detail || 'Correo o contraseña incorrectos';
        this.errorMessage.set(message);
        console.log(message)
      }
    });
  }

}
