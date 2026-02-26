import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { WebcamPersonDetectorComponent } from "src/app/shared/components/webcam-person-detector/webcam-person-detector.component";
import { EmployeeSurveyComponent } from "src/app/shared/components/employee-survey/employee-survey.component";
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { JournalData } from 'src/app/shared/models/Journal';
import { FormService } from 'src/app/core/services/form-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, timeout } from 'rxjs';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, CommonModule, FormsModule, WebcamPersonDetectorComponent, EmployeeSurveyComponent]
})
export class CheckInPage implements OnInit {

  formService = inject(FormService);
  private hasCompletedToday$ = toObservable(this.formService.hasCompletedToday);

  isLoading = true;
  hasPendingSurvey = false;
  surveyData: any;
  journalFiles: JournalData | null = null;

  constructor() {
    addIcons({
      checkmarkCircle,
    });
  }

  ngOnInit() {
    this.checkSurveyStatus();
  }

  handleSurveyFinished(formData: any) {
    console.log('Datos recibidos del cuestionario:', formData);

    this.surveyData = formData;
    
    this.checkBothSteps();
  }

  handleJournalFinished(files: JournalData) {
    this.journalFiles = files;
    console.log('Archivos multimedia recibidos en el padre');
    this.checkBothSteps();
  }

  private async checkBothSteps() {
    if (this.surveyData && this.journalFiles) {

      try {
        const audioForm = new FormData();
        audioForm.append('audio', this.journalFiles.audio, 'journal.webm');
        
        // ENVIAR AUDIO + DATOS DEL CUESTIONARIO A API

        const photosForm = new FormData();
        this.journalFiles.images.forEach((blob, i) => {
          photosForm.append('frames', blob, `frame_${i}.jpg`);
        });

        // ENVIAR FOTOS A API

        this.hasPendingSurvey = false;

      } catch (error) {
        console.error('Error enviando los datos:', error);
      }
    }
  }



  async checkSurveyStatus() {
    this.isLoading = true;


    try {

      const status = await firstValueFrom(
        this.hasCompletedToday$.pipe(
          filter(val => val !== undefined), 
          timeout(7000)
        )
      );

      console.log('¡Status recibido!', status);
      this.hasPendingSurvey = status;

    } catch (error) {
      console.error('Error o Timeout esperando al FormService:', error);
      this.hasPendingSurvey = true;
    } finally {
      this.isLoading = false;
    }
  }

}
