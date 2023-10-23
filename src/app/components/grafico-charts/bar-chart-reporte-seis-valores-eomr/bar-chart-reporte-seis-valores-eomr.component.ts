import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartDataset, ChartType, ChartOptions } from 'chart.js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bar-chart-reporte-seis-valores-eomr',
  templateUrl: './bar-chart-reporte-seis-valores-eomr.component.html',
  styleUrls: ['./bar-chart-reporte-seis-valores-eomr.component.scss'],
})
export class BarChartReporteSeisValoresEomrComponent implements OnInit {
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  lstCantidad: number[] = [];
  step =0;

  constructor(
    public dialogRef: MatDialogRef<BarChartReporteSeisValoresEomrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    var min = Math.min(...this.data.reporte.map(item => item.volumenIngreso));
    var max = Math.max(...this.data.reporte.map(item => item.volumenIngreso));
    this.step = (max - min) / environment.rangoIntervalo;
    this.data.reporte.forEach((element) => {
      this.barChartLabels.push(element.fecha);
      this.lstCantidad.push(element.volumenIngreso);
    });

    

    if (this.barChartLabels.length > 0) {
      this.barChartData.push({
        data: this.lstCantidad,
        label: 'EOMR',
        type: 'line',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
      });
   
    }
    this.setBarChartOptions();
    this.barChartOptions.scales.y.min = min;
    this.barChartOptions.scales.y.max = max;
  }

  setBarChartOptions(){
    this.barChartOptions = {
      responsive: true,
      scales: {
        x: {
          //stacked: true,
        },
        y:{
          //stacked: true,
          ticks:{
            stepSize:this.step,
            callback: function(value, index, values) {
              return  Number(value).toFixed(3);
            }
          }
        }
      },
    };
  }

  barChartOptions: ChartOptions = {};
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
}