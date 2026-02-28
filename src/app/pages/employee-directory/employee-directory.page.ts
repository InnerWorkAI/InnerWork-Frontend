import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { EmployeeService } from 'src/app/core/services/employee-service';
import { BurnoutFormService } from 'src/app/core/services/burnout-form-service';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';
import { BurnoutFilterComponent } from 'src/app/shared/components/burnout-filter/burnout-filter.component';
import { IonIcon, IonButton } from '@ionic/angular/standalone'; 
import { addIcons } from 'ionicons';
import { trashOutline, createOutline } from 'ionicons/icons';
import { AlertController, ToastController } from '@ionic/angular';
import { Employee } from 'src/app/shared/models/employee';
import { AddEditEmployeeModalComponent } from 'src/app/shared/components/add-edit-employee-modal/add-edit-employee-modal.component';
import { ModalController } from '@ionic/angular';

const DepartmentNames: Record<number, string> = {
    0: 'R&D',
    1: 'Sales',
    2: 'Human Resources'
  };

@Component({
  selector: 'app-employee-directory',
  templateUrl: './employee-directory.page.html',
  styleUrls: ['./employee-directory.page.scss'],
  standalone: true,
  imports: [IonContent,IonIcon, IonButton, CommonModule, FormsModule, SearchBarComponent, BurnoutFilterComponent]
})

export class EmployeeDirectoryPage implements OnInit {
  private readonly CRITICAL_LIMIT = 70; 
  private readonly WARNING_LIMIT = 50;
  public employeeService = inject(EmployeeService);
  public burnoutService = inject(BurnoutFormService);
  private modalCtrl = inject(ModalController);
  public lastScores = signal<Record<number, number>>({});
  public lastEvaluationDates = signal<Record<number, string>>({});
  public searchText = signal<string>('');
  public selectedDept = signal<number | null>(null);
  public minBurnout = signal<number>(0);
  public maxBurnout = signal<number>(100);
  selectedEmployee = signal<Employee | null>(null);
  
  public filteredEmployees = computed(() => {
    const text = this.searchText().toLowerCase().trim();
    const deptFilter = this.selectedDept();
    const min = this.minBurnout();
    const max = this.maxBurnout();

    const all = this.employeeService.employees();
    
    const filtered = all.filter(emp => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const deptId = emp.department as unknown as number;
      const deptName = DepartmentNames[deptId]?.toLowerCase() || '';
      const evaluationDate = this.lastEvaluationDates()[emp.id!] || '';
      
      const matchesText = !text || 
                          fullName.includes(text) || 
                          deptName.includes(text) || 
                          evaluationDate.includes(text);

      const matchesDept = deptFilter === null || deptId === deptFilter;

      const score = this.lastScores()[emp.id!];
      
      const isPending = score === undefined || score === -1;
      const matchesBurnout = isPending || (score >= min && score <= max);

      return matchesText && matchesDept && matchesBurnout;
  });

  filtered.forEach(emp => {
    if (emp.id) this.loadEmployeeScore(emp.id);
  });

  return filtered;
});

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController, // Añadido
  ){
    addIcons({ trashOutline, createOutline });
  }

  ngOnInit() {
    this.employeeService.loadEmployees();
  }

  private loadEmployeeScore(empId: number) {
    if (this.lastScores()[empId] !== undefined) return;

    this.burnoutService.getLastFormByEmployee(empId).subscribe({
      next: (form) => {
        if (form) {
          this.lastScores.update(scores => ({
            ...scores,
            [empId]: form.burnout_score
          }));
          this.lastEvaluationDates.update(dates => ({
          ...dates,
            [empId]: form.created_at
          }));
      } else {
        this.lastScores.update(scores => ({ ...scores, [empId]: -1 }));
        this.lastEvaluationDates.update(dates => ({ ...dates, [empId]: 'none' }));
      }
    },
    error: () => {
      this.lastScores.update(scores => ({ ...scores, [empId]: -1 }));
      this.lastEvaluationDates.update(dates => ({ ...dates, [empId]: '' }));
    }
  });
  }

  public getDepartmentName(dept: any): string {
    const id = dept as number;
    return DepartmentNames[id] || 'Unknown';
  }

  getScoreBg(score: number): string {
  if (score === -1) return '#f3f4f6'; 
  if (score >= this.CRITICAL_LIMIT) return '#fee2e2'; 
  if (score > this.WARNING_LIMIT) return '#fffbeb';   // Ámbar claro (Amber-50)
  return '#dcfce7'; 
}

getScoreColor(score: number): string {
  if (score === -1) return '#9ca3af'; 
  if (score >= this.CRITICAL_LIMIT) return '#ef4444';
  if (score > this.WARNING_LIMIT) return '#d97706'; 
  return '#16a34a'; 
}

  // Función para confirmar eliminación de un empleado
  async confirmDelete(employee: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: '!text-gray-500'
        },
        {
          text: 'Delete',
          role: 'destructive',
          cssClass: '!text-[#aa0b0b]',
          handler: () => {
            this.deleteEmployee(employee.id);
          }
        }
      ]
    });

    await alert.present();
  }

  // Función para eliminar empleados
  private deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        console.log('Employee deleted successfully');
        this.showToast('Employee deleted successfully', 'success');
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
        this.showToast('Error deleting employee', 'danger');
      }
    });
  }

  // Función auxiliar para avisar al usuario
  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  // Función para abrir el modal de edición
  async openEditModal(emp: Employee) {
    const modal = await this.modalCtrl.create({
      component: AddEditEmployeeModalComponent,
      componentProps: {
        employee: emp 
      },
      mode: 'ios',
      cssClass: 'custom-modal-class'
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm') {
      this.employeeService.loadEmployees(); 
    }
  }
}
