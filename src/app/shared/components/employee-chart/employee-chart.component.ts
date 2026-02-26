import { Component, computed, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class EmployeeChartComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public rawData = input<any[]>([]);
  public daysRange = signal<7 | 30>(7);

  // Colores corporativos
  private primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary').trim() || '#9333ea';
  private redColor = '#aa0b0b';

  // 1. Procesamos los datos para las series (Media de Bienestar)
  public series = computed<ApexAxisChartSeries>(() => {
    const forms = this.rawData().filter(f => f?.created_at && f?.burnout_score !== undefined);
    if (forms.length === 0) return [];

    const dailyData: { [key: string]: { total: number, count: number } } = {};

    forms.forEach(f => {
      const dateKey = new Date(f.created_at).toISOString().split('T')[0];
      if (!dailyData[dateKey]) dailyData[dateKey] = { total: 0, count: 0 };
      
      dailyData[dateKey].total += (100 - f.burnout_score);
      dailyData[dateKey].count++;
    });

    const sortedDates = Object.keys(dailyData).sort();
    const averages = sortedDates.map(date => Math.round(dailyData[date].total / dailyData[date].count));

    return [{
      name: 'Company Average',
      data: averages.slice(-this.daysRange())
    }];
  });

  // 2. Procesamos el Eje X
  public xaxis = computed<ApexXAxis>(() => {
    const forms = this.rawData().filter(f => f?.created_at);
    const dates = [...new Set(forms.map(f => new Date(f.created_at).toISOString().split('T')[0]))].sort();

    const finalDates = dates.slice(-this.daysRange()).map(d => {
      const dateObj = new Date(d);
      return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    });

    return {
      categories: finalDates,
      labels: { style: { colors: '#a4a4a4' } }
    };
  });

  // 3. Configuración Visual Estática
  public chart: ApexChart = { type: 'line', height: 350, toolbar: { show: false }, animations: { enabled: true } };
  public colors = [this.primaryColor];
  public stroke: ApexStroke = { curve: 'smooth', width: 3 };
  public yaxis: ApexYAxis = { min: 0, max: 100, tickAmount: 5, labels: { formatter: (val) => val.toFixed(0) + "%", style: { colors: '#a4a4a4' } } };
  public tooltip: ApexTooltip = { theme: 'light', y: { formatter: (val) => val + "%" } };

  public fill: ApexFill = {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0.5,
      inverseColors: false,
      colorStops: [
        { offset: 0, color: this.primaryColor, opacity: 1 },
        { offset: 60, color: this.primaryColor, opacity: 1 },
        { offset: 80, color: this.redColor, opacity: 1 },
        { offset: 100, color: this.redColor, opacity: 1 }
      ]
    }
  };

  toggleRange() {
    this.daysRange.update(r => r === 7 ? 30 : 7);
  }
}