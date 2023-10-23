import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartDataset, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-bar-chart-datalogger-por-distrito',
  templateUrl: './bar-chart-datalogger-por-distrito.component.html',
  styleUrls: ['./bar-chart-datalogger-por-distrito.component.scss'],
})
export class BarChartDataloggerPorDistritoComponent implements OnInit {
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  lstCantidad: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<BarChartDataloggerPorDistritoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.data.datalogger.forEach((element) => {
      this.barChartLabels.push(element.distritoBuscarResponse.vDesdistrito);
      this.lstCantidad.push(element.cantidad);
    });

    if (this.barChartLabels.length > 0) {
      this.barChartData.push({
        data: this.lstCantidad,
        label: 'Datalogger',
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
      borderWidth: 1      
      });
    }
  }

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90
        }
      },
      y: {
        stacked: true,
      },
    },
  };
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];
}