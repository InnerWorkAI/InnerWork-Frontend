import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'add-edit-employee-modal',
  templateUrl: './add-edit-employee-modal.component.html',
  styleUrls: ['./add-edit-employee-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AddEditEmployeeModalComponent implements OnInit {
  // Recibimos el empleado por aquí. Si viene vacío, es que estamos creando.
  @Input() employee: any; 

  public isEditMode = false;
  public formData = { name: '', dept: '', score: 0, lastEv: '' };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.employee) {
      this.isEditMode = true;
      // Clonamos los datos para no editar el original directamente
      this.formData = { ...this.employee };
    } else {
      // Valores por defecto si es nuevo
      this.formData.lastEv = new Date().toISOString().split('T')[0];
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    // Devolvemos los datos al dashboard
    return this.modalCtrl.dismiss(this.formData, 'confirm');
  }
}

