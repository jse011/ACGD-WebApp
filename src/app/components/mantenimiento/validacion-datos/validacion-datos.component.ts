import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ValoresComboResponse } from 'src/app/models';
import { ParameterService, SessionService } from 'src/app/services';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ValidacionDatosService } from 'src/app/_service/validacion-datos.service';
import { ValidacionDatosListarResponse } from 'src/app/models/response/validacionDatosListarResponse';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DetalleValidacionDatosComponent } from '../detalle-validacion-datos/detalle-validacion-datos.component';
import { ComboResponse } from 'src/app/models/response/comboResponse';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { ObservarValidacionDatosComponent } from '../observar-validacion-datos/observar-validacion-datos.component';
import { OpenDialogDirective } from 'src/app/directives';
import { EstadoDatalogger } from 'src/app/models/constantes/estado-datalogger';
import { Mensaje } from 'src/app/models/constantes/mensajes-datalogger';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-validacion-datos',
  templateUrl: './validacion-datos.component.html',
  styleUrls: ['./validacion-datos.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
})
export class ValidacionDatosComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  mobileQuery: MediaQueryList;
  @ViewChild(OpenDialogDirective) openDialog;
  width = '45%';
  height = null;
  page = 1;
  total = 0;
  limit = 5;
  codeParametro: any;
  dFec = new FormControl();
  parametrosCombo: ValoresComboResponse[];
  dataloggerCombo: ComboResponse[];
  form: FormGroup;
  codeDatalogger: any;
  checkedAll: boolean = false;
  listId: Array<number> = [];
  deshabilitarBtnValidar: boolean = true;
  nAreaLogin: number;

  listValidacionDatosBuscarResponse: ValidacionDatosListarResponse[];
  itemsPagination: ValidacionDatosListarResponse[];

  verDetalleValidacionDatos: ValidacionDatosListarResponse;

  constructor(
    media: MediaMatcher,
    private validacionDatosService: ValidacionDatosService,
    private parameterService: ParameterService,
    private dataloggerService: DataloggerService,
    private sessionService: SessionService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
    this.loadParametroCombo();
    this.loadDataloggerCombo();
  }

  loadParametroCombo() {
    this.parameterService.listParameterCombo().subscribe((response) => {
      this.parametrosCombo = response.resultado;
      this.parametrosCombo.unshift({
        nNumreg: -1,
        vDescripcion: '--Todos--',
      });
    });
  }

  loadDataloggerCombo() {
    if (this.sessionService.User.codPerfil != 1) { //PEFIL 1 ADMINISTRADOR
      this.nAreaLogin = this.sessionService.User.codArea
    } else {
      this.nAreaLogin = 1;
    }
    this.dataloggerService
      .listDataloggerCombo(this.nAreaLogin)
      .subscribe((response) => {
        this.dataloggerCombo = response.resultado;
        this.dataloggerCombo.unshift({
          nCodigo: -1,
          vDescripcion: '--Todos--',
        });
      });
  }

  goToPage(n: number): void {
    this.page = n;
    this.getValidacionDatosPaginada();
  }

  onNext(): void {
    this.page++;
    this.getValidacionDatosPaginada();
  }

  onPrev(): void {
    this.page--;
    this.getValidacionDatosPaginada();
  }

  getValidacionDatosPaginada(): void {
    this.itemsPagination = [];
    let j = 0;
    if (this.listValidacionDatosBuscarResponse.length > 0) {
      if (
        this.listValidacionDatosBuscarResponse.length <
        this.page * this.limit
      ) {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.listValidacionDatosBuscarResponse.length;
          i++
        ) {
          this.itemsPagination[j] = this.listValidacionDatosBuscarResponse[i];
          j++;
        }
      } else {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.page * this.limit;
          i++
        ) {
          this.itemsPagination[j] = this.listValidacionDatosBuscarResponse[i];
          j++;
        }
      }
    } else {
      this.itemsPagination = this.listValidacionDatosBuscarResponse;
    }
  }

  validar() {
    let filasSeleccionadas = this.listValidacionDatosBuscarResponse.filter(
      (obj) => obj.select
    );
    if (filasSeleccionadas.length == 0) {
      this.toastr.warning('No se ha seleccionado Registro', 'Validación', {
        closeButton: true,
      });
    } else {
      this.openDialog.onClick({
        dialogType: 'content',
        dialogSRC: 'validar',
        onEvent: (data: any) => {
          if (data === '1') {
            this.blockUI.start();
            this.listId = filasSeleccionadas.map((obj) => {
              if (obj.select) return obj.id;
            });
            this.validacionDatosService.validar(this.listId).subscribe(
              (response) => {
                if (response.estado == 'OK') {
                  this.getValidacionDatos(this.page);
                  this.openDialog.onClick({
                    dialogType: 'content',
                    dialogSRC: 'addOK',
                    mensaje: 'Registro(s) Validado(s).',
                  });
                } else {
                  this.openDialog.onClick({
                    dialogType: 'content',
                    dialogSRC: 'error',
                    error: 'Error',
                  });
                }
                this.blockUI.stop();
              },
              (error) => {
                this.blockUI.stop();
                this.openDialog.onClick({
                  dialogType: 'content',
                  dialogSRC: 'error',
                  error:
                    'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.',
                });
              }
            );
          }
        },
      });
    }
  }

  verDetalle() {
    const dialogRef = this.dialog.open(DetalleValidacionDatosComponent, {
      height: this.height,
      data: { validacionDatos: this.verDetalleValidacionDatos },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.blockUI.stop();
      if (result !== undefined) {
        //this.getDataloggers(this.page);
      }
    });
  }

  observar() {
    const dialogRef = this.dialog.open(ObservarValidacionDatosComponent, {
      height: this.height,
      width: this.width,
      data: { validacionDatos: this.verDetalleValidacionDatos },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.blockUI.stop();
      if (result !== undefined) {
        this.getValidacionDatos(this.page);
      }
    });
  }

  selectRow(index, item: ValidacionDatosListarResponse) {
    this.verDetalleValidacionDatos = item;
  }

  chosenYearHandler(normalizedYear: Moment, ctlFecha: string) {
    if (this.dFec.value == null) this.dFec = new FormControl(moment());
    const ctrlValue = this.dFec.value;
    ctrlValue.year(normalizedYear.year());
    this.dFec.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>,
    ctlFecha: string
  ) {
    const ctrlValue = this.dFec.value;
    ctrlValue.month(normalizedMonth.month());
    this.dFec.setValue(ctrlValue);
    datepicker.close();
  }

  buscar() {
    this.page=1;
    this.getValidacionDatos(this.page);
  }

  getValidacionDatos(pagina: number) {
    this.blockUI.start();
    const page = {
      pagina: pagina,
      page_size: 10,
    };
    const listarValidacionDatosRequest = {
      fec: this.dFec.value,
      codeParametro: this.codeParametro,
      codeDatalogger: this.codeDatalogger,
    };
    this.validacionDatosService
      .listValidacionDatos(listarValidacionDatosRequest, page)
      .subscribe(
        (response) => {
          if (response.estado == 'ERROR') {
            this.blockUI.stop();
          } else {
            this.checkedAll = false;
            if (response.paginacion.totalRegistros > 0) {
              this.listValidacionDatosBuscarResponse = response.resultado;
              this.total = response.paginacion.totalRegistros;
              //this.agregarDiasFaltantesAlMes();
              this.getValidacionDatosPaginada();
            } else {
              this.total = 0;
              this.listValidacionDatosBuscarResponse =
                new Array<ValidacionDatosListarResponse>();
              this.itemsPagination = [];
              this.toastr.info(
                Mensaje.NOT_FOUND.descripcion,
                'Validacion',
                {
                  closeButton: true,
                }
              );
            }
            this.blockUI.stop();
          }
        },
        (error) => {
          this.blockUI.stop();
          this.listValidacionDatosBuscarResponse =
            new Array<ValidacionDatosListarResponse>();
          this.itemsPagination = [];
          this.total = 0;
        }
      );
  }

  checkAll() {
    if (this.checkedAll) {
      this.blockUI.start();
      for (let dato of this.listValidacionDatosBuscarResponse) {
        if (dato.id == -1) continue;
        if (dato.idEstado != EstadoDatalogger.VALIDADO.codigo)
          dato.select = this.checkedAll;
      }
      this.deshabilitarBtnValidar = false;
      this.blockUI.stop();
    } else {
      for (const dato of this.listValidacionDatosBuscarResponse) {
        dato.select = this.checkedAll;
      }
      this.deshabilitarBtnValidar = true;
    }
  }

  OnCheck(event, i, dato: ValidacionDatosListarResponse) {
    this.blockUI.start();
    if (dato.select) {
      this.listValidacionDatosBuscarResponse[i].select = true;
    } else {
      this.listValidacionDatosBuscarResponse[i].select = false;
    }
    let filasSeleccionadas = this.listValidacionDatosBuscarResponse.filter(
      (o) => o.select
    );
    if (filasSeleccionadas.length == 0) this.deshabilitarBtnValidar = true;
    else this.deshabilitarBtnValidar = false;
    this.blockUI.stop();
  }

  deshabilitarCheckFila(dato: ValidacionDatosListarResponse) {
    if (dato.idEstado == EstadoDatalogger.VALIDADO.codigo) return true;
    else false;
  }

  mostrarBtnObservar(idEstado: number): boolean {
    let retorna = true;
    if (idEstado == EstadoDatalogger.VALIDADO.codigo) retorna = false;
    return retorna;
  }
}