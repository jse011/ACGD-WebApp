import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { OpenDialogDirective } from '../../../directives';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { ValidacionDatosListarDetalleResponse } from 'src/app/models/response/validacionDatosListarDetalleResponse';
import { ValidacionDatosService } from 'src/app/_service/validacion-datos.service';
import { Parametro } from 'src/app/models/enums/parametro';

@Component({
  selector: 'app-detalle-validacion-datos',
  templateUrl: './detalle-validacion-datos.component.html',
  styleUrls: ['./detalle-validacion-datos.component.scss'],
})
export class DetalleValidacionDatosComponent implements OnInit {
  @ViewChild(OpenDialogDirective) openDialog;
  @BlockUI() blockUI: NgBlockUI;
  mobileQuery: MediaQueryList;
  error = '';
  titulo: string;
  id: string;
  sector: string;
  datalogger: string;
  maximo: string;
  area: string;
  minimo: string;
  promedio: string;
  mostrarVC: boolean = false;
  mostrarVISRCISR: boolean = false;
  widthHora: string = '50%';
  widthMedicion: string = '50%';
  titleParametro1: string = 'MEDICIÓN';
  titleParametro2: string = 'MEDICIÓN 2';
  fecha: string = '';
  estado: string = '';
  page = 1;
  total = 0;
  limit = 5;

  listValidacionDatosListarDetalleResponse: ValidacionDatosListarDetalleResponse[];
  itemsPagination: ValidacionDatosListarDetalleResponse[];

  constructor(
    media: MediaMatcher,
    public dialogRef: MatDialogRef<DetalleValidacionDatosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private validacionDatosService: ValidacionDatosService,
    private toastr: ToastrService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit() {
    this.listValidacionDatosListarDetalleResponse =
      new Array<ValidacionDatosListarDetalleResponse>();
    this.itemsPagination = [];
    this.titulo = 'Detalle de Mediciones';
    this.cargarDatos(this.data);
    this.getValidacionDatosDetalle(this.page);
  }

  cargarDatos(data: any) {
    this.id = data.validacionDatos.id;
    this.sector = data.validacionDatos.sector;
    this.datalogger = data.validacionDatos.datalogger;
    this.maximo = data.validacionDatos.max;
    this.area = data.validacionDatos.area;
    this.minimo = data.validacionDatos.min;
    this.promedio = data.validacionDatos.prom;
    this.fecha = data.validacionDatos.fecha;
    this.estado = data.validacionDatos.estado;
  }

  getValidacionDatosDetalle(pagina: number) {
    this.blockUI.start();
    const page = {
      pagina: pagina,
      page_size: 10,
    };
    let fecha = this.data.validacionDatos.fecha.split('/');
    if(this.id==null){
      this.blockUI.stop();
      return;
    }
    this.validacionDatosService
      .listValidacionDatosDetalle(
        new Date(
          parseInt(fecha[2]),
          parseInt(fecha[1]) - 1,
          parseInt(fecha[0])
        ),
        this.data.validacionDatos.datalogger,
        page,
        this.data.validacionDatos.codeParametro,
        this.id
      )
      .subscribe(
        (response) => {
          if (response.estado == 'ERROR') {
            this.blockUI.stop();
          } else {
            if (response.paginacion.totalRegistros > 0) {
              this.listValidacionDatosListarDetalleResponse =
                response.resultado;
              let foundVC = this.listValidacionDatosListarDetalleResponse.find(
                (obj) => obj.idParametro == Parametro.VOLUMEN_CAUDAL
              );

              let foundVISRCISR =
                this.listValidacionDatosListarDetalleResponse.find(
                  (obj) =>
                    obj.idParametro ==
                    Parametro.VOLING_VOLSALID_VOLRPS_CAUDALING_CAUDALSALIDA_CAUDALRPS
                );
              if (foundVC != null) {
                this.mostrarVC = true;
                this.widthHora = '10%';
                this.widthMedicion = '45%';
                this.titleParametro1 = 'VOLÚMEN';
                this.titleParametro2 = 'CAUDAL';
              }
              if (foundVISRCISR != null) {
                this.mostrarVISRCISR = true;
                this.widthHora = '10%';
                this.widthMedicion = '15%';
              }
              this.getValidacionDatosDetallePaginada();
              this.total = response.paginacion.totalRegistros;
            } else {
              this.toastr.warning(
                'No se encontraron detalle de Medición',
                'Error',
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
          this.listValidacionDatosListarDetalleResponse =
            new Array<ValidacionDatosListarDetalleResponse>();
          this.itemsPagination = [];
          this.total = 0;
        }
      );
  }

  getValidacionDatosDetallePaginada(): void {
    this.itemsPagination = [];
    let j = 0;
    if (this.listValidacionDatosListarDetalleResponse.length > 0) {
      if (
        this.listValidacionDatosListarDetalleResponse.length <
        this.page * this.limit
      ) {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.listValidacionDatosListarDetalleResponse.length;
          i++
        ) {
          this.itemsPagination[j] =
            this.listValidacionDatosListarDetalleResponse[i];
          j++;
        }
      } else {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.page * this.limit;
          i++
        ) {
          this.itemsPagination[j] =
            this.listValidacionDatosListarDetalleResponse[i];
          j++;
        }
      }
    } else {
      this.itemsPagination = this.listValidacionDatosListarDetalleResponse;
    }
  }

  goToPage(n: number): void {
    this.page = n;
    this.getValidacionDatosDetallePaginada();
  }

  onNext(): void {
    this.page++;
    this.getValidacionDatosDetallePaginada();
  }

  onPrev(): void {
    this.page--;
    this.getValidacionDatosDetallePaginada();
  }
}