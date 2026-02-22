import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Employee } from '../../models/employee';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-add-edit-employee-modal',
  templateUrl: './add-edit-employee-modal.component.html',
  styleUrls: ['./add-edit-employee-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AddEditEmployeeModalComponent implements OnInit {
  @Input() employee?: Employee; 

  private modalCtrl = inject(ModalController);
  private authService = inject(AuthService);
  public isEditMode = false;
  
  public formData: Employee = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birth_date: '',
    gender: null as any,
    marital_status: null as any,
    home_address: '',
    phone: '',
    department: null as any,
    education: null as any,
    education_field: null as any,
    job_level: null as any,
    job_role: null as any,
    number_of_companies_worked: null as any,
    monthly_salary: null as any,
    percent_salary_hike: null as any,
    contract_start_date: null as any,
    current_role_start_date: null as any,
    last_promotion_date: null as any,
    last_manager_date: null as any,
    company_id: null as any
  };

  isFormInvalid() {
    return (
      !this.formData.first_name?.trim() || 
      !this.formData.last_name?.trim() ||
      this.formData.monthly_salary <= 0 ||
      this.formData.percent_salary_hike < 0 ||
      this.formData.percent_salary_hike > 100 ||
      this.formData.number_of_companies_worked <= 0 ||
      !this.formData.home_address?.trim() ||
      !this.formData.email?.includes('@') || 
      this.formData.password?.length < 6 ||
      this.isValidDate(this.formData.birth_date) === false ||
      this.formData.department === null ||
      this.formData.education === null ||
      this.formData.education_field === null ||
      this.formData.job_level === null ||
      this.formData.job_role === null ||
      this.formData.gender === null ||
      this.formData.monthly_salary <= 0
    );
  }

  ngOnInit() {
    if (this.employee) {
      this.isEditMode = true;
      this.formData = { ...this.employee };
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    if (this.isFormInvalid()) return;

    const user = this.authService.currentUser();

    // Si no hay usuario o no hay ID, lanzamos un error y paramos todo
    if (!user || !user.id) {
      console.error('ERROR CRÍTICO: No se puede registrar sin un ID de empresa válido.');
      alert('Sesión caducada o inválida. Por favor, vuelve a loguearte.');
      return; // Salimos de la función, el modal no se cierra
    }

    const dataToSave = { 
      ...this.formData,
      job_level: this.formData.job_level - 1, // Ajustamos el nivel para el backend
      company_id: user.id, // ID real del token
      
    };

    console.log('Paquete final enviado al dismiss:', dataToSave);
    return this.modalCtrl.dismiss(dataToSave, 'confirm');
  }

  // Función para validar que la fecha esté en formato YYYY-MM-DD y sea una fecha real
  isValidDate(dateString: string): boolean {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;

    const d = new Date(dateString);
    const dNum = d.getTime();
    
    if (!dNum && dNum !== 0) return false; 
    return d.toISOString().slice(0, 10) === dateString;
  }
}