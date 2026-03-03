import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';
import { RegisterCompanyCredentials } from 'src/app/shared/models/User';
import { AuthService } from 'src/app/core/services/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonContent, CommonModule, FormsModule, RegisterFormComponent]
})
export class RegisterPage implements OnInit {

  errorMessage = signal('');
  isLoading = signal(false);
  
  constructor(private authService: AuthService) { }
  ngOnInit() {
  }

  handleSubmit(credentials: RegisterCompanyCredentials): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.registerCompany(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        const message = err.error?.detail || 'Already existing account';
        this.isLoading.set(false);
        this.errorMessage.set(message);
      }
    });
  }

}
