import { Component, OnInit, inject } from '@angular/core'; // Añadimos inject
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
  imports: [CommonModule, IonicModule, EmployeeChartComponent] // El modal no hace falta en imports si se usa en ModalController
})
export class AdminDashboardPage implements OnInit {
  private modalCtrl = inject(ModalController);
  private employeeService = inject(EmployeeService);

  employees: Employee[] = [];
  user = "Admin";

  ngOnInit() {
    this.loadEmployees(); // Nada más entrar, pedimos los datos
  }

  // 1. CARGAR: Traer empleados del back (GET)
  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        console.log('Empleados cargados del back:', res);
      },
      error: (err) => console.error('Error al traer datos:', err)
    });
  }

  // 2. ABRIR MODAL: Solo para crear (por ahora)
  async editEmployee() {
    const modal = await this.modalCtrl.create({
      component: AddEditEmployeeModalComponent,
      mode: 'ios',
      backdropDismiss: false,
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    // Si el usuario guardó, mandamos al servicio
    if (role === 'confirm' && data) {
      this.saveNewEmployee(data);
    }
  }

  // 3. MANDAR: Enviar a la base de datos (POST)
  saveNewEmployee(newEmployee: Employee) {
    this.employeeService.createEmployee(newEmployee).subscribe({
      next: (res) => {
        console.log('¡Guardado en Docker!', res);
        this.loadEmployees(); // <--- Recargamos la tabla para ver al nuevo
      },
      error: (err) => console.error('Error al crear:', err)
    });
  }

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
