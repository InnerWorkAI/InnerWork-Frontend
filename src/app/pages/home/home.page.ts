import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { EmployeeAlertCardComponent } from 'src/app/shared/components/employee-alert-card/employee-alert-card.component';
import { WebcamPersonDetectorComponent } from 'src/app/shared/components/webcam-person-detector/webcam-person-detector.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, EmployeeAlertCardComponent, WebcamPersonDetectorComponent],
})
export class HomePage {
  constructor() {}
}
