import { Component, HostListener, inject, OnInit } from '@angular/core';
import { IonContent, IonRouterOutlet, IonToolbar, IonHeader, IonButtons, IonButton } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth-service';
import { IonicModule } from "@ionic/angular";
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  standalone: true,
  styleUrls: ['./authenticated-layout.component.scss'],
  imports: [RouterLink, IonicModule]
})
export class AuthenticatedLayoutComponent  implements OnInit {
  public isDesktop: boolean = window.innerWidth > 768;
  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = event.target.innerWidth > 768;
  }
  
  public authService = inject(AuthService);
  private menu = inject(MenuController);

  ngOnInit() {}

  closeMenu() {
  this.menu.close();
}
}
