import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { EmployeeChartComponent } from 'src/app/shared/components/employee-chart/employee-chart.component';
import { AddEditEmployeeModalComponent } from 'src/app/shared/components/add-edit-employee-modal/add-edit-employee-modal.component';
import { Department } from 'src/app/shared/models/employee';
import { EmployeeService } from 'src/app/core/services/employee-service';
import { BurnoutFormService } from 'src/app/core/services/burnout-form-service';
import { RouterModule } from '@angular/router';
import { DashboardCardComponent } from 'src/app/shared/components/dashboard-card/dashboard-card.component';
import { ApexAxisChartSeries } from 'ng-apexcharts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, EmployeeChartComponent, RouterModule, DashboardCardComponent]
})
export class AdminDashboardPage implements OnInit {
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

  public daysRange = signal<7 | 30>(7);
  private primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary').trim() || '#9333ea';
  
  public chartLegend = [{ label: 'Satisfaction', color: this.primaryColor }];

  constructor() {
  }

  ngOnInit() {
    this.burnoutService.loadAll();
    this.employeeService.loadEmployees();
  }

  // Extrae el último formulario de cada empleado una sola vez.
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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeThisWeek = latestForms.filter(form => {
      const evaluationDate = new Date(form.created_at);
      return evaluationDate >= sevenDaysAgo;
    });

    const rate = (activeThisWeek.length / allEmployees.length) * 100;
    
    return Math.round(rate) + '%';
  });

  public chartSeries = computed<ApexAxisChartSeries>(() => {
    const forms = this.burnoutService.burnoutForms()
      .filter(f => f?.created_at && (f.final_burnout_score !== undefined || f.burnout_score !== undefined));
    
    if (forms.length === 0) return [];

    const dailyData: { [key: string]: { total: number, count: number } } = {};
    forms.forEach(f => {
      const dateKey = new Date(f.created_at).toISOString().split('T')[0];
      if (!dailyData[dateKey]) dailyData[dateKey] = { total: 0, count: 0 };
      
      const score = f.final_burnout_score ?? f.burnout_score;
      dailyData[dateKey].total += (100 - score);
      dailyData[dateKey].count++;
    });

    const sortedDates = Object.keys(dailyData).sort();
    const averages = sortedDates.map(date => Math.round(dailyData[date].total / dailyData[date].count));

    return [{ name: 'Company Average', data: averages.slice(-this.daysRange()) }];
  });

  public chartCategories = computed<string[]>(() => {
    const forms = this.burnoutService.burnoutForms().filter(f => f?.created_at);
    const dates = [...new Set(forms.map(f => new Date(f.created_at).toISOString().split('T')[0]))].sort();
    return dates.slice(-this.daysRange()).map(d => {
      const dateObj = new Date(d);
      return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    });
  });

  async editEmployee() {
    const modal = await this.modalCtrl.create({
      component: AddEditEmployeeModalComponent,
      mode: 'ios',
      backdropDismiss: false,
    });
    await modal.present();
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
