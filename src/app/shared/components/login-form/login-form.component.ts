import { CommonModule } from '@angular/common';
import { Component, output, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginCredentials } from '../../models/User';
import { ModalController } from '@ionic/angular';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';
import { Router } from '@angular/router';
import { IonButton, IonInput } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [IonInput, IonButton, CommonModule, FormsModule]
})
export class LoginFormComponent  implements OnInit {

  constructor() { }
  private modalCtrl = inject(ModalController);
  private router = inject(Router);

  email = signal('');
  password = signal('');

  submitForm = output<LoginCredentials>();


  ngOnInit() {}

  onSubmit() {
    this.submitForm.emit({ 
      email: this.email(), 
      password: this.password() 
    });
  }

  async onForgot() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordModalComponent,
      handle: true,
      cssClass: 'custom-reset-modal',
      mode: 'ios'
    });
    
    await modal.present();
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

}
