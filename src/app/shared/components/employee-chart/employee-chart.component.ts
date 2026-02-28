import { Component, computed, input} from '@angular/core';
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
export class EmployeeChartComponent{
  public title = input<string>('');
  public subtitle = input<string>('');
  public legend = input<ChartLegendItem[]>([]);
  
  public series = input<ApexAxisChartSeries>([]); 
  public categories = input<string[]>([]);

  private primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary').trim() || '#9333ea';
  private redColor = '#aa0b0b';

  public chart: ApexChart = { type: 'line', height: 350, toolbar: { show: false }, animations: { enabled: true } };
  public colors = [this.primaryColor];
  public stroke: ApexStroke = { curve: 'smooth', width: 3 };
  public yaxis: ApexYAxis = { min: 0, max: 100, tickAmount: 5, labels: { formatter: (val) => val.toFixed(0) + "%", style: { colors: '#a4a4a4' } } };
  public tooltip: ApexTooltip = { theme: 'light', y: { formatter: (val) => val + "%" } };

  public xaxis = computed<ApexXAxis>(() => ({
    categories: this.categories(),
    labels: { style: { colors: '#a4a4a4' } }
  }));

  public fill: ApexFill = {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0.5,
      colorStops: [
        { offset: 0, color: this.primaryColor, opacity: 1 },
        { offset: 60, color: this.primaryColor, opacity: 1 },
        { offset: 80, color: this.redColor, opacity: 1 },
        { offset: 100, color: this.redColor, opacity: 1 }
      ]
    }
  };
}

export interface ChartLegendItem {
  label: string;
  color: string;
  isLine?: boolean;
}