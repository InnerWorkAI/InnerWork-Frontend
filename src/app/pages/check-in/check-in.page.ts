import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { WebcamPersonDetectorComponent } from "src/app/shared/components/webcam-person-detector/webcam-person-detector.component";
import { EmployeeSurveyComponent } from "src/app/shared/components/employee-survey/employee-survey.component";
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { JournalData } from 'src/app/shared/models/Journal';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, map, timeout } from 'rxjs';
import { BurnoutRequest } from 'src/app/shared/models/burnout-form';
import { BurnoutFormService } from 'src/app/core/services/burnout-form-service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, CommonModule, FormsModule, WebcamPersonDetectorComponent, EmployeeSurveyComponent]
})
export class CheckInPage  {

  formService = inject(BurnoutFormService);

  isLoading = computed(() => this.formService.hasCompletedToday() === undefined);
  hasDoneCheckin = computed(() => this.formService.hasCompletedToday() === true);
  isSaving = false;
  surveyData: any;
  journalFiles: JournalData | null = null;

  constructor() {
    addIcons({
      checkmarkCircle,
    });
  }


  handleSurveyFinished(surveyForm: any) {
    this.surveyData = surveyForm;

    this.checkBothSteps();
  }

  handleJournalFinished(files: JournalData) {
    this.journalFiles = files;
    this.checkBothSteps();
  }


  private async checkBothSteps() {
    if (this.surveyData && this.journalFiles) {

      this.isSaving = true;

      try {

        const formData = new FormData();

        formData.append('environment_satisfaction', Number(this.surveyData.environment).toString());
        formData.append('job_involvement', Number(this.surveyData.involvement).toString());
        formData.append('job_satisfaction', Number(this.surveyData.involvement).toString());
        formData.append('performance_rating', Number(this.surveyData.performance).toString());
        formData.append('work_life_balance', Number(this.surveyData.balance).toString());
        formData.append('overtime', (this.surveyData.overtime ? 1 : 0).toString());
        formData.append('business_travel', this.mapTravelToApi(this.surveyData.travel).toString());

        if (this.journalFiles.audio) {
          formData.append('audio', this.journalFiles.audio, 'journal.webm');
        }
        this.journalFiles.images.forEach((blob, i) => {
          formData.append('images', blob, `image_${i}.jpg`);
        });


        this.formService.saveForm(formData).subscribe({
          next: (res) => {
            this.isSaving = false;
          },
          error: (err) => {
            this.isSaving = false;
            alert('Hubo un error al enviar los datos. Por favor, inténtalo de nuevo.');
          }
        });

      } catch (error) {
        console.error('Error enviando los datos:', error);
        this.isSaving = false;
      }
    }
  }

  private mapTravelToApi(travel: string): number {
    switch (travel) {
      case 'International': return 2;
      case 'Local': return 1;
      default: return 0;
    }
  }

}
