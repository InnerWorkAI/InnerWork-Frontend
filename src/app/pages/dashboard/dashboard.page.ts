import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, CommonModule, FormsModule, EmployeeChartComponent, AiChatComponent]
})
export class DashboardPage implements OnInit {
  formService = inject(BurnoutFormService);
  userStatsService = inject(UserStatsService);

  public chartSeries = this.userStatsService.myPersonalSeries;
  public chartCategories = this.userStatsService.chartCategories;
  public daysRange = this.userStatsService.daysRange;

  private hasCompletedToday$ = toObservable(this.formService.hasCompletedToday);
  hasDoneCheckin: boolean = true;
  isLoading: boolean = true;

  constructor() {
    addIcons({
      checkmarkCircle,
      alertCircle
    });
  }

  employeeService = inject(EmployeeService);

  async ngOnInit() {
    await this.checkStatus();
  }

  async checkStatus() {
    this.isLoading = true;
    try {
      const completed = await firstValueFrom(
        this.hasCompletedToday$.pipe(
          filter(val => val !== undefined)
        )
      );

      this.hasDoneCheckin = completed;
      
    } catch (error) {
      console.error('Error checkeando status en Dashboard', error);
    } finally {
      this.isLoading = false;
    }
  }

  startCheckIn() {
    console.log('Check-in started');
  }

  setRange(days: number) {
    this.userStatsService.daysRange.set(days);
  }

}
