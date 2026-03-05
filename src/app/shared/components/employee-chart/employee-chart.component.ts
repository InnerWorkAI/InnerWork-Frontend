import { Component, computed, effect, input} from '@angular/core';
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

export interface ChartLegendItem {
  label: string;
  color: string;
  isLine?: boolean;
}

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
  public chartColors = input<string[]>(['#a855f7']);  
  public series = input<ApexAxisChartSeries>([]); 
  public categories = input<string[]>([]);

  constructor() {}

  public chart: ApexChart = {
    type: 'line', 
    height: 350,
    redrawOnParentResize: true,
    toolbar: { show: false }, 
    animations: { enabled: true/* , easing: 'easeinout', speed: 800 */ }
    
  };

  public responsive: any[] = [{
    breakpoint: 576,
    options: {
      chart: {
        height: 280
      },
      xaxis: {
        labels: {
          style: { fontSize: '9px' }
        }
      }
    }
  }];
  
  public colors = computed(() => this.chartColors());
  public stroke: ApexStroke = { curve: 'smooth', width: 2.5 };
  
  public yaxis: ApexYAxis = { 
    min: 0, 
    max: 100, 
    tickAmount: 5, 
    labels: { formatter: (val) => val.toFixed(0) + "%", style: { colors: '#a4a4a4' } } 
  };

  public tooltip: ApexTooltip = { 
    theme: 'light', 
    y: { formatter: (val) => val + "%" } };

  public xaxis = computed<ApexXAxis>(() => ({
    categories: this.categories(),    
    labels: { style: { colors: '#a4a4a4' } }
  }));

  public fill: ApexFill = {
    type: 'solid',
    opacity: 0.9
  };
}