import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-employee-survey',
  templateUrl: './employee-survey.component.html',
  styleUrls: ['./employee-survey.component.scss'],
  standalone: true,
  imports: [IonButton, FormsModule, CommonModule, IonIcon]
})
export class EmployeeSurveyComponent {

  onSurveyFinished = output<void>();

  currentStep = 1;
  totalSteps = 6;

  formData = {
    environment: 3,
    involvement: 3,
    satisfaction: 3,
    performance: 3,
    balance: 3,
    overtime: 'No',
    travel: 'No Travel'
  };

  nextStep() {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  submit() {
    console.log('Datos enviados:', this.formData);
    this.onSurveyFinished.emit();
  }

}
