import { CommonModule } from '@angular/common';
import { Component, computed, output, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginCredentials } from '../../models/User';

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginFormComponent  implements OnInit {

  constructor() { }


  email = signal('');
  password = signal('');

  // Output event con Signals usando el modelo LoginCredentials
  submitForm = output<LoginCredentials>();

  isFormInvalid = computed(() => {
    return !this.email().includes('@') || this.password().length < 6;
  });

  ngOnInit() {}

  onSubmit() {
    this.submitForm.emit({ 
      email: this.email(), 
      password: this.password() 
    });
  }

}
