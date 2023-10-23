import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ValoresComboResponse } from 'src/app/models';
import { Mensaje } from 'src/app/models/constantes/mensajes-datalogger';
import { ComboResponse } from 'src/app/models/response/comboResponse';
import { ErroresCargaResponse } from 'src/app/models/response/erroresCargaResponse';
import { ReporteEstadisticoBuscarResponse } from 'src/app/models/response/reporteEstadisticoBuscarResponse';
import { ParameterService, SessionService } from 'src/app/services';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { ExcelService } from 'src/app/_service/excel.service';
import { ReporteService } from 'src/app/_service/reporte.service';
import { environment } from 'src/environments/environment';
import { BarChartReporteEstadisticoComponent } from '../../grafico-charts/bar-chart-reporte-estadistico/bar-chart-reporte-estadistico.component';

@Component({
  selector: 'app-reporte-estadisticos',
  templateUrl: './reporte-estadisticos.component.html',
  styleUrls: ['./reporte-estadisticos.component.scss'],
})
export class ReporteEstadisticosComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  mobileQuery: MediaQueryList;
  page = 1;
  total = 0;
  limit = 10;
  dFecinic: Date;
  dFecfin: Date;
  form: FormGroup;

  width = '85%';
  height = null;
  habilitaGrafico:boolean;
  codeDatalogger: any;
  codeParametro: any;
  codeTiempo: any;
  menssageExito:boolean;
  menssageError: boolean;
  codeEquipo: any;
  codeSector: any;
  listAreaCombo: ComboResponse[];
  listTiempoCombo: ComboResponse[];
  listSectorCombo: ComboResponse[];
  listErroresCargaResponse: ErroresCargaResponse[];
  parametrosCombo: ValoresComboResponse[];
  listReporteEstadisticoBuscarResponse: ReporteEstadisticoBuscarResponse[];
  itemsPagination: ReporteEstadisticoBuscarResponse[];

  constructor(
    media: MediaMatcher,
    private toastr: ToastrService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    private dataloggerService: DataloggerService,
    private parameterService: ParameterService,
    private reporteService: ReporteService,
    private sessionService: SessionService
  ) {
    this.habilitaGrafico = true; 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.menssageError=false;
    this.menssageExito=false;
    this.codeSector = 1;
    this.codeEquipo = -1;
    this.codeParametro = 1;
    this.codeTiempo = 2
  }

  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.width = '80%';
      this.height = '70%';
    }
    this.listAreaCombo = new Array<ComboResponse>();
    this.listTiempoCombo = new Array<ComboResponse>();
    this.loadComboArea();
  }

  buscarReporte() {
    this.page = 1;
    this.getReporte(this.page);
  }

  loadParametroCombo() {
    this.listErroresCargaResponse = [];
    this.parameterService.listParameterCombo().subscribe((response) => {
      this.parametrosCombo = response.resultado.filter(x => x.nNumreg < 2);
      this.loadComboTiempo();  
    });
  }

  public range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  

  getReporte(pagina: number) {
    this.blockUI.start();
     ///
     this.menssageError=false;
     this.menssageExito= false;
     
     if (this.range.controls.start.valid && this.range.controls.end.valid && this.range.value.start != null && this.range.value.end != null) {
       var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
       function diferenciaEntreDiasEnDias(a, b) {
         var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
         var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
         return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);
       }
       var dia1 = new Date(this.range.value.start);
       var dia2 = new Date(this.range.value.end);
       var resultado = diferenciaEntreDiasEnDias(dia1, dia2);
       console.log(resultado);
        
       if (resultado > environment.rangoFechas) {
         this.toastr.warning('El rango no puede exceder los 7 dias.', 'Validación', {
           closeButton: true,
         });
         this.blockUI.stop();
         return;
       }else{
         this.dFecinic = this.range.value.start;
         this.dFecfin = this.range.value.end;
       }
     } else {
       this.menssageError=true;
       this.toastr.warning('Por favor, Ingresar un rango de fecha válida.', 'Validación', {
         closeButton: true,
       });
       this.blockUI.stop();
       return;
     }
    const reporteEstadisticoConsultarRequest = {
      fecInic: this.dFecinic != undefined ? this.dFecinic.toString() : null,
      fecFin: this.dFecfin != undefined ? this.dFecfin.toString() : null,
      nParametro: this.codeParametro,
      nTiempo: this.codeTiempo,
      nCoddat: this.codeDatalogger,
      nEquipo: this.codeEquipo,
      nSector: this.codeSector
    };
    const page = {
      pagina: pagina,
      page_size: 10,
    };
    this.reporteService
    .listEstadistico(reporteEstadisticoConsultarRequest, page).subscribe(
        (response) => {
          
          if (response.estado == 'ERROR') {
            this.blockUI.stop();
          } else {
            if (response.paginacion.totalRegistros > 0) {
              this.habilitaGrafico = false; 
              this.menssageExito=true;
              this.listReporteEstadisticoBuscarResponse = response.resultado;
              this.getReportePaginada();
              this.total = response.paginacion.totalRegistros;
            } else {
              this.itemsPagination = [];
              this.total = 0;              
              this.habilitaGrafico = true; 
              this.toastr.info(Mensaje.NOT_FOUND.descripcion, 'Información', {
                closeButton: true,
              });
            }
            this.blockUI.stop();
          }
        },
        (error) => {
          this.blockUI.stop();
          this.listReporteEstadisticoBuscarResponse =
            new Array<ReporteEstadisticoBuscarResponse>();
          this.itemsPagination = [];
          this.total = 0;
        }
      );
  }

  exportExcel() {
    let nameFile = 'REPORTE-ESTADISTICO'+'_'+this.formattedDate(new Date());
    this.excelService.generateExcel(
      this.listReporteEstadisticoBuscarResponse,
      nameFile,
      'LISTA DE REPORTE ESTADÍSTICO',
      're'
    );
    this.toastr.success('Excel exportado correctamente!..', 'Correcto', {
      closeButton: true,
    });
  }

  exportPDF(): void {
    const parametros: {
      usuarioActual?: string;
      lstReporte?: any[];
      //nCoddat?: string;
    } = {
      usuarioActual: this.sessionService.User.codUsuario,
      lstReporte: this.listReporteEstadisticoBuscarResponse,
      //nCoddat: this.codeDatalogger,
    };

    this.reporteService.obtenerEstadisticoPDF(parametros).subscribe(
      (data: any) => {
        let file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        var a = document.createElement('a');
        a.href = fileURL;
        a.download = 'REPORTE-ESTADISTICO'+'_'+this.formattedDate(new Date())+'.pdf';
        document.body.appendChild(a);
        a.click();
        this.toastr.success('PDF exportado correctamente!..', 'Correcto', {
          closeButton: true,
        });
      },
      (error) =>
        this.toastr.error('Error al exportar PDF!..', 'Error', {
          closeButton: true,
        })
    );
  }

  formattedDate(d: Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    const hr = String(this.addZero(d.getHours()));
    const min = String(this.addZero(d.getMinutes()));
    const sg = String(this.addZero(d.getSeconds()));
    const hora = hr + min + sg;

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return `${year}${month}${day}${hora}`;
  }

  addZero(i) {
    if (i < 10) {
      i = "0" + i
    }else{
      i;
    }
    return i;
  } 

  verGrafico() {
    const dialogRef = this.dialog.open(BarChartReporteEstadisticoComponent, {
      height: this.height,
      width: this.width,
      data: { reporte: this.listReporteEstadisticoBuscarResponse },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  goToPage(n: number): void {
    this.page = n;
    this.getReportePaginada();
  }

  onNext(): void {
    this.page++;
    this.getReportePaginada();
  }

  onPrev(): void {
    this.page--;
    this.getReportePaginada();
  }

  getReportePaginada(): void {
    this.itemsPagination = [];
    let j = 0;
    if (this.listReporteEstadisticoBuscarResponse.length > 0) {
      if (
        this.listReporteEstadisticoBuscarResponse.length <
        this.page * this.limit
      ) {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.listReporteEstadisticoBuscarResponse.length;
          i++
        ) {
          this.itemsPagination[j] =
            this.listReporteEstadisticoBuscarResponse[i];
          j++;
        }
      } else {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.page * this.limit;
          i++
        ) {
          this.itemsPagination[j] =
            this.listReporteEstadisticoBuscarResponse[i];
          j++;
        }
      }
    } else {
      this.itemsPagination = this.listReporteEstadisticoBuscarResponse;
    }
  }

  loadComboArea() {
    this.dataloggerService.loadComboArea().subscribe((response) => {
      this.listAreaCombo = response.resultado;
      this.loadComboSector();
      this.listAreaCombo.unshift({
        nCodigo: -1,
        vDescripcion: 'TODOS',
      });
    });
  }

  loadComboSector() {
    
    this.dataloggerService.loadComboSector().subscribe((response) => {
      
      this.loadParametroCombo();
      this.listSectorCombo = response.resultado;      
    });
  }

  loadComboTiempo() {
    
    this.dataloggerService.loadComboTiempo().subscribe((response) => {
      
      this.listTiempoCombo = response.resultado;      
    });
  }


}