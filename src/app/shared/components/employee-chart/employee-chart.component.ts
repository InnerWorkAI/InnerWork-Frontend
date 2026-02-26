import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurnoutFormService } from 'src/app/core/services/burnout-form-service';
import { 
  NgApexchartsModule,
  ApexAxisChartSeries, 
  ApexChart, 
  ApexXAxis, 
  ApexYAxis, 
  ApexStroke, 
  ApexTooltip, 
  ApexFill 
} from 'ng-apexcharts';

@Component({
  selector: 'app-employee-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './employee-chart.component.html',
  styleUrls: ['./employee-chart.component.scss']
})
export class EmployeeChartComponent implements OnInit {
  private burnoutService = inject(BurnoutFormService);
  
  public daysRange = signal<7 | 30>(7);
  private allForms = this.burnoutService.burnoutForms;

  // Al iniciar, cargamos los datos si el servicio no lo ha hecho ya
  ngOnInit() {
    this.burnoutService.loadAll();
  }

  // 1. Datos reactivos mapeados al modelo real
  // En employee-chart.component.ts

public series = computed<ApexAxisChartSeries>(() => {
  const forms = this.allForms();
  
  // 1. Agrupamos por fecha (YYYY-MM-DD) para evitar duplicados en el eje X
  const dailyData: { [key: string]: { total: number, count: number } } = {};

  forms.forEach(f => {
    const dateKey = new Date(f.created_at).toISOString().split('T')[0];
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { total: 0, count: 0 };
    }
    const wellbeingScore = 100 - f.burnout_score; 
    dailyData[dateKey].total += wellbeingScore;
    dailyData[dateKey].count++;
  });

  // 2. Ordenamos las fechas y calculamos la media
  const sortedDates = Object.keys(dailyData).sort();
  const averages = sortedDates.map(date => 
    Math.round(dailyData[date].total / dailyData[date].count)
  );

  // 3. Aplicamos el rango (7 o 30 días)
  const finalData = averages.slice(-this.daysRange());

  return [{
    name: 'Company Average',
    data: finalData
  }];
});

public xaxis = computed<ApexXAxis>(() => {
  const forms = this.allForms();
  
  // Hacemos lo mismo para el eje X para que coincida con las series
  const dates = [...new Set(forms.map(f => 
    new Date(f.created_at).toISOString().split('T')[0]
  ))].sort();

  const finalDates = dates.slice(-this.daysRange()).map(d => {
    const dateObj = new Date(d);
    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
  });

  return {
    categories: finalDates,
    labels: { style: { colors: '#a4a4a4' } }
  };
});

  // 3. Configuración visual (el "look & feel")
  public chart: ApexChart = {
    type: 'line',
    height: 350,
    toolbar: { show: false },
    animations: { enabled: true }
  };

  private primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-primary').trim() || '#9333ea';
  
  private redColor = '#aa0b0b'; 

  // Ahora los usamos en las configuraciones
  public colors = [this.primaryColor];

  public fill: ApexFill = {
  type: 'gradient',
  gradient: {
    type: 'vertical',
    shadeIntensity: 0.5,
    inverseColors: false,
    opacityFrom: 1,
    opacityTo: 1,
    colorStops: [
      {
        offset: 0,
        color: this.primaryColor, 
        opacity: 1
      },
      {
        offset: 60,
        color: this.primaryColor, 
        opacity: 1
      },
      {
        offset: 80, 
        color: this.redColor, 
        opacity: 1
      },
      {
        offset: 100,
        color: this.redColor, 
        opacity: 1
      }
    ]
  }
};
  
  public stroke: ApexStroke = {
    curve: 'smooth',
    width: 3
  };

  public yaxis: ApexYAxis = {
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: {
      formatter: (val) => val.toFixed(0) + "%",
      style: { colors: '#a4a4a4' }
    }
  };

  public tooltip: ApexTooltip = {
    theme: 'light',
    y: { formatter: (val) => val + "%" }
  };

  toggleRange() {
    this.daysRange.update(r => r === 7 ? 30 : 7);
  }
}