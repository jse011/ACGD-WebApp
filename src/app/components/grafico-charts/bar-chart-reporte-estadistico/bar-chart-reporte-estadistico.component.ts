import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartDataset, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-bar-chart-reporte-estadistico',
  templateUrl: './bar-chart-reporte-estadistico.component.html',
  styleUrls: ['./bar-chart-reporte-estadistico.component.scss'],
})
export class BarChartReporteEstadisticoComponent implements OnInit {
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  lstCantidad: number[] = [];
  lstCantidadBaja: number[] = [];
  lstCantidadMedia: number[] = [];
  nSector: number;
  vFechaIni: string;
  vFechaFin: string;
  step:number=0;

  constructor(
    public dialogRef: MatDialogRef<BarChartReporteEstadisticoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {    
    this.vFechaIni = this.data.reporte[0].fecha;
    this.vFechaFin = this.data.reporte[this.data.reporte.length - 1].fecha;
    this.nSector = this.data.reporte[0].vSector;
    this.data.reporte.forEach((element) => {
      this.barChartLabels.push(element.fecha);
      this.lstCantidad.push(element.zonaAlta);
      this.lstCantidadBaja.push(element.zonaBaja);
      this.lstCantidadMedia.push(element.zonaMedia);
    });

    if (this.barChartLabels.length > 0) {
      this.barChartData.push({
        data: this.lstCantidad,
        label: 'Alta',
        type: 'line',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)'
        ],
      });
      this.barChartData.push({
        data: this.lstCantidadBaja,
        label: 'Baja',
        type: 'line',
        backgroundColor: [
          'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)'
        ],
      });
      this.barChartData.push({
        data: this.lstCantidadMedia,
        label: 'Media',
        type: 'line',
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
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