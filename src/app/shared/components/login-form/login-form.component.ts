import { CommonModule } from '@angular/common';
import { Component, computed, output, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginCredentials } from '../../models/User';
import { ModalController } from '@ionic/angular';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginFormComponent  implements OnInit {

  constructor() { }
  private modalCtrl = inject(ModalController);

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
      breakpoints: [0, 0.4],
      initialBreakpoint: 0.4,
      handle: true,
      mode: 'ios'
    });
    
    await modal.present();
  }

}
