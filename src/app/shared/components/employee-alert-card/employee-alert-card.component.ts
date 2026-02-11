import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-employee-alert-card',
  standalone: true, 
  imports: [CommonModule, IonicModule],
  templateUrl: './employee-alert-card.component.html',
  styleUrls: ['./employee-alert-card.component.scss'],
})

export class EmployeeAlertCardComponent {
  constructor() {
    // 2. Registra el icono aquí
    addIcons({ arrowForwardOutline });
  }
  name = input.required<string>();
  photo = input<string>('https://i.pravatar.cc/150?u=default');
  lastCheckIn = input<string>();
  reason = input<string>();
  severity = input<string>('High');

  // Evento para avisar cuando se pulse "View Details"
  viewDetails = output<void>();

  onDetailsClick() {
    this.viewDetails.emit();
  }
}
