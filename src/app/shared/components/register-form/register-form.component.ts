import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginCredentials, RegisterCompanyCredentials } from '../../models/User';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegisterFormComponent  implements OnInit {

  constructor() { }


  email = signal('');
  password = signal('');
  name = signal('');

  submitForm = output<RegisterCompanyCredentials>();

  isFormInvalid = computed(() => {
    return !this.email().includes('@') || this.password().length < 6;
  });

  ngOnInit() {}

  onSubmit() {
    this.submitForm.emit({ 
      email: this.email(), 
      password: this.password() ,
      name: this.name()
    });
  }

}
