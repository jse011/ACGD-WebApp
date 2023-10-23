import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartDataset, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-bar-chart-reporte-nivel',
  templateUrl: './bar-chart-reporte-nivel.component.html',
  styleUrls: ['./bar-chart-reporte-nivel.component.scss'],
})
export class BarChartReporteNivelComponent implements OnInit {
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  lstCantidad: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<BarChartReporteNivelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.data.reporte.forEach((element) => {
      this.barChartLabels.push(element.fecha);
      this.lstCantidad.push(element.vParametro1);
    });

    if (this.barChartLabels.length > 0) {
      this.barChartData.push({
        data: this.lstCantidad,
        label: 'Nivel',
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
  }

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        //stacked: true,
      },
      y: {
        //stacked: true,
      },
    },
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
}