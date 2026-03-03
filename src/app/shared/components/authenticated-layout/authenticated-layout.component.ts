import { Component, computed, effect, HostListener, inject, OnInit } from '@angular/core';
import { 
  IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, 
  IonButton, IonIcon, IonAvatar, IonPopover, IonList, IonItem, 
  IonLabel, IonMenu, IonMenuToggle, IonRouterOutlet, ModalController
} from "@ionic/angular/standalone";
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth-service';
import { MenuController } from '@ionic/angular';
import { EmployeeService } from 'src/app/core/services/employee-service';
import { addIcons } from 'ionicons';
import { appsOutline, business, chevronDownOutline, gridOutline, logOutOutline, peopleOutline, personOutline, timeOutline } from 'ionicons/icons';
import { ChangePictureModalComponent } from '../change-picture-modal/change-picture-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  standalone: true,
  styleUrls: ['./authenticated-layout.component.scss'],
  imports: [RouterLink, 
    RouterModule,
    IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, 
    IonButton, IonIcon, IonAvatar, IonPopover, IonList, IonItem, 
    IonLabel, IonMenu, IonMenuToggle, IonRouterOutlet],
})
export class AuthenticatedLayoutComponent  implements OnInit {
  public isDesktop: boolean = window.innerWidth > 768;
  private modalCtrl = inject(ModalController);
  

  constructor() { 
      effect(() => {
      const emp = this.employeeService.currentEmployee();
      console.log('Datos:', emp);
      console.log('URL de la imagen:', this.imageUrl());
    });
    addIcons({
      personOutline,
      logOutOutline,
      business,
      gridOutline,
      peopleOutline,
      appsOutline,
      timeOutline,
      chevronDownOutline
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = window.innerWidth > 768;
  }

  public authService = inject(AuthService);
  public employeeService = inject(EmployeeService);
  private menu = inject(MenuController);
  public imageUrl = computed(() => {
    const profilePath = this.employeeService.currentEmployee()?.profile_image_url;
    return profilePath 
      ? `${environment.API_URL}/${profilePath}` 
      : 'assets/images/default-avatar.jpg';
  });

  ngOnInit() {}

  closeMenu() {
  this.menu.close("menu");
  }

  async changeProfilePicture() {
  const modal = await this.modalCtrl.create({
      component: ChangePictureModalComponent,
      handle: true
    });
    
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.uploaded) {
    }
  }
}
