import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { EmployeeChartComponent } from 'src/app/shared/components/employee-chart/employee-chart.component';
import { AddEditEmployeeModalComponent } from 'src/app/shared/components/add-edit-employee-modal/add-edit-employee-modal.component';
import { Employee } from 'src/app/shared/models/employee';
import { EmployeeService } from 'src/app/core/services/employee-service'; 

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, EmployeeChartComponent]
})
export class AdminDashboardPage implements OnInit {
  private modalCtrl = inject(ModalController);
  // Hacemos el servicio público para que el HTML pueda leer la señal .employees() directamente
  public employeeService = inject(EmployeeService);

  user = "Admin";

  ngOnInit() {
    // Solo necesitamos pedirle al servicio que cargue una vez.
    // La señal se actualizará y la pantalla reaccionará sola.
    this.employeeService.loadEmployees();
  }

  // ABRIR MODAL: He simplificado esto porque el modal ya llama al servicio por dentro
  async editEmployee() {
    const modal = await this.modalCtrl.create({
      component: AddEditEmployeeModalComponent,
      mode: 'ios',
      backdropDismiss: false,
    });

    await modal.present();

    // No hace falta llamar a saveNewEmployee aquí después del dismiss, 
    // porque tu ModalComponent ya llama al servicio .createEmployee() y 
    // la señal se actualiza automáticamente.
  }

  // Estilos de Score (Estos se quedan igual, están perfectos)
  getScoreBg(score: number): string {
    if (score >= 80) return '#f0fdf4'; 
    if (score < 50) return '#fee2e2';  
    if (score < 70) return '#fffbeb';  
    return '#f3f4f6';                  
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#16a34a'; 
    if (score < 50) return '#ef4444'; 
    if (score < 70) return '#d97706'; 
    return '#374151';
  }
}
