import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Employee } from '../../models/employee';
import { AuthService } from '../../../core/services/auth-service';
import { MapBrowserComponent } from '../map-browser/map-browser.component';

@Component({
  selector: 'app-add-edit-employee-modal',
  templateUrl: './add-edit-employee-modal.component.html',
  styleUrls: ['./add-edit-employee-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, MapBrowserComponent]
})
export class AddEditEmployeeModalComponent implements OnInit {
  @Input() employee?: Employee;

  private modalCtrl = inject(ModalController);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);

  public isEditMode = signal(false);
  public locationTouched = signal(false);

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  password = signal('');
  birthDate = signal('');
  gender = signal<number | null>(null);
  maritalStatus = signal<number | null>(null);
  homeAddress = signal('');
  phone = signal('');
  department = signal<number | null>(null);
  education = signal<number | null>(null);
  educationField = signal<number | null>(null);
  jobLevel = signal<number | null>(null);
  jobRole = signal<number | null>(null);
  numCompanies = signal<number | null>(null);
  monthlySalary = signal<number | null>(null);
  salaryHike = signal<number | null>(null);
  contractStart = signal('');
  roleStart = signal('');
  lastPromotion = signal('');
  lastManagerDate = signal('');

  isFormInvalid = computed(() => {
    return (
      !this.firstName()?.trim() ||
      !this.lastName()?.trim() ||
      (this.monthlySalary() ?? 0) <= 0 ||
      (this.salaryHike() ?? 0) < 0 ||
      (this.salaryHike() ?? 0) > 100 ||
      (this.numCompanies() ?? 0) <= 0 ||
      !this.homeAddress()?.trim() ||
      !this.email()?.includes('@') ||
      (!this.isEditMode() && this.password()?.length < 6) ||
      !this.isValidDate(this.birthDate()) ||
      this.department() === null ||
      this.education() === null ||
      this.educationField() === null ||
      this.jobLevel() === null ||
      this.jobRole() === null ||
      this.gender() === null ||
      !this.isValidDate(this.roleStart()) ||
      !this.isValidDate(this.contractStart()) ||
      !this.isValidDate(this.lastPromotion()) ||
      !this.isValidDate(this.lastManagerDate())
    );
  });

  ngOnInit() {
    if (this.employee) {
      this.isEditMode.set(true);
      this.fillFormWithEmployee(this.employee);
    }
  }

  private fillFormWithEmployee(emp: Employee) {
    this.firstName.set(emp.first_name);
    this.lastName.set(emp.last_name);
    this.email.set(emp.email);
    this.birthDate.set(emp.birth_date);
    this.gender.set(emp.gender);
    this.maritalStatus.set(emp.marital_status);
    this.homeAddress.set(emp.home_address);
    this.phone.set(emp.phone);
    this.department.set(emp.department);
    this.education.set(emp.education);
    this.educationField.set(emp.education_field);
    this.jobLevel.set(emp.job_level);
    this.jobRole.set(emp.job_role);
    this.numCompanies.set(emp.number_of_companies_worked);
    this.monthlySalary.set(emp.monthly_salary);
    this.salaryHike.set(emp.percent_salary_hike);
    this.contractStart.set(emp.contract_start_date);
    this.roleStart.set(emp.current_role_start_date);
    this.lastPromotion.set(emp.last_promotion_date);
    this.lastManagerDate.set(emp.last_manager_date);
  }

  onLocationSelected(location: { lat: number, lng: number, address: string }) {
    this.locationTouched.set(true);
    this.homeAddress.set(location.address);
  }

  save() {
    if (this.isFormInvalid()) {
      this.presentToast('Please fill all required fields correctly', 'danger');
      return;
    }

    const user = this.authService.currentUser();
    if (!user?.id) {
      this.presentToast('Session expired. Please login again.', 'danger');
      return;
    }

    const dataToSave: Employee = {
      ...this.employee, 
      first_name: this.firstName(),
      last_name: this.lastName(),
      email: this.email(),
      password: this.password(),
      birth_date: this.birthDate(),
      gender: Number(this.gender()),
      marital_status: Number(this.maritalStatus()),
      home_address: this.homeAddress(),
      phone: this.phone(),
      department: Number(this.department()),
      education: Number(this.education()),
      education_field: Number(this.educationField()),
      job_level: Number(this.jobLevel()),
      job_role: Number(this.jobRole()),
      number_of_companies_worked: Number(this.numCompanies()),
      monthly_salary: Number(this.monthlySalary()),
      percent_salary_hike: Number(this.salaryHike()),
      contract_start_date: this.contractStart(),
      current_role_start_date: this.roleStart(),
      last_promotion_date: this.lastPromotion(),
      last_manager_date: this.lastManagerDate(),
      company_id: user.id,
    };

    this.presentToast('Employee data prepared successfully', 'success');
    return this.modalCtrl.dismiss(dataToSave, 'confirm');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  isValidDate(dateString: string): boolean {
    if (!dateString) return false;
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;
    const d = new Date(dateString);
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === dateString;
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}