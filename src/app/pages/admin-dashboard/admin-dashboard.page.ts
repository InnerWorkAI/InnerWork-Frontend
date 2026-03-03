import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeChartComponent } from 'src/app/shared/components/employee-chart/employee-chart.component';
import { AddEditEmployeeModalComponent } from 'src/app/shared/components/add-edit-employee-modal/add-edit-employee-modal.component';
import { Department } from 'src/app/shared/models/employee';
import { EmployeeService } from 'src/app/core/services/employee-service';
import { BurnoutFormService } from 'src/app/core/services/burnout-form-service';
import { RouterModule } from '@angular/router';
import { DashboardCardComponent } from 'src/app/shared/components/dashboard-card/dashboard-card.component';
import { UserStatsService } from 'src/app/core/services/user-stats-service';
import { IonContent, ModalController, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, CommonModule, EmployeeChartComponent, RouterModule, DashboardCardComponent]
})
export class AdminDashboardPage implements OnInit {

  private userStatsService = inject(UserStatsService);
  
  private readonly CRITICAL_LIMIT = 70; 
  private readonly WARNING_LIMIT = 50;
  private modalCtrl = inject(ModalController);
  public employeeService = inject(EmployeeService);
  public burnoutService = inject(BurnoutFormService);
  public showAllEmployees = false;
  user = "Admin";

  departmentNames = {
    [Department.RESEARCH_DEVELOPMENT]: 'R&D',
    [Department.SALES]: 'Sales',
    [Department.HUMAN_RESOURCES]: 'Human Resources'
  };

  public daysRange = this.userStatsService.daysRange;
  private primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary').trim() || '#9333ea';
  
  public chartLegend = [{ label: 'Satisfaction', color: this.primaryColor }];
  public chartSeries = this.userStatsService.adminChartSeries;
  public chartCategories = this.userStatsService.chartCategories;

  constructor() {
  }

  ngOnInit() {
    this.burnoutService.loadAll();
    this.employeeService.loadEmployees();
  }

  // Extrae el último formulario de cada empleado una sola vez
  public latestEmployeeForms = computed(() => {
    const allForms = this.burnoutService.burnoutForms();
    if (!allForms || allForms.length === 0) return [];

    const latestMap = new Map<number, any>();
    allForms.forEach(form => {
      const existing = latestMap.get(form.employee_id);
      if (!existing || new Date(form.created_at) > new Date(existing.created_at)) {
        latestMap.set(form.employee_id, form);
      }
    });
    return Array.from(latestMap.values());
  });

  // Busca por ID de empleado en el HTML: burnoutScoresMap()[emp.id]
  public burnoutScoresMap = computed(() => {
    const latest = this.latestEmployeeForms();
    const map: { [key: number]: any } = {};
    latest.forEach(f => map[f.employee_id] = f);
    return map;
  });

  // Métricas de la tabla
  // El porcentaje de bienestar se calcula como 100 - burnout_score promedio.
  public avgWellBeing = computed(() => {
    const latest = this.latestEmployeeForms();
    if (latest.length === 0) return '0%';

    const totalBurnout = latest.reduce((acc, curr) => 
      acc + (curr.final_burnout_score ?? curr.burnout_score ?? 0), 0);
    
    const avg = totalBurnout / latest.length;
    return Math.round(100 - avg) + '%';
  });

  // Cuenta cuántos empleados tienen un burnout_score crítico.
  public criticalAlerts = computed(() => {
    return this.latestEmployeeForms().filter(f => 
      (f.final_burnout_score ?? f.burnout_score) >= this.CRITICAL_LIMIT
    ).length;
  });

  public participationRate = computed(() => {
    const allEmployees = this.employeeService.employees();
    const latestForms = this.latestEmployeeForms();
    
    if (allEmployees.length === 0) return '0%';

    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    const activeThisWeek = latestForms.filter(form => {
      const formTime = new Date(form.created_at).getTime();
      return !isNaN(formTime) && formTime >= sevenDaysAgo;
    });

    const rate = (activeThisWeek.length / allEmployees.length) * 100;
    return Math.round(rate) + '%';
  });


  async editEmployee() {
    console.log("Click")
    const modal = await this.modalCtrl.create({
      component: AddEditEmployeeModalComponent,
      mode: 'ios',
      backdropDismiss: false,
    });
    console.log("Crea el modal")
    await modal.present();
    console.log("Presenta el modal")
  }

  getScoreColor(score: number | null | undefined): string {
    if (score === -1 || score == null) return '#9ca3af'; 
    if (score >= this.CRITICAL_LIMIT) return '#ef4444';
    if (score > this.WARNING_LIMIT) return '#d97706'; 
    return '#16a34a'; 
}

  toggleShowAll() {
    this.showAllEmployees = !this.showAllEmployees;
  }
}
