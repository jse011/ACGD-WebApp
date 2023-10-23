import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ComboResponse } from 'src/app/models/response/comboResponse';
import { DataloggersPorGerenciaBuscarResponse } from 'src/app/models/response/dataloggersPorGerenciaBuscarResponse';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { ExcelService } from 'src/app/_service/excel.service';
import { SessionService } from 'src/app/services';
import { MatDialog } from '@angular/material/dialog';
import { BarChartDataloggerPorGerenciaComponent } from '../../grafico-charts/bar-chart-datalogger-por-gerencia/bar-chart-datalogger-por-gerencia.component';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
@Component({
  selector: 'app-datalogger-gerencia-tab',
  templateUrl: './datalogger-gerencia-tab.component.html',
  styleUrls: ['./datalogger-gerencia-tab.component.scss'],
})
export class DataloggerGerenciaTabComponent implements OnInit {
  mobileQuery: MediaQueryList;
  @BlockUI() blockUI: NgBlockUI;
  itemsPagination: DataloggersPorGerenciaBuscarResponse[];
  codeDatalogger: any;
  vGerencia: string;
  listDataloggersBuscarResponse: DataloggersPorGerenciaBuscarResponse[];
  listGerenciaCombo: ComboResponse[];
  codeGerencia: any;
  page = 1;
  total = 0;
  limit = 10;
  width = '85%';
  height = null;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  lstCantidad: number[] = [];
  constructor(
    media: MediaMatcher,
    private dataloggerService: DataloggerService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private sessionService: SessionService,
    public dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }
  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.width = '80%';
      this.height = '70%';
    }
    this.itemsPagination = [];
    this.listDataloggersBuscarResponse =
      new Array<DataloggersPorGerenciaBuscarResponse>();
    this.loadComboGerencia();
    this.getDataloggers(this.page);
  }

  buscarDataloggers() {
    this.page = 1;
    this.getDataloggers(this.page);
  }

  getDataloggers(pagina: number) {
    this.blockUI.start();
    const dataloggersConsultarRequest = {
      nCoddat: this.codeDatalogger,
      nCodarea: this.codeGerencia,
    };
    const page = {
      pagina: pagina,
      page_size: 10,
    };
    this.dataloggerService
      .listDataloggersPorGerencia(dataloggersConsultarRequest, page)
      .subscribe(
        (response) => {
          if (response.estado == 'ERROR') {
            this.blockUI.stop();
          } else {
            if (response.paginacion.totalRegistros > 0) {
              this.listDataloggersBuscarResponse = response.resultado;
              this.getDataloggerPaginada();
              this.total = response.paginacion.totalRegistros;
              /*GRAFICO */
              this.listDataloggersBuscarResponse.forEach((element) => {
                this.barChartLabels.push(element.vAbreviatura);
                this.lstCantidad.push(element.cantidad);
              });

              if (this.barChartLabels.length > 0) {
                this.barChartData.push({
                  data: this.lstCantidad,
                  label: 'Datalogger',
                  type: 'bar',
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
        /*GRAFICO */
            } else {
              this.toastr.info('No se encontraron dataloggers por gerencia', 'Información', {
                closeButton: true,
              });
            }
            this.blockUI.stop();
          }
        },
        (error) => {
          this.blockUI.stop();
          this.listDataloggersBuscarResponse =
            new Array<DataloggersPorGerenciaBuscarResponse>();
          this.itemsPagination = [];
          this.total = 0;
        }
      );
  }

  loadComboGerencia() {
    this.dataloggerService.loadComboGerencia().subscribe((response) => {
      this.listGerenciaCombo = response.resultado;
      this.listGerenciaCombo.unshift({
        nCodigo: -1,
        vDescripcion: '--Seleccione--',
      });
    });
  }

  getDataloggerPaginada(): void {
    this.itemsPagination = [];
    let j = 0;
    if (this.listDataloggersBuscarResponse.length > 0) {
      if (this.listDataloggersBuscarResponse.length < this.page * this.limit) {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.listDataloggersBuscarResponse.length;
          i++
        ) {
          this.itemsPagination[j] = this.listDataloggersBuscarResponse[i];
          j++;
        }
      } else {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.page * this.limit;
          i++
        ) {
          this.itemsPagination[j] = this.listDataloggersBuscarResponse[i];
          j++;
        }
      }
    } else {
      this.itemsPagination = this.listDataloggersBuscarResponse;
    }
  }

  goToPage(n: number): void {
    this.page = n;
    this.getDataloggerPaginada();
  }

  onNext(): void {
    this.page++;
    this.getDataloggerPaginada();
  }

  onPrev(): void {
    this.page--;
    this.getDataloggerPaginada();
  }

  exportExcel() {
    let nameFile = 'DATALOGGER-POR-GERENCIA'+'_'+this.formattedDate(new Date());
    this.excelService.generateExcel(
      this.listDataloggersBuscarResponse,
      nameFile,
      'LISTA DE DATALOGGER POR GERENCIA',
      'dg'
    );
    this.toastr.success('Excel exportado correctamente!..', 'Correcto', {
      closeButton: true,
    });
  }

  exportPDF(): void {
    const parametros: {
      usuarioActual?: string;
      lstDataloggers?: any[];
      nCoddat?: string;
      vGerencia?: string;
    } = {
      usuarioActual: this.sessionService.User.codUsuario,
      lstDataloggers: this.listDataloggersBuscarResponse,
      nCoddat: this.codeDatalogger,
      vGerencia: this.vGerencia,
    };

    this.dataloggerService
      .obtenerDataloggersPorGerenciaPDF(parametros)
      .subscribe(
        (data: any) => {
          let file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          var a = document.createElement('a');
          a.href = fileURL;
          a.download = 'DATALOGGER-POR-GERENCIA'+'_'+this.formattedDate(new Date())+'.pdf';
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
    const dialogRef = this.dialog.open(BarChartDataloggerPorGerenciaComponent, {
      height: this.height,
      width: this.width,
      data: { datalogger: this.listDataloggersBuscarResponse },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }



  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
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

