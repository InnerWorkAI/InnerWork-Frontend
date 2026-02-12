import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText, IonInput, IonIcon, IonButton, IonToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonToggle, IonButton, IonIcon, IonInput, IonText, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  email = signal('');
  password = signal('');

  
  constructor() { }

  ngOnInit() {
  }

  login() {
    const userData = {
      email: this.email(),
      password: this.password()
    };
    // Implement login logic here
    console.log(userData);
  }

  isFormInvalid = computed(() => {
  return !this.email().includes('@') || this.password().length < 6;
  });

}
