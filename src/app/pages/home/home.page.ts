import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { EmployeeAlertCardComponent } from 'src/app/shared/components/employee-alert-card/employee-alert-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, EmployeeAlertCardComponent],
})
export class HomePage {
  constructor() {}
}
