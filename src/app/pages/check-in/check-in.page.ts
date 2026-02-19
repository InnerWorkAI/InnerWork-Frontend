import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { WebcamPersonDetectorComponent } from "src/app/shared/components/webcam-person-detector/webcam-person-detector.component";
import { EmployeeSurveyComponent } from "src/app/shared/components/employee-survey/employee-survey.component";
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, CommonModule, FormsModule, WebcamPersonDetectorComponent, EmployeeSurveyComponent]
})
export class CheckInPage implements OnInit {

  isLoading = true;
  hasPendingSurvey = false;

  constructor() {
    addIcons({ 
      checkmarkCircle, 
    });
   }

  ngOnInit() {
    this.checkSurveyStatus();
  }

  async checkSurveyStatus() {
    this.isLoading = true;
    
    try {

      
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.hasPendingSurvey = true;
      
    } catch (error) {
      this.hasPendingSurvey = false;
    } finally {
      this.isLoading = false;
    }
  }

}
