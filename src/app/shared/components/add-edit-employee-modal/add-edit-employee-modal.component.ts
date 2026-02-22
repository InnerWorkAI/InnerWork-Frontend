import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Employee } from '../../models/employee';

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

  public isEditMode = false;
  
  public formData: Employee = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birth_date: '1990-05-15',
    gender: 0,
    marital_status: 0,
    home_address: '',
    phone: '',
    department: 1,
    education: 0,
    education_field: 0,
    job_level: 0,
    job_role: 0,
    number_of_companies_worked: 0,
    monthly_salary: 0,
    percent_salary_hike: 0,
    company_id: 5 
  };

    isFormInvalid() {
    return (
      !this.formData.first_name?.trim() || 
      !this.formData.last_name?.trim() ||
      !this.formData.birth_date ||
      this.formData.monthly_salary <= 0 ||
      this.formData.home_address?.trim() === '' ||
      !this.formData.email?.includes('@') || 
      this.formData.password?.length < 6
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

    return this.modalCtrl.dismiss(this.formData, 'confirm');
  }
}