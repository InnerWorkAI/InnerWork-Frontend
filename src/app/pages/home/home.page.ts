import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { EmployeeAlertCardComponent } from 'src/app/shared/components/employee-alert-card/employee-alert-card.component';
import { WebcamPersonDetectorComponent } from 'src/app/shared/components/webcam-person-detector/webcam-person-detector.component';
import { EmployeeChartComponent } from 'src/app/shared/components/employee-chart/employee-chart.component';
import { addIcons } from 'ionicons';
import { videocamOutline, trendingUpOutline, bulbOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonIcon, IonContent],
})
export class HomePage {
  constructor(private router: Router) {
    addIcons({ 
      videocamOutline,
      trendingUpOutline,
      bulbOutline
    });
   }

   goToRegister() {
    this.router.navigate(['/register']);
   }

   goToLogin() {
    this.router.navigate(['/login']);
   }
}
