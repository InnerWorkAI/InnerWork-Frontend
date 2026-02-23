import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth-service';
import { addIcons } from 'ionicons';
import { checkmarkCircle, ellipseOutline, lockOpenOutline } from 'ionicons/icons';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonButton, IonIcon, IonContent, CommonModule, FormsModule]
})
export class ResetPasswordPage implements OnInit {

  token: string | null = null;
  password = '';
  confirmPassword = '';
  isLoading = false;

  constructor() { 
    addIcons({
      checkmarkCircle,
      ellipseOutline,
      lockOpenOutline
    })
  }

  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  private toastController = inject(ToastController);


  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  handleFinish() {
    if (this.password !== this.confirmPassword) {
      this.presentToast('Passwords do not match', 'warning');
      return;
    }

    this.isLoading = true;
    this.authService.completeSetup(this.token!, this.password).subscribe({
      next: () => {
        this.presentToast('Password configured successfully!', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.presentToast('Link expired or invalid. Please request a new one.', 'danger');
      }
    });
  }

}
