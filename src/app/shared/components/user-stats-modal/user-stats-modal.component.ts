import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { close, statsChartOutline } from 'ionicons/icons';
import { UserStatsService } from 'src/app/core/services/user-stats-service';
import { ModalController, IonHeader, IonIcon, IonContent, IonButton } from '@ionic/angular/standalone';
import { EmployeeChartComponent } from "../employee-chart/employee-chart.component";
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-user-stats-modal',
  templateUrl: './user-stats-modal.component.html',
  styleUrls: ['./user-stats-modal.component.scss'],
  imports: [IonButton, IonContent, IonIcon, EmployeeChartComponent, IonHeader],
})
export class UserStatsModalComponent  implements OnInit {
  private modalCtrl = inject(ModalController);
  private userStatsService = inject(UserStatsService);

  @Input() employee: any;

  public chartSeries = this.userStatsService.employeeChartSeries;
  public chartCategories = this.userStatsService.chartCategories;
  public daysRange = this.userStatsService.daysRange;

  constructor() {
    addIcons({ close, statsChartOutline });
  }

  ngOnInit() {
    this.loadEmployeeStats();
  }

  async loadEmployeeStats() {
    if (this.employee && this.employee.id) {
      this.userStatsService.employeeIdFilter.set(this.employee.id);
    }
  }

  setRange(days: number) {
    this.daysRange.set(days);
    this.loadEmployeeStats();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}