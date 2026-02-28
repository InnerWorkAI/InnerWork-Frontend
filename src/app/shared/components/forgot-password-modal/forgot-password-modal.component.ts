import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IonHeader, IonContent, IonIcon, IonButton, IonButtons, IonToolbar, IonTitle, IonInput, IonSpinner } from "@ionic/angular/standalone";
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth-service';
import { addIcons } from 'ionicons';
import { closeOutline, keyOutline } from 'ionicons/icons';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
  imports: [IonSpinner, IonInput, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonHeader, CommonModule]
})
export class ForgotPasswordModalComponent {

  constructor() {
    addIcons({ closeOutline, keyOutline });
   }

  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);
  private authService = inject(AuthService);

  email = signal('');
  isLoading = signal(false);

  isValidEmail = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email());
  });

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async sendResetLink() {
    this.isLoading.set(true);
    
    this.authService.forgotPassword(this.email()).subscribe({
      next: async () => {
        this.isLoading.set(false);
        await this.presentToast('The reset link has been sent.', 'success');
        this.modalCtrl.dismiss();
      },
      error: async () => {
        this.isLoading.set(false);
        await this.presentToast('An error occurred. Please try again.', 'danger');
      }
    })
    

  }

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

}
