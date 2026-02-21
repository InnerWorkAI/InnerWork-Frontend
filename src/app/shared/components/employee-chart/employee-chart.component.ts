import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexYAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexLegend,
  ApexFill
} from 'ng-apexcharts';

@Component({
  selector: 'app-employee-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './employee-chart.component.html',
  styleUrls: ['./employee-chart.component.scss'],
})
export class EmployeeChartComponent {
  public series: ApexAxisChartSeries = [];
  public chart: ApexChart = {
    height: 350,
    type: "line",
    toolbar: { show: false },
    animations: { enabled: true }
  };
  
  public colors = ["#a855f7", "#141414"]; 
  public stroke: ApexStroke = { curve: "smooth", width: 2 };
  public xaxis: ApexXAxis = { categories: [] };
  
  public yaxis: ApexYAxis = { 
    min: 0, 
    max: 100, 
    tickAmount: 5,
    labels: {
      formatter: (val) => val + "%"
    }
  };

  public dataLabels: ApexDataLabels = { enabled: false };
  public legend: ApexLegend = { position: 'bottom', horizontalAlign: 'center' };

  public fill: ApexFill = {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 100],
      colorStops: [
        [
          { offset: 0, color: "#a855f7", opacity: 1 },
          { offset: 50, color: "#a855f7", opacity: 1 },
          { offset: 51, color: "#aa0b0b", opacity: 1 },
          { offset: 100, color: "#aa0b0b", opacity: 1 }
        ],
        [
          { offset: 0, color: "#aa0b0b", opacity: 1 },
          { offset: 50, color: "#aa0b0b", opacity: 1 },
          { offset: 51, color: "#141414", opacity: 1 },
          { offset: 100, color: "#141414", opacity: 1 }
        ]
      ]
    }
  };

  public tooltip: ApexTooltip = {
    enabled: true,
    theme: 'light',
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const happinessVal = series[0][dataPointIndex];
      const stressVal = series[1][dataPointIndex];

      // Los puntos (dots) se quedan FIJOS con sus colores originales
      const hDotColor = '#a855f7'; 
      const sDotColor = '#141414';

      // Solo los números cambian a rojo #aa0b0b si hay alerta
      const hNumberColor = happinessVal < 50 ? '#aa0b0b' : '#141414';
      const sNumberColor = stressVal > 50 ? '#aa0b0b' : '#141414';

      return `
        <div class="custom-tooltip">
          <div class="tooltip-header">
            <span class="day-label">Day ${w.globals.labels[dataPointIndex]}</span>
          </div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="dot" style="background-color: ${hDotColor} !important"></span>
              <span style="color: #141414 !important">Happiness: 
                <b style="color: ${hNumberColor} !important; margin-left: 5px;">${happinessVal}%</b>
              </span>
            </div>
            <div class="tooltip-row">
              <span class="dot" style="background-color: ${sDotColor} !important"></span>
              <span style="color: #141414 !important">Stress: 
                <b style="color: ${sNumberColor} !important; margin-left: 5px;">${stressVal}%</b>
              </span>
            </div>
          </div>
        </div>
      `;
    }
  };

  constructor() {
    this.cargarDatos(7);
  }

  cargarDatos(dias: number) {
    if (dias === 7) {
      this.series = [
        { name: "Happiness Metrics", data: [85, 80, 75, 70, 60, 40, 35] },
        { name: "Stress Levels", data: [20, 25, 30, 35, 45, 65, 85] }
      ];
      this.xaxis = { 
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        labels: { style: { colors: '#a4a4a4' } }
      };
    } else {
      let valFel = 80;
      let valEst = 20;
      const dataFelicidad = Array.from({ length: 30 }, () => {
        valFel += Math.floor(Math.random() * 21) - 12;
        return Math.max(0, Math.min(100, valFel));
      });
      const dataEstres = Array.from({ length: 30 }, () => {
        valEst += Math.floor(Math.random() * 21) - 8;
        return Math.max(0, Math.min(100, valEst));
      });
      this.series = [
        { name: "Happiness Metrics", data: dataFelicidad },
        { name: "Stress Levels", data: dataEstres }
      ];
      this.xaxis = { 
        categories: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        labels: { show: false }
      };
    }
  }
}