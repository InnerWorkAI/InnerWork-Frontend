import { Component, inject, signal } from '@angular/core';
import { IonicModule, ModalController } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { camera, cloudUploadOutline, imageOutline } from 'ionicons/icons';
import { EmployeeService } from 'src/app/core/services/employee-service';

@Component({
  selector: 'app-change-picture-modal',
  standalone: true,
  templateUrl: './change-picture-modal.component.html',
  styleUrls: ['./change-picture-modal.component.scss'],
  imports: [IonicModule],
})
export class ChangePictureModalComponent {

  constructor() {
    addIcons({
      camera
    });
   }


  private modalCtrl = inject(ModalController);
  private employeeService = inject(EmployeeService);
  isLoading = signal<boolean>(false);

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async upload() {
  const file = this.selectedFile();
    const employee = this.employeeService.currentEmployee();
    
    if (!file || !employee?.id) return;

    this.isLoading.set(true); 

    this.employeeService.updateProfileImage(employee.id, file).subscribe({
      next: (res) => {
        this.modalCtrl.dismiss({ success: true });
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al subir:', err);
      }
    });
  }
}
