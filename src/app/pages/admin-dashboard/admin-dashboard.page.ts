import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { EmployeeChartComponent } from 'src/app/shared/components/employee-chart/employee-chart.component';
import { AddEditEmployeeModalComponent } from 'src/app/shared/components/add-edit-employee-modal/add-edit-employee-modal.component';
import { Department } from 'src/app/shared/models/employee';
import { EmployeeService } from 'src/app/core/services/employee-service';
import { BurnoutFormService } from 'src/app/core/services/burnout-form-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, EmployeeChartComponent, RouterModule]
})
export class AdminDashboardPage implements OnInit {
  private modalCtrl = inject(ModalController);
  // Hacemos el servicio público para que el HTML pueda leer la señal .employees() directamente
  public employeeService = inject(EmployeeService);
  private burnoutService = inject(BurnoutFormService);
  public showAllEmployees = false;
  user = "Admin";
  

  departmentNames = {
    [Department.RESEARCH_DEVELOPMENT]: 'R&D',
    [Department.SALES]: 'Sales',
    [Department.HUMAN_RESOURCES]: 'Human Resources'
  };

  constructor() {
    effect(() => {
      const emps = this.employeeService.employees();
      if (emps.length > 0) {
        this.loadBurnoutData(emps);
      }
    });
  }

  ngOnInit() {
    // Solo necesitamos pedirle al servicio que cargue una vez.
    // La señal se actualizará y la pantalla reaccionará sola.
    this.employeeService.loadEmployees();
  }

  // Crea un objeto para guardar los scores: { "id_empleado": score }
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

  // ABRIR MODAL: He simplificado esto porque el modal ya llama al servicio por dentro
  async editEmployee() {
    const modal = await this.modalCtrl.create({
      component: AddEditEmployeeModalComponent,
      mode: 'ios',
      backdropDismiss: false,
    });

    await modal.present();
  }

  getScoreBg(score: number): string {
    if (score >= 80) return '#fee2e2'; 
    if (score < 50) return '#f0fdf4';  
    if (score < 70) return '#fffbeb';  
    return '#f3f4f6';                  
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#ef4444'; 
    if (score < 50) return '#16a34a'; 
    if (score < 70) return '#d97706'; 
    return '#374151';
  }


  toggleShowAll() {
    this.showAllEmployees = !this.showAllEmployees;
  }
}
