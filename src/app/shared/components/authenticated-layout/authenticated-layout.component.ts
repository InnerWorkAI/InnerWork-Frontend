import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonRouterOutlet, IonToolbar, IonHeader, IonTitle, IonButtons, IonButton, IonIcon } from "@ionic/angular/standalone";
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth-service';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  standalone: true,
  styleUrls: ['./authenticated-layout.component.scss'],
  imports: [IonButton, IonHeader, IonToolbar, IonRouterOutlet, IonContent, RouterLink]
})
export class AuthenticatedLayoutComponent  implements OnInit {

  constructor() { }

  public authService = inject(AuthService);

  ngOnInit() {}

}
