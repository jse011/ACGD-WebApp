import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ValoresComboResponse } from 'src/app/models';
import { ComboResponse } from 'src/app/models/response/comboResponse';
import { ImportacionManualListarResponse } from 'src/app/models/response/importacionManualListarResponse';
import { ParameterService, SessionService } from 'src/app/services';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { MantenimientoService } from 'src/app/_service/mantenimiento.service';
import { CargaArchivoComponent } from '../carga-archivo/carga-archivo.component';
import { DetalleImportacionManualComponent } from '../detalle-importacion-manual/detalle-importacion-manual.component';
import { Mensaje } from 'src/app/models/constantes/mensajes-datalogger';
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
import { ErroresCargaResponse } from 'src/app/models/response/erroresCargaResponse';
import { OpenDialogDirective } from 'src/app/directives';
import { EstadoDatalogger } from 'src/app/models/constantes/estado-datalogger';

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
  selector: 'app-importacion-manual',
  templateUrl: './importacion-manual.component.html',
  styleUrls: ['./importacion-manual.component.scss'],
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
export class ImportacionManualComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(OpenDialogDirective) openDialog;
  mobileQuery: MediaQueryList;
  width = '45%';
  height = null;
  page = 1;
  total = 0;
  limit = 10;
  mostrarErroresValidacionCarga: boolean = false;
  dFec = new FormControl();
  //dFecfin = new FormControl();
  form: FormGroup;
  minDate: Date;
  habilFecFinal: boolean = true;
  nAreaLogin: number;
  codeDatalogger: any;
  codeParametro: any;
  parametrosCombo: ValoresComboResponse[];
  dataloggerCombo: ComboResponse[];

  listImportacionManualListarResponse: ImportacionManualListarResponse[];
  itemsPagination: ImportacionManualListarResponse[];

  verDetalleImportacionManual: ImportacionManualListarResponse;
  listErroresCargaResponse: ErroresCargaResponse[];
  listId: Array<number> = [];
  checkedAll: boolean = false;
  deshabilitarBtnEliminar: boolean = true;

  constructor(
    media: MediaMatcher,
    public session: SessionService,
    private parameterService: ParameterService,
    private mantenimientoService: MantenimientoService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private dataloggerService: DataloggerService,
    private sessionService: SessionService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
    this.loadParametroCombo();
    this.loadDataloggerCombo();
    this.dFec = new FormControl(moment());
  }

  loadParametroCombo() {
    this.listErroresCargaResponse = [];
    this.parameterService.listParameterCombo().subscribe((response) => {
      this.parametrosCombo = response.resultado;
    });
  }

  loadDataloggerCombo() {

    if (this.session.User.codPerfil != 1) { //PEFIL 1 ADMINISTRADOR
      this.nAreaLogin = this.sessionService.User.codArea
    } else {
      this.nAreaLogin = 1;
    }

    this.dataloggerService.listDataloggerCombo(this.nAreaLogin).subscribe((response) => {
      this.dataloggerCombo = response.resultado;
    });
  }

  goToPage(n: number): void {
    this.page = n;
    this.getManualImportacionPaginada();
  }

  onNext(): void {
    this.page++;
    this.getManualImportacionPaginada();
  }

  onPrev(): void {
    this.page--;
    this.getManualImportacionPaginada();
  }

  getManualImportacion(pagina: number) {
    this.blockUI.start();
    const page = {
      pagina: pagina,
      page_size: 10,
    };
    const listarImporacionManualRequest = {
      fec: this.dFec.value,
      codeParametro: this.codeParametro,
      codeDatalogger: this.codeDatalogger,
    };
    this.mantenimientoService
      .listImportacionManual(listarImporacionManualRequest, page)
      .subscribe(
        (response) => {
          if (response.estado == 'ERROR') {
            this.blockUI.stop();
          } else {
            this.checkedAll = false;
            if (response.paginacion.totalRegistros > 0) {
              this.listImportacionManualListarResponse = response.resultado;
              this.total = response.paginacion.totalRegistros;
              this.agregarDiasFaltantesAlMes();
              this.getManualImportacionPaginada();
            } else {
              this.total = 0;
              this.listImportacionManualListarResponse =
                new Array<ImportacionManualListarResponse>();
              this.itemsPagination = [];
              if (this.listErroresCargaResponse[0] != undefined) {

                if (this.listErroresCargaResponse[0].nroFila == 0) {
                  this.toastr.warning(
                    this.listErroresCargaResponse[0].descripcion,
                    'Validacion',
                    {
                      closeButton: true,
                    }
                  );
                }
                else {
                  this.toastr.info(
                    Mensaje.NOT_FOUND.descripcion,
                    'Validacion',
                    {
                      closeButton: true,
                    }
                  );
                }

              }
              console.log("JSON " + JSON.stringify(response));


            }
            this.blockUI.stop();
          }
        },
        (error) => {
          this.blockUI.stop();
          this.listImportacionManualListarResponse =
            new Array<ImportacionManualListarResponse>();
          this.itemsPagination = [];
          this.total = 0;
        }
      );
  }

  getManualImportacionPaginada(): void {
    this.itemsPagination = [];
    let j = 0;
    if (this.listImportacionManualListarResponse.length > 0) {
      if (
        this.listImportacionManualListarResponse.length <
        this.page * this.limit
      ) {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.listImportacionManualListarResponse.length;
          i++
        ) {
          this.itemsPagination[j] = this.listImportacionManualListarResponse[i];
          j++;
        }
      } else {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.page * this.limit;
          i++
        ) {
          this.itemsPagination[j] = this.listImportacionManualListarResponse[i];
          j++;
        }
      }
    } else {
      this.itemsPagination = this.listImportacionManualListarResponse;
    }
  }

  seleccionarExcel() {
    this.listErroresCargaResponse = [];
    this.mostrarErroresValidacionCarga = false;
    let seleccionarArchivo = true;
    if (this.codeParametro == -1 || this.codeParametro == undefined) {
      this.toastr.warning('Debe seleccionar un parámetro.', 'Validación', {
        closeButton: true,
      });
      seleccionarArchivo = false;
    }
    if (this.codeDatalogger == -1 || this.codeDatalogger == undefined) {
      this.toastr.warning(
        'Debe ingresar un código de datalogger.',
        'Validación',
        {
          closeButton: true,
        }
      );
      seleccionarArchivo = false;
    }

    if (this.dFec.value == '' || this.dFec.value == undefined) {
      this.toastr.warning('Debe ingresar un fecha.', 'Validación', {
        closeButton: true,
      });
      seleccionarArchivo = false;
    }

    if (seleccionarArchivo) {
      const dialogRef = this.dialog.open(CargaArchivoComponent, {
        height: '220px',
        width: '35%',
        //width: '30%',
        //height: 'auto',
        //width: 'auto',
        data: {
          boton_eliminar_modal: 'Eliminar', //this.boton_eliminar_modal,
          boton_seleccionar_modal: 'Seleccionar Archivo', //this.boton_seleccionar_modal,
          boton_subir_modal: 'ACEPTAR', //this.boton_subir_modal,
          disabled_boton_seleccionar_modal: false,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if (result.event == 'Guardar') {
            this.blockUI.start();
            //this.fileListPadre = result.data;
            let body = {
              codeParametro: this.codeParametro,
              codeDatalogger: this.codeDatalogger,
              fecha: this.dFec.value,
              document: result.data,
            };
            this.mantenimientoService.importacionManual(body).subscribe(
              (response) => {
                this.page=1;
                //this.dialogRef.close(response);
                if (response.estado == 'OK') {
                  this.listErroresCargaResponse = response.resultado;
                  if (this.listErroresCargaResponse.length > 0)
                    this.mostrarErroresValidacionCarga = true;
                  this.getManualImportacion(this.page);
                  /*this.openDialog.onClick({
                    dialogType: 'content',
                    dialogSRC: 'updateOK',
                    mensaje: 'Actualizado',
                    //mensaje: response.cRESP_SP
                  });*/
                } else {
                  this.toastr.error(
                    'Presentando incoveniente al listar.',
                    'Error',
                    {
                      closeButton: true,
                    }
                  );
                  /*this.openDialog.onClick({
                    dialogType: 'content',
                    dialogSRC: 'error',
                    error: 'Error',
                    //error: response.cRESP_SP
                  });*/
                }
                this.blockUI.stop();
              },
              (error) => {
                //this.dialogRef.close(error);
                /*this.openDialog.onClick({
                  dialogType: 'content',
                  dialogSRC: 'error',
                  error:
                    'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.',
                });*/
                this.blockUI.stop();
              }
            );
          }
          if (result.event == 'Cancel') {
            console.log('Se canceló la carga');
          }
        }
      });
    }
  }

  cancelarImportacion() {
    let filasSeleccionadas = this.listImportacionManualListarResponse.filter(
      (obj) => obj.select && obj.id != -1
    );
    if (filasSeleccionadas.length == 0) {
      this.toastr.warning('No se ha seleccionado Registro', 'Validación', {
        closeButton: true,
      });
    } else {
      this.openDialog.onClick({
        dialogType: 'content',
        dialogSRC: 'delete',
        onEvent: (data: any) => {
          if (data === '1') {
            this.blockUI.start();
            this.listId = filasSeleccionadas.map((obj) => {
              if (obj.select) return obj.id;
            });
            this.mantenimientoService
              .cancelarImportacion(this.listId)
              .subscribe(
                (response) => {
                  if (response.estado == 'OK') {
                    this.getManualImportacion(this.page);
                    this.toastr.success(
                      'Registros eliminados correctamente!..',
                      'Correcto',
                      {
                        closeButton: true,
                      }
                    );
                    /*this.openDialog.onClick({
                      dialogType: 'content',
                      dialogSRC: 'addOK',
                      mensaje: 'Registros Eliminados.',
                    });*/
                  } else {
                    /*this.openDialog.onClick({
                      dialogType: 'content',
                      dialogSRC: 'error',
                      error: 'Error',
                    });*/
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

  buscar() {
    this.page = 1;
    let aplicaBusqueda = true;
    if (this.codeParametro == undefined) {
      this.toastr.warning('Debe seleccionar un parámetro.', 'Validación', {
        closeButton: true,
      });
      aplicaBusqueda = false;
    }
    if (this.codeDatalogger == undefined) {
      this.toastr.warning(
        'Debe ingresar un código de datalogger.',
        'Validación',
        {
          closeButton: true,
        }
      );
      aplicaBusqueda = false;
    }
    if (aplicaBusqueda) {
      this.listErroresCargaResponse = [];
      this.mostrarErroresValidacionCarga = false;
      this.getManualImportacion(this.page);
    }
  }

  verDetalle() {
    const dialogRef = this.dialog.open(DetalleImportacionManualComponent, {
      height: this.height,
      data: { importacionManual: this.verDetalleImportacionManual },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.blockUI.stop();
      if (result !== undefined) {
        //this.getDataloggers(this.page);
      }
    });
  }

  selectRow(index, item: ImportacionManualListarResponse) {
    this.verDetalleImportacionManual = item;
  }

  chosenYearHandler(normalizedYear: Moment, ctlFecha: string) {
    if (ctlFecha == 'fi') {
      if (this.dFec.value == null) this.dFec = new FormControl(moment());
      const ctrlValue = this.dFec.value;
      ctrlValue.year(normalizedYear.year());
      this.dFec.setValue(ctrlValue);
    } else {
      const ctrlValue = this.dFec.value;
      ctrlValue.year(normalizedYear.year());
      this.dFec.setValue(ctrlValue);
    }
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>,
    ctlFecha: string
  ) {
    if (ctlFecha == 'fi') {
      const ctrlValue = this.dFec.value;
      ctrlValue.month(normalizedMonth.month());
      this.dFec.setValue(ctrlValue);
      datepicker.close();
      const currentYear = normalizedMonth.year();
      this.minDate = new Date(currentYear, normalizedMonth.month(), 1);
      this.dFec.setValue(ctrlValue);
      this.habilFecFinal = false;
    } else {
      const ctrlValue = this.dFec.value;
      ctrlValue.month(normalizedMonth.month());
      this.dFec.setValue(ctrlValue);
      datepicker.close();
    }
  }

  agregarDiasFaltantesAlMes() {
    this.loopRecursivo(0);
  }

  loopRecursivo(indi) {
    let indice = indi;
    var index = indi;
    for (
      index = indice;
      index < this.listImportacionManualListarResponse.length;
      index++
    ) {
      const element = this.listImportacionManualListarResponse[index];
      let fechSplit = element.fecha.split('/');
      let fecJoin = fechSplit[2] + '-' + fechSplit[1] + '-' + fechSplit[0];
      let fec = moment(fecJoin);
      let diasPorMes = this.getDaysInMonth(fec.year(), fec.month() + 1);
      let fechas = [];
      let day = 1;
      for (let i = 0; i < diasPorMes; i++) {
        let fecConcat = '';
        if (day.toString().length < 2) {
          if (fec.month() + 1 == 12) {
            fecConcat = '0' + day.toString() + '/' + (fec.month() + 1).toString() + '/' + fec.year();
          } else if (fec.month() + 1 == 11) {
            fecConcat = '0' + day.toString() + '/' + (fec.month() + 1).toString() + '/' + fec.year();
          } else if (fec.month() + 1 == 10) {
            fecConcat = '0' + day.toString() + '/' + (fec.month() + 1).toString() + '/' + fec.year();
          } else {
            fecConcat = '0' + day.toString() + '/' + '0' + (fec.month() + 1).toString() + '/' + fec.year();
          }
        } else {
          if (fec.month().toString().length < 2) {

            if (fec.month() + 1 == 12) {
              fecConcat = day.toString() + '/' + (fec.month() + 1).toString() + '/' + fec.year();
            } else if (fec.month() + 1 == 11) {
              fecConcat = day.toString() + '/' + (fec.month() + 1).toString() + '/' + fec.year();
            } else if (fec.month() + 1 == 10) {
              fecConcat = day.toString() + '/' + (fec.month() + 1).toString() + '/' + fec.year();
            } else {
              fecConcat = day.toString() + '/' + '0' + (fec.month() + 1).toString() + '/' + fec.year();
            }
          } else
            fecConcat = day.toString() + '/' + (fec.month() + 1).toString() + '/' + fec.year();
        }
        fechas.push(fecConcat);
        day++;
      }

      let lengt = index + diasPorMes;
      let contador = 0;
      for (let i = index; i < lengt; i++) {
        if (this.listImportacionManualListarResponse[i] != undefined) {
          if (
            fechas[contador] !=
            this.listImportacionManualListarResponse[i].fecha
          ) {
            let obj = {
              id: -1,
              sector: null,
              area: null,
              fecha: fechas[contador],
              datalogger: null,
              codeParametro: null,
              descParametro: null,
              min: null,
              max: null,
              prom: null,
              cantidadRegistros: null,
              observacion: null,
              estado: null,
            };
            this.listImportacionManualListarResponse.splice(i, 0, obj);
          }
        } else {
          let obj = {
            id: -1,
            sector: null,
            area: null,
            fecha: fechas[contador],
            datalogger: null,
            codeParametro: null,
            descParametro: null,
            min: null,
            max: null,
            prom: null,
            cantidadRegistros: null,
            observacion: null,
            estado: null,
          };
          this.listImportacionManualListarResponse.splice(i, 0, obj);
        }
        contador++;
      }
      index = lengt - 1;
      indice = lengt - 1;
    }
    this.total = this.listImportacionManualListarResponse.length;
  }

  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  checkAll() {
    if (this.checkedAll) {
      this.blockUI.start();
      for (let dato of this.listImportacionManualListarResponse) {
        if (dato.id == -1) continue;
        if (dato.idEstado != EstadoDatalogger.VALIDADO.codigo)
          dato.select = this.checkedAll;
      }
      this.deshabilitarBtnEliminar = false;
      this.blockUI.stop();
    } else {
      for (const dato of this.listImportacionManualListarResponse) {
        dato.select = this.checkedAll;
      }
      this.deshabilitarBtnEliminar = true;
    }
  }

  OnCheck(event, i, dato: ImportacionManualListarResponse) {
    this.blockUI.start();
    let impManual = this.listImportacionManualListarResponse.find(
      (o) => o.id === dato.id
    );
    if (impManual) impManual.select = dato.select;
    let filasSeleccionadas = this.listImportacionManualListarResponse.filter(
      (o) => o.select && o.id != -1
    );
    if (filasSeleccionadas.length == 0) this.deshabilitarBtnEliminar = true;
    else this.deshabilitarBtnEliminar = false;
    this.blockUI.stop();
  }

  concatFilaError(dato) {
    let msj = '';

    if (dato.nroFila == 0) {
      if (dato.tituloColumna == null){
        msj = dato.descripcion;
      }else {
        msj = dato.tituloColumna + ' : ' + dato.descripcion;
      }
    }
    else {
      if (dato.nroFila != 0) msj += 'En fila ' + dato.nroFila;
      if (dato.tituloColumna != null) msj += ' de ' + dato.tituloColumna + ' : ';
      if (dato.descripcion != null) msj += dato.descripcion;

    }


    return msj;
  }

  validarDatoNuloVacio(dato: any) {
    let respuesta = true;
    if (dato == null) respuesta = false;
    else {
      if (dato.trim() == '') respuesta = false;
    }
    return respuesta;
  }

  habilitarCheck(dato: ImportacionManualListarResponse) {
    let habilitar = false;
    if (dato.idEstado == EstadoDatalogger.VALIDADO.codigo) habilitar = true;
    return habilitar;
  }
}