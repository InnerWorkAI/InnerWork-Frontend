import { Component, OnInit, inject, effect, computed, signal } from '@angular/core';
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
  
  public chartLegend = [
    { label: 'Satisfaction', color: this.primaryColor }
  ];

  constructor() {
    effect(() => {
      const emps = this.employeeService.employees();
      if (emps.length > 0) {
        this.loadBurnoutData(emps);
      }
    });
  }

  ngOnInit() {
    this.burnoutService.loadAll();
    this.employeeService.loadEmployees();
  }

  public avgWellBeing = computed(() => {
    const forms = this.burnoutService.burnoutForms();
    if (forms.length === 0) return '0%';
    
    const sum = forms.reduce((acc, curr) => acc + (curr.burnout_score || 0), 0);
    const avg = sum / forms.length;
    
    // Invertimos: 100 - burnout = bienestar
    return Math.round(100 - avg) + '%';
  });

  // Alertas Críticas (Empleados con score >= 70)
  public criticalAlerts = computed(() => {
  const forms = this.burnoutService.burnoutForms();
  
  const highRiskForms = forms.filter(f => f.burnout_score >= this.CRITICAL_LIMIT);
  
  // Usamos un Set para contar IDs de empleados únicos
  // Así, si un empleado tiene 5 formularios rojos, solo cuenta como 1 alerta crítica
  const uniqueEmployeesAtRisk = new Set(highRiskForms.map(f => f.employee_id));
  
  return uniqueEmployeesAtRisk.size;
});
  // Tasa de Participación (Empleados únicos que han participado)
  public participationRate = computed(() => {
    const allEmployees = this.employeeService.employees();
    const allForms = this.burnoutService.burnoutForms();
    
    if (allEmployees.length === 0) return '0%';

    // Usamos un Set para obtener IDs de empleados únicos que han rellenado el form
    const uniqueParticipants = new Set(allForms.map(f => f.employee_id));
    
    const rate = (uniqueParticipants.size / allEmployees.length) * 100;
    return Math.round(rate) + '%';
  });

  public chartSeries = computed<ApexAxisChartSeries>(() => {
    const forms = this.burnoutService.burnoutForms()
      .filter(f => f?.created_at && f?.burnout_score !== undefined);
    
    if (forms.length === 0) return [];

    const dailyData: { [key: string]: { total: number, count: number } } = {};

    forms.forEach(f => {
      const dateKey = new Date(f.created_at).toISOString().split('T')[0];
      if (!dailyData[dateKey]) dailyData[dateKey] = { total: 0, count: 0 };
      
      // Invertimos el score para mostrar bienestar (100 - burnout)
      dailyData[dateKey].total += (100 - f.burnout_score);
      dailyData[dateKey].count++;
    });

    const sortedDates = Object.keys(dailyData).sort();
    const averages = sortedDates.map(date => 
      Math.round(dailyData[date].total / dailyData[date].count)
    );

    return [{
      name: 'Company Average',
      data: averages.slice(-this.daysRange())
    }];
  });

  public chartCategories = computed<string[]>(() => {
    const forms = this.burnoutService.burnoutForms().filter(f => f?.created_at);
    
    const dates = [...new Set(forms.map(f => 
      new Date(f.created_at).toISOString().split('T')[0]
    ))].sort();

    return dates.slice(-this.daysRange()).map(d => {
      const dateObj = new Date(d);
      return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    });
  });


  public burnoutScores: { [key: number]: any } = {};

  private loadBurnoutData(emps: any[]) {
    emps.forEach(emp => {
      // Solo pedimos el dato si no lo tenemos ya en nuestro objeto local
      if (emp.id && !this.burnoutScores[emp.id]) {
        this.burnoutService.getLastFormByEmployee(emp.id).subscribe({
          next: (form) => {
            if (form) {
              // Guardamos el resultado en nuestro objeto local
              this.burnoutScores[emp.id] = form;
            }
          },
          error: () => {
            // Si no hay test, marcamos un "null" para saber que ya lo intentamos
            this.burnoutScores[emp.id] = { burnout_score: 'N/A' };
          }
        });
      }
    });
  }

  // Abrir modal
  async editEmployee() {
    const modal = await this.modalCtrl.create({
      component: AddEditEmployeeModalComponent,
      mode: 'ios',
      backdropDismiss: false,
    });

    await modal.present();
  }

  getScoreBg(score: number): string {
    if (score >= 70) return '#fee2e2'; 
    if (score < 50) return '#f0fdf4';  
    if (score < 70) return '#fffbeb';  
    return '#f3f4f6';                  
  }

  getScoreColor(score: number): string {
    if (score >= this.CRITICAL_LIMIT) return '#ef4444'; 
    if (score > this.WARNING_LIMIT) return '#d97706'; 
    else return '#16a34a'; 
    
    return '#374151';
  }

  toggleShowAll() {
    this.showAllEmployees = !this.showAllEmployees;
  }
}
