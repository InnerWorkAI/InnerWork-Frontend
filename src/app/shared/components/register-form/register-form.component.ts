import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCompanyCredentials } from '../../models/User';
import { MapBrowserComponent } from "../map-browser/map-browser.component";
import { Router } from '@angular/router';
import { IonInput, IonButton, IonInputPasswordToggle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  imports: [IonButton, IonInput, CommonModule, FormsModule, MapBrowserComponent, IonInputPasswordToggle]
})
export class RegisterFormComponent {

  router = inject(Router);

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
  public isLoading = input<boolean>(false);

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

    if (this.isFormInvalid() || this.isLoading()) return;

    this.submitForm.emit({
      email: this.email(),
      password: this.password(),
      name: this.name(),
      address: this.companyLocation()
    });
  }

  onLocationSelected(address: string) {
    this.companyLocation.set(address);
    this.locationTouched.set(true);
  }

    onCancel() {
    this.router.navigate(['/home']);
  }
}
