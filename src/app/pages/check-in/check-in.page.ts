import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { WebcamPersonDetectorComponent } from "src/app/shared/components/webcam-person-detector/webcam-person-detector.component";
import { EmployeeSurveyComponent } from "src/app/shared/components/employee-survey/employee-survey.component";
import { EmployeeAlertCardComponent } from "src/app/shared/components/employee-alert-card/employee-alert-card.component";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, WebcamPersonDetectorComponent, EmployeeSurveyComponent, EmployeeAlertCardComponent]
})
export class CheckInPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
