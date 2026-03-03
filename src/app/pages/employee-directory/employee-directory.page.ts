import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from 'src/app/core/services/employee-service';
import { BurnoutFormService } from 'src/app/core/services/burnout-form-service';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';
import { BurnoutFilterComponent } from 'src/app/shared/components/burnout-filter/burnout-filter.component';
import { IonIcon, ModalController, ToastController, AlertController, IonContent} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline, checkmarkOutline, checkmark, closeCircle, calendarOutline } from 'ionicons/icons';
import { Employee } from 'src/app/shared/models/employee';
import { AddEditEmployeeModalComponent } from 'src/app/shared/components/add-edit-employee-modal/add-edit-employee-modal.component';
import { environment } from 'src/environments/environment';

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
  imports: [IonContent, IonIcon, CommonModule, FormsModule, SearchBarComponent, BurnoutFilterComponent]
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
  public startDate = signal<string | null>(null);
  public endDate = signal<string | null>(null);

  selectedEmployee = signal<Employee | null>(null);
  public selectedDepts = signal<number[]>([]);

  public allForms = this.burnoutService.burnoutForms;

  public burnoutMap = computed(() => {
    const forms = this.allForms();
    const map: Record<number, { score: number, date: string }> = {};

    forms.forEach(f => {
      const currentScore = f.final_burnout_score!;

      if (!map[f.employee_id] || new Date(f.created_at) > new Date(map[f.employee_id].date)) {
        map[f.employee_id] = { score: currentScore, date: f.created_at };
      }
    });
    return map;
  });

  public filteredEmployees = computed(() => {
    
    const text = this.searchText().toLowerCase().trim();
    const depts = this.selectedDepts();
    const min = this.minBurnout();
    const max = this.maxBurnout();
    const start = this.startDate();
    const end = this.endDate();
    const scores = this.burnoutMap();

    return this.employeeService.employees().filter(emp => {
      const firstName = emp.first_name || '';
      const lastName = emp.last_name || '';

      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const empData = scores[emp.id!];

      const matchesText = !text || fullName.includes(text);

      const matchesDept = depts.length === 0 || depts.includes(Number(emp.department));

      const score = empData?.score ?? -1;
      const matchesBurnout = score === -1 || (score >= min && score <= max);

      let matchesDate = true;
      if (empData?.date) {
        const evalDate = new Date(empData.date).getTime();
        const startLimit = start ? new Date(start).getTime() : null;
        const endLimit = end ? new Date(end).getTime() : null;

        if (startLimit && evalDate < startLimit) matchesDate = false;
        if (endLimit && evalDate > endLimit) matchesDate = false;
      } else if (start || end) {
        matchesDate = false;
      }

      return matchesText && matchesDept && matchesBurnout && matchesDate;
    });
  });

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController, // Añadido
  ) {
    addIcons({ trashOutline, createOutline, checkmark, closeCircle, calendarOutline });
  }

  ngOnInit() {
    this.employeeService.loadEmployees();
    this.burnoutService.loadAll();
  }

  toggleDept(deptId: number) {
    this.selectedDepts.update(depts =>
      depts.includes(deptId)
        ? depts.filter(id => id !== deptId) // Si está, lo quito
        : [...depts, deptId]                // Si no está, lo añado
    );
  }


  public getDepartmentName(dept: any): string {
    const id = dept as number;
    return DepartmentNames[id] || 'Unknown';
  }

  getScoreBg(score: number | null | undefined): string {
    if (score === -1 || score == null) return '#f3f4f6';
    if (score >= this.CRITICAL_LIMIT) return '#fee2e2';
    if (score > this.WARNING_LIMIT) return '#fffbeb';
    return '#dcfce7';
  }

  getScoreColor(score: number | null | undefined): string {
    if (score === -1 || score == null) return '#9ca3af';
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
    console.log("Click")
    const modal = await this.modalCtrl.create({
    
      component: AddEditEmployeeModalComponent,
      componentProps: {
        employee: emp
      },
      mode: 'ios',
      cssClass: 'custom-modal-class'
    });
    console.log("Crea el modal")
    await modal.present();
    console.log("Presenta el modal")

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.employeeService.loadEmployees();
    }
  }

  getProfileImageUrl(profilePath: string | undefined): string {
    if (!profilePath) return 'assets/images/default-avatar.jpg';
    return `${environment.API_URL}/${profilePath}`;
  }
}
