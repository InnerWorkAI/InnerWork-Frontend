import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { EmployeeChartComponent } from "src/app/shared/components/employee-chart/employee-chart.component";
import { AiChatComponent } from "src/app/shared/components/ai-chat/ai-chat.component";
import { addIcons } from 'ionicons';
import { alertCircle, checkmarkCircle } from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';
import { BurnoutFormService } from 'src/app/core/services/burnout-form-service';
import { EmployeeService } from 'src/app/core/services/employee-service';
import { UserStatsService } from 'src/app/core/services/user-stats-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, CommonModule, FormsModule, EmployeeChartComponent, AiChatComponent]
})
export class DashboardPage {
  formService = inject(BurnoutFormService);
  userStatsService = inject(UserStatsService);
  router = inject(Router);

  public chartSeries = this.userStatsService.myPersonalSeries;
  public chartCategories = this.userStatsService.chartCategories;
  public daysRange = this.userStatsService.daysRange;

  isLoading = computed(() => this.formService.hasCompletedToday() === undefined);
  hasDoneCheckin = computed(() => this.formService.hasCompletedToday() === true);

  constructor() {
    addIcons({
      checkmarkCircle,
      alertCircle
    });
  }

  employeeService = inject(EmployeeService);

  startCheckIn() {
    this.router.navigate(['/check-in'])
  }

  setRange(days: number) {
    this.userStatsService.daysRange.set(days);
  }

}
