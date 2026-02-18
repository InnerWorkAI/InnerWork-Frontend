import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
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

  isLoading = signal(false);
  errorMessage = signal('');
  
  constructor(private authService: AuthService) { }
  ngOnInit() {
  }

  handleSubmit(credentials: RegisterCompanyCredentials): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(credentials).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        console.log('Login exitoso:', user);
        // Aquí puedes navegar a la página principal
        // this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error en el login. Intenta nuevamente.');
        console.error('Error en login:', error);
      }
    });
  }

}
