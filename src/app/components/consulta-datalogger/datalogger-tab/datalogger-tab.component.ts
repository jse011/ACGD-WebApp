import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { DataloggersBuscarResponse } from 'src/app/models/response/dataloggersBuscarResponse';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { ExcelService } from 'src/app/_service/excel.service';
import { SessionService } from 'src/app/services';
import { ComboResponse } from 'src/app/models/response/comboResponse';
import { Mensaje } from 'src/app/models/constantes/mensajes-datalogger';

@Component({
  selector: 'app-datalogger-tab',
  templateUrl: './datalogger-tab.component.html',
  styleUrls: ['./datalogger-tab.component.scss'],
})
export class DataloggerTabComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  mobileQuery: MediaQueryList;
  page = 1;
  total = 0;
  limit = 10;

  codeDatalogger: any;
  listDataloggersBuscarResponse: DataloggersBuscarResponse[];
  itemsPagination: DataloggersBuscarResponse[];
  listEquipoCombo: ComboResponse[];
  listDistritoCombo: ComboResponse[];
  codeEquipo: any;
  codeDistrito: any;

  constructor(
    media: MediaMatcher,
    private dataloggerService: DataloggerService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private sessionService: SessionService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
    this.listDataloggersBuscarResponse = new Array<DataloggersBuscarResponse>();
    this.itemsPagination = [];
    this.listEquipoCombo = new Array<ComboResponse>();
    this.listDistritoCombo = new Array<ComboResponse>();
    this.getDataloggers(this.page);
    this.loadComboEquipo();
    this.loadComboDistrito();
  }

  buscarDataloggers() {
    this.page = 1;
    this.getDataloggers(this.page);
  }

  getDataloggers(pagina: number) {
    this.blockUI.start();
    const dataloggersConsultarRequest = {
      nCoddat: this.codeDatalogger,
      nCodequipo: this.codeEquipo,
      nCoddistrito: this.codeDistrito,
    };
    const page = {
      pagina: pagina,
      page_size: 10,
    };
    this.dataloggerService
      .listDataloggers(dataloggersConsultarRequest, page)
      .subscribe(
        (response) => {
          if (response.estado == 'ERROR') {
            this.blockUI.stop();
          } else {
            if (response.paginacion.totalRegistros > 0) {
              this.listDataloggersBuscarResponse = response.resultado;
              this.getDataloggerPaginada();
              this.total = response.paginacion.totalRegistros;
            } else {
              this.listDataloggersBuscarResponse =
                new Array<DataloggersBuscarResponse>();
              this.itemsPagination = [];
              this.total = 0;
              this.toastr.info(Mensaje.NOT_FOUND.descripcion, 'Información', {
                closeButton: true,
              });
            }
            this.blockUI.stop();
          }
        },
        (error) => {
          this.blockUI.stop();
          this.listDataloggersBuscarResponse =
            new Array<DataloggersBuscarResponse>();
          this.itemsPagination = [];
          this.total = 0;
        }
      );
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
    let nameFile = 'DATALOGGER'+'_'+this.formattedDate(new Date());
    this.excelService.generateExcel(
      this.listDataloggersBuscarResponse,
      nameFile,
      'LISTA DE DATALOGGER',
      'd'
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
    } = {
      usuarioActual: this.sessionService.User.codUsuario,
      lstDataloggers: this.listDataloggersBuscarResponse,
      nCoddat: this.codeDatalogger,
    };
    this.dataloggerService.obtenerDataloggersPDF(parametros).subscribe(
      (data: any) => {
        let file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        var a = document.createElement('a');
        a.href = fileURL;
        a.download = 'DATALOGGER'+'_'+this.formattedDate(new Date())+'.pdf';
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

  loadComboEquipo() {
    this.dataloggerService.loadComboEquipo().subscribe((response) => {
      this.listEquipoCombo = response.resultado;
      this.listEquipoCombo.unshift({
        nCodigo: -1,
        vDescripcion: '--Seleccione--',
      });
    });
  }

  loadComboDistrito() {
    this.dataloggerService.loadComboDistrito().subscribe((response) => {
      this.listDistritoCombo = response.resultado;
      this.listDistritoCombo.unshift({
        nCodigo: -1,
        vDescripcion: '--Seleccione--',
      });
    });
  }
}