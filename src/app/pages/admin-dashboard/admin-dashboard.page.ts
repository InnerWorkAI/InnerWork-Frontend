import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EmployeeChartComponent } from 'src/app/shared/components/employee-chart/employee-chart.component'

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, EmployeeChartComponent]
})
export class AdminDashboardPage implements OnInit {

  // Estos son los datos que mañana vendrán de tu API
  employees = [
    { id: 1, name: 'Alice Johnson', dept: 'Marketing', lastEv: '2024-05-10', score: 85 },
    { id: 2, name: 'Bob Williams', dept: 'Sales', lastEv: '2024-05-12', score: 62 },
    { id: 3, name: 'Diana Miller', dept: 'Human Resources', lastEv: '2024-05-14', score: 71 },
    { id: 4, name: 'Eve Davis', dept: 'Engineering', lastEv: '2024-05-07', score: 45 },
    { id: 5, name: 'Marcus Thorne', dept: 'Finance', lastEv: '2024-05-15', score: 92 },
    { id: 6, name: 'Sophia Loren', dept: 'Design', lastEv: '2024-05-11', score: 54 }
  ];

  user = "Admin";


  addEmployee() {
    console.log('Abriendo formulario para añadir empleado...');
    // Aquí es donde más adelante abriremos el Modal
  }

  constructor() {}

  ngOnInit() {}

  // Lógica de colores para el fondo del badge
  getScoreBg(score: number): string {
    if (score >= 80) return '#f0fdf4'; 
    if (score < 50) return '#fee2e2';  
    if (score < 70) return '#fffbeb';  
    return '#f3f4f6';                 
  }

  // Lógica de colores para el texto del badge
  getScoreColor(score: number): string {
    if (score >= 80) return '#16a34a'; 
    if (score < 50) return '#ef4444'; 
    if (score < 70) return '#d97706'; 
    return '#374151';
  }

  viewProfile(id: number) {
    console.log('Navegando al perfil del empleado:', id);
    // Aquí iría tu router.navigate
  }
}