import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartDataset, ChartType, ChartOptions } from 'chart.js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bar-chart-reporte-volumen-presion',
  templateUrl: './bar-chart-reporte-volumen-presion.component.html',
  styleUrls: ['./bar-chart-reporte-volumen-presion.component.scss'],
})
export class BarChartReporteVolumenPresionComponent implements OnInit {
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  barChartDatabaja: ChartDataset[] = [];
  lstCantidadAlta: number[] = [];

  lstCantidadAlta1: [] = [];
  barChartLabelsBaja: string[] = [];
  dataloggers: string[] = [];
  lstCantidadBaja: number[] = [];
  lstTime: number[] = [];


  barChartLabelsMedio: string[] = [];
  lstCantidadMedio: number[] = [];

  nSector: number;
  vFechaIni: string;
  vFechaFin: string;
  step: number = 0;
  lstRepeated: number[] = [];
  zonaBaja=0;
  zonaMedia=0;
  zonaAlta=0;


  constructor(
    public dialogRef: MatDialogRef<BarChartReporteVolumenPresionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    let v = this;
    this.data.reporte = this.data.reporte.sort((a, b) => parseFloat(b.vTimest) - parseFloat(a.vTimest));
    
    this.vFechaIni = this.data.reporte[0].dFecha;
    console.log('1612 fec ini '+this.vFechaIni);
    this.vFechaFin = this.data.reporte[this.data.reporte.length - 1].dFecha;
    this.nSector = this.data.reporte[0].vSector;
    // this.data.reporte.sort(({vTimest:a}, {vTimest:b}) => b-a);
    var min = Math.min(...this.data.reporte.map(item => item.vParametro1));
    var max = Math.max(...this.data.reporte.map(item => item.vParametro1));
    this.step = (max - min) / environment.rangoIntervalo;

    

    this.data.reporte.forEach((element: { vZona: string; vParametro1: number; dFecha: string; }) => {
      if (element.vZona == "ALTA") {
        //this.barChartLabels.push(element.dFecha);
        this.lstCantidadAlta.push(element.vParametro1);
        //this.lstCantidadAlta1.push({x=element.dFecha,y=element.vParametro1});
        this.lstCantidadBaja.push(null);
        this.lstCantidadMedio.push(null);
      } else{
        if (element.vZona == "BAJA") {
          this.barChartLabelsBaja.push(element.dFecha);
          this.lstCantidadBaja.push(element.vParametro1);
          this.lstCantidadAlta.push(null);
          this.lstCantidadMedio.push(null);
        } else{
            // this.barChartLabels.push(element.dFecha);
            this.lstCantidadMedio.push(element.vParametro1);
            this.lstCantidadAlta.push(null);
            this.lstCantidadBaja.push(null);
        }
      }
    });
    let hash = {};
    this.barChartLabels = this.data.reporte.filter((o: { dFecha: string | number; }) => hash[o.dFecha] ? false : hash[o.dFecha] = true).map((obje: { dFecha: any; }) => obje.dFecha);
    this.dataloggers = this.data.reporte.filter((o: { vCodigoDatalogger: string | number; }) => hash[o.vCodigoDatalogger] ? false : hash[o.vCodigoDatalogger] = true).map((obje: { vCodigoDatalogger: any; }) => obje.vCodigoDatalogger);
    //this.lstTime = this.data.reporte.filter((o: { vTimest: string | number; }) => hash[o.vTimest] ? false : hash[o.vTimest] = true).map((obje: { vTimest: any; }) => obje.vTimest);
    this.lstTime = this.data.reporte.map(item => item.vTimest).filter((value, index, self) => self.indexOf(value) === index);
    //this.lstTime = [...new Set(this.data.reporte.map(item => item.vTimest))];
    //console.log("2612 BAR CHART LAB  "+this.barChartLabels);
    //console.log("2612 LST TIME  "+this.lstTime.toString());
    //console.log("2612 DATALOGGER "+this.dataloggers.toString());
    this.dataloggers.forEach(function (value, ind) {
      let datos = v.data.reporte.filter( x => 
        x.vCodigoDatalogger.toString() == value 
      );
      //console.log("DATOS DAT "+value+" json "+JSON.stringify(datos));
      let datt = [];
      let zona = datos[0].vZona;
      v.barChartLabels.forEach(function (val) {
        let found = false;
        let valor = 0;
        datos.forEach(function (vald) {
          if(vald.dFecha.toString().includes(val)){
            found = true;
            valor = vald.vParametro1;
          }
        });
        if(found){
          datt.push(valor);
        }
        else{
          datt.push(null);
        }

      });

      if(zona=='ALTA'){
        v.zonaAlta = v.zonaAlta +1;
        if(v.zonaAlta>1) v.lstRepeated.push(ind); 
        console.log("2612 ALTA "+datt.toString());
        v.barChartData.push({
          data: datt,
          label: 'ALTA',
          type: 'line',
          backgroundColor: [
            'rgba(249, 67, 11, 0.5)',
          ],
          borderColor: [
            'rgba(249, 67, 11, 1)',
          ],
          pointBackgroundColor:'rgba(249, 67, 11, 1)',
          borderWidth: 1
        });
      }
      else if(zona=='MEDIA'){
        v.zonaMedia = v.zonaMedia +1;
        if(v.zonaMedia>1) v.lstRepeated.push(ind); 
        v.barChartData.push({
          data: datt,
          label: 'MEDIA',
          type: 'line',
          
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
          ],
          pointBackgroundColor:'rgba(54, 162, 235, 1)',
          borderWidth: 1
        });
      }
      else if(zona=='BAJA'){
        v.zonaBaja = v.zonaBaja +1;
        if(v.zonaBaja>1) v.lstRepeated.push(ind); 
        v.barChartData.push({
          data: datt,
          label: 'BAJA',
          type: 'line',
          
          backgroundColor: [
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)'
          ],
          pointBackgroundColor:'rgba(255, 206, 86, 1)',
          borderWidth: 1
        });
      }



      //console.log('2612 VALUES '+datt);

    });
    

    
    

   

    /*this.barChartDatabaja.push({
      data: this.lstCantidadBaja,
      label: 'BAJA',
      type: 'line',

    });*/
    /*if (this.barChartLabelsBaja.length > 0){
      this.barChartData.push({
        data: this.lstCantidadBaja,
        label: 'BAJA',
        type: 'line',
      });
    }

    if (this.barChartLabelsMedio.length > 0){
      this.barChartData.push({
        data: this.lstCantidadMedio,
        label: 'MEDIA',
        type: 'line',
      });
   
    }*/
    this.setbarChartOptions();
    this.barChartOptions.scales.y.min = min;
    this.barChartOptions.scales.y.max = max;
  }

  setbarChartOptions(){
    let v = this;
    this.barChartOptions = {
      responsive: true,

      plugins:{ legend: { labels:{

        filter: function(legendItem, chartData) {
          if (v.lstRepeated.some(item => item === legendItem.datasetIndex)  ) {
              return false;
          }
        return true;
        }


      } }, },
      scales: {
        x: {
          //stacked: true,
        },
        y: {
          //stacked: true,
          ticks:{
            stepSize:this.step
          }
        },
      },
    };
  }

  barChartOptions: ChartOptions = {};
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
}