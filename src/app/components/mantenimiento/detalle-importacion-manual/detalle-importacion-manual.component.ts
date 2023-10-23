import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OpenDialogDirective } from '../../../directives';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { ImportacionManualListarDetalleResponse } from 'src/app/models/response/importacionManualListarDetalleResponse';
import { MantenimientoService } from 'src/app/_service/mantenimiento.service';
import { ToastrService } from 'ngx-toastr';
import { Parametro } from 'src/app/models/enums/parametro';

@Component({
  selector: 'app-detalle-importacion-manual',
  templateUrl: './detalle-importacion-manual.component.html',
  styleUrls: ['./detalle-importacion-manual.component.scss'],
})
export class DetalleImportacionManualComponent implements OnInit {
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

  page = 1;
  total = 0;
  limit = 5;
  fecha= '';
  estado = '';

  listImportacionManualListarDetalleResponse: ImportacionManualListarDetalleResponse[];
  itemsPagination: ImportacionManualListarDetalleResponse[];

  constructor(
    media: MediaMatcher,
    public dialogRef: MatDialogRef<DetalleImportacionManualComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mantenimientoService: MantenimientoService,
    private toastr: ToastrService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit() {
    this.listImportacionManualListarDetalleResponse =
      new Array<ImportacionManualListarDetalleResponse>();
    this.itemsPagination = [];
    this.titulo = 'Detalle de Mediciones';
    this.cargarDatos(this.data);
    this.getManualImportacionDetalle(this.page);
  }

  cargarDatos(data: any) {
    this.id = data.importacionManual.id;
    this.sector = data.importacionManual.sector;
    this.datalogger = data.importacionManual.datalogger;
    this.maximo = data.importacionManual.max;
    this.area = data.importacionManual.area;
    this.minimo = data.importacionManual.min;
    this.promedio = data.importacionManual.prom;
    this.fecha =  data.importacionManual.fecha;
    this.estado =  data.importacionManual.estado;
  }

  getManualImportacionDetalle(pagina: number) {
    this.blockUI.start();
    const page = {
      pagina: pagina,
      page_size: 10,
    };
    let fecha = this.data.importacionManual.fecha.split('/');
    if(this.id==null){
      this.blockUI.stop();
      return ;
    }
    this.mantenimientoService
      .listImportacionManualDetalle(
        new Date(
          parseInt(fecha[2]),
          parseInt(fecha[1]) - 1,
          parseInt(fecha[0])
        ),
        this.data.importacionManual.datalogger,
        page,
        this.data.importacionManual.codeParametro,
        this.id
      )
      .subscribe(
        (response) => {
          if (response.estado == 'ERROR') {
            this.blockUI.stop();
          } else {
            if (response.paginacion.totalRegistros > 0) {
              this.listImportacionManualListarDetalleResponse =
                response.resultado;
              let foundVC =
                this.listImportacionManualListarDetalleResponse.find(
                  (obj) => obj.idParametro == Parametro.VOLUMEN_CAUDAL
                );

              let foundVISRCISR =
                this.listImportacionManualListarDetalleResponse.find(
                  (obj) =>
                    obj.idParametro ==
                    Parametro.VOLING_VOLSALID_VOLRPS_CAUDALING_CAUDALSALIDA_CAUDALRPS
                );
              if (foundVC != null) {
                this.mostrarVC = true;
                this.widthHora = '10%';
                this.titleParametro1 = 'VOLÚMEN';
                this.titleParametro2 = 'CAUDAL';
              }
              if (foundVISRCISR != null) {
                this.mostrarVISRCISR = true;
                this.widthHora = '10%';
                this.widthMedicion = '15%';
              }
              this.getManualImportacionDetallePaginada();
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
          this.listImportacionManualListarDetalleResponse =
            new Array<ImportacionManualListarDetalleResponse>();
          this.itemsPagination = [];
          this.total = 0;
        }
      );
  }

  getManualImportacionDetallePaginada(): void {
    this.itemsPagination = [];
    let j = 0;
    if (this.listImportacionManualListarDetalleResponse.length > 0) {
      if (
        this.listImportacionManualListarDetalleResponse.length <
        this.page * this.limit
      ) {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.listImportacionManualListarDetalleResponse.length;
          i++
        ) {
          this.itemsPagination[j] =
            this.listImportacionManualListarDetalleResponse[i];
          j++;
        }
      } else {
        for (
          let i = (this.page - 1) * this.limit;
          i < this.page * this.limit;
          i++
        ) {
          this.itemsPagination[j] =
            this.listImportacionManualListarDetalleResponse[i];
          j++;
        }
      }
    } else {
      this.itemsPagination = this.listImportacionManualListarDetalleResponse;
    }
  }

  goToPage(n: number): void {
    this.page = n;
    this.getManualImportacionDetallePaginada();
  }

  onNext(): void {
    this.page++;
    this.getManualImportacionDetallePaginada();
  }

  onPrev(): void {
    this.page--;
    this.getManualImportacionDetallePaginada();
  }
}