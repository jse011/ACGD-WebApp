import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Mensaje } from 'src/app/models/constantes/mensajes-datalogger';
import { ComboResponse } from 'src/app/models/response/comboResponse';
import { ReporteSeisValoresEomrBuscarResponse } from 'src/app/models/response/reporteSeisValoresEomrBuscarResponse';
import { SessionService } from 'src/app/services';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { ExcelService } from 'src/app/_service/excel.service';
import { ReporteService } from 'src/app/_service/reporte.service';
import { environment } from 'src/environments/environment';
import { BarChartReporteSeisValoresEomrComponent } from '../../grafico-charts/bar-chart-reporte-seis-valores-eomr/bar-chart-reporte-seis-valores-eomr.component';

@Component({
  selector: 'app-reporte-seis-valores-oemr',
  templateUrl: './reporte-seis-valores-oemr.component.html',
  styleUrls: ['./reporte-seis-valores-oemr.component.scss'],
})
export class ReporteSeisValoresOemrComponent implements OnInit {
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
  habilitaGrafico: boolean;

  codeDatalogger: any;
  codeEquipo: any;
  menssageExito:boolean;
  codeSector: any;
  listAreaCombo: ComboResponse[];
  listSectorCombo: ComboResponse[];
  listReporteSeisValoresEomrBuscarResponse: ReporteSeisValoresEomrBuscarResponse[];
  itemsPagination: ReporteSeisValoresEomrBuscarResponse[];
  menssageError: boolean;
  constructor(
    media: MediaMatcher,
    private toastr: ToastrService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    private dataloggerService: DataloggerService,
    private reporteService: ReporteService,
    private sessionService: SessionService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.codeSector = 1;    
    this.habilitaGrafico = true;
    this.codeEquipo = -1;
    this.menssageError=false;
    this.menssageExito=false;
  }

  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.width = '80%';
      this.height = '70%';
    }
    this.listAreaCombo = new Array<ComboResponse>();
    this.loadComboArea();    
    this.loadComboSector();
      //this.getReporte(this.page);
  }

  buscarReporte() {
    this.page = 1;
    this.getReporte(this.page);
  }

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
    const reporteSeisValoresEomrConsultarRequest = {
      fecInic: this.dFecinic != undefined ? this.dFecinic.toString() : null,
      fecFin: this.dFecfin != undefined ? this.dFecfin.toString() : null,
      nCoddat: this.codeDatalogger,
      nEquipo: this.codeEquipo,
      nSector: this.codeSector,
    };
    const page = {
      pagina: pagina,
      page_size: 10,
    };
    this.reporteService
      .listSeisValoresEomr(reporteSeisValoresEomrConsultarRequest, page)
      .subscribe(
        (response) => {
          if (response.estado == 'ERROR') {
            this.blockUI.stop();
          } else {
            if (response.paginacion.totalRegistros > 0) {
              this.listReporteSeisValoresEomrBuscarResponse =
                response.resultado;
                this.menssageExito=true;
                this.habilitaGrafico = false;    
              this.getReportePaginada();
              this.total = response.paginacion.totalRegistros;
            } else {
              this.itemsPagination = [];
              this.total = 0;
              this.habilitaGrafico = true;
              this.toastr.info(Mensaje.NOT_FOUND.descripcion, 'Información.', {
                closeButton: true,
              });
            }
            this.blockUI.stop();
          }
        },
        (error) => {
          this.blockUI.stop();
          this.listReporteSeisValoresEomrBuscarResponse =
            new Array<ReporteSeisValoresEomrBuscarResponse>();
          this.itemsPagination = [];
          this.total = 0;
        }
      );
  }

  exportExcel() {
    let nameFile = 'REPORTE-SEIS-VALORES-EOMR'+'_'+this.formattedDate(new Date());
    this.excelService.generateExcel(
      this.listReporteSeisValoresEomrBuscarResponse,
      nameFile,
      'LISTA REPORTE SEIS VALORES EOMR',
      'rsve'
    );
    this.toastr.success('Excel exportado correctamente!..', 'Correcto', {
      closeButton: true,
    });
  }

  exportPDF(): void {

    let lstReporte = [];
    this.listReporteSeisValoresEomrBuscarResponse.forEach(function (value) {
      let js = {numero:value.numero,fecha:value.fecha,hora:value.hora,vCodigoDatalogger:value.vCodigoDatalogger.toString(),volumenIngreso:value.volumenIngreso.toString(),volumenSalida:value.volumenSalida.toString(),volumenRps:value.volumenRps.toString(),caudalIngreso:value.caudalIngreso.toString(),caudalSalida:value.caudalSalida.toString(),caudalRps:value.caudalRps.toString()};
      lstReporte.push(js); 
    });
    const parametros: {
      usuarioActual?: string;
      lstReporte?: any[];
      //nCoddat?: string;
    } = {
      usuarioActual: this.sessionService.User.codUsuario,
      lstReporte: lstReporte,
      //nCoddat: this.codeDatalogger,
    };

    this.reporteService.obtenerSeisValoresEomrPDF(parametros).subscribe(
      (data: any) => {
        let file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        var a = document.createElement('a');
        a.href = fileURL;
        a.download = 'REPORTE-SEIS-VALORES-EOMR'+'_'+this.formattedDate(new Date())+'.pdf';
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
    const dialogRef = this.dialog.open(
      BarChartReporteSeisValoresEomrComponent,
      {
        height: this.height,
        width: this.width,
        data: { reporte: this.listReporteSeisValoresEomrBuscarResponse },
      }
    );
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
    if (this.listReporteSeisValoresEomrBuscarResponse.length > 0) {
      if (
        this.listReporteSeisValoresEomrBuscarResponse.length <
        this.page * this.limit
      ) {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.listReporteSeisValoresEomrBuscarResponse.length;
          i++
        ) {
          this.itemsPagination[j] =
            this.listReporteSeisValoresEomrBuscarResponse[i];
          j++;
        }
      } else {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.page * this.limit;
          i++
        ) {
          this.itemsPagination[j] =
            this.listReporteSeisValoresEomrBuscarResponse[i];
          j++;
        }
      }
    } else {
      this.itemsPagination = this.listReporteSeisValoresEomrBuscarResponse;
    }
  }

  public range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  
  loadComboArea() {
    this.dataloggerService.loadComboArea().subscribe((response) => {
      this.listAreaCombo = response.resultado;
      this.listAreaCombo.unshift({
        nCodigo: -1,
        vDescripcion: 'TODOS',
      });
    });
  }

  loadComboSector() {
    this.dataloggerService.loadComboSector().subscribe((response) => {
      this.listSectorCombo = response.resultado;
    });
  }

}