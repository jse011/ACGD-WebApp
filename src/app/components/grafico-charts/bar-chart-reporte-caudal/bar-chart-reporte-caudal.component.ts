import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartDataset, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-bar-chart-reporte-caudal',
  templateUrl: './bar-chart-reporte-caudal.component.html',
  styleUrls: ['./bar-chart-reporte-caudal.component.scss'],
})
export class BarChartReporteCaudalComponent implements OnInit {
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  lstCantidad: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<BarChartReporteCaudalComponent>,
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
        label: 'CAUDAL',
        type: 'line'
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