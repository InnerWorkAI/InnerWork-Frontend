import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ApexStroke
} from 'ng-apexcharts';

@Component({
  selector: 'app-department-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './department-chart.component.html',
  styleUrls: ['./department-chart.component.scss'],
})
export class DepartmentChartComponent {
  public series: ApexAxisChartSeries = [
    {
      name: 'Satisfaction',
      data: [65, 42, 88, 30, 75]
    }
  ];

  public chart: ApexChart = {
    height: 350,
    type: 'bar',
    toolbar: { show: false },
    animations: {
      enabled: true,
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      },
      // Forzamos el acceso a la propiedad para evitar el error TS2353
      ...({ easing: 'easeinout' } as any) 
    }
  };

  // Morado corporativo para todas las barras
  public colors = ["#9334EA"];

  public stroke: ApexStroke = {
    show: true,
    width: 2,
    colors: ['transparent'] // Evita parpadeos de bordes durante la animación
  };

  public plotOptions: ApexPlotOptions = {
    bar: {
      columnWidth: '55%',
      borderRadius: 6,
      distributed: false, // Mismo color para todas
      dataLabels: {
        position: 'top', 
      }
    }
  };

  public dataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val) => val + "%",
    offsetY: -25,
    style: {
      fontSize: '12px',
      colors: ["#717171"]
    }
  };

  public xaxis: ApexXAxis = {
    categories: ['Sales', 'IT', 'HR', 'Marketing', 'Finance'],
    labels: {
      style: {
        colors: '#a4a4a4',
        fontSize: '12px'
      }
    },
    tooltip: { enabled: false }, // Eliminado el recuadro "Chart"
    axisBorder: { show: false },
    axisTicks: { show: false }
  };

  public yaxis: ApexYAxis = {
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: {
      formatter: (val) => val + "%",
      style: { colors: '#a4a4a4' }
    }
  };

  public fill: ApexFill = {
    type: 'solid', // Forzamos sólido para que no haya saltos de renderizado
    opacity: 1
  };

  public legend: ApexLegend = {
    show: false 
  };

  public tooltip: ApexTooltip = {
    theme: 'light',
    y: {
      formatter: (val) => val + "%"
    }
  };

  constructor() {}
}