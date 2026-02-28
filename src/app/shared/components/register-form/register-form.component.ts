import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginCredentials, RegisterCompanyCredentials } from '../../models/User';
import { IonicModule } from '@ionic/angular';
import { MapBrowserComponent } from "../map-browser/map-browser.component";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule, MapBrowserComponent]
})
export class RegisterFormComponent {

  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  name = signal('');

  companyLocation = signal<string>('');
  
  emailTouched = signal(false);
  passwordTouched = signal(false);
  confirmPasswordTouched = signal(false);
  nameTouched = signal(false);
  locationTouched = signal(false);

  submitForm = output<RegisterCompanyCredentials>();

  isValidEmail = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email());
  });
  
  passwordValid = computed(() => this.password().length >= 8);
  passwordsMatch = computed(() => this.password() === this.confirmPassword());
  nameValid = computed(() => this.name().trim().length > 0);
  locationValid = computed(() => this.companyLocation() !== '');

  isFormInvalid = computed(() => {
    return !(this.isValidEmail() && this.passwordValid() && this.passwordsMatch() && this.nameValid() && this.locationValid());
  });

  onSubmit() {
    this.emailTouched.set(true);
    this.passwordTouched.set(true);
    this.confirmPasswordTouched.set(true);
    this.nameTouched.set(true);
    this.locationTouched.set(true);

    if (this.isFormInvalid()) return;

    this.submitForm.emit({
      email: this.email(),
      password: this.password(),
      name: this.name(),
      address: this.companyLocation()
    });
  }

  onLocationSelected(address: string) {
    this.companyLocation.set(address);
    console.log('Signal actualizado:', this.companyLocation());
    this.locationTouched.set(true);
  }


}
