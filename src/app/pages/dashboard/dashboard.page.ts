import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { EmployeeChartComponent } from "src/app/shared/components/employee-chart/employee-chart.component";
import { AiChatComponent } from "src/app/shared/components/ai-chat/ai-chat.component";
import { addIcons } from 'ionicons';
import { alertCircle, checkmarkCircle } from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, CommonModule, FormsModule, EmployeeChartComponent, AiChatComponent]
})
export class DashboardPage implements OnInit {

  hasPendingCheckIn: boolean = true; // Cambia a false cuando el usuario termine
  
  constructor() {
    addIcons({
      checkmarkCircle,
      alertCircle
    });
  }

  authService = inject(AuthService);

  ngOnInit() {
  }

  startCheckIn() {
    console.log('Check-in started');
    this.hasPendingCheckIn = false;
  }

}
