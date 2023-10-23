import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/auth/session.service';
import { OpenDialogDirective } from 'src/app/directives';
import { Response } from 'src/app/models';
import { Mensaje } from 'src/app/models/constantes/mensajes-datalogger';
import { DataloggersCrearRequest } from 'src/app/models/request/dataloggersCrearRequest';
import { DataloggerComboResponse } from 'src/app/models/response/dataloggerComboResponse';
import { DataloggersBuscarResponse } from 'src/app/models/response/dataloggersBuscarResponse';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { ValidacionDatosService } from 'src/app/_service/validacion-datos.service';
import { DetalleDataloggerComponent } from './detalle-datalogger/detalle-datalogger.component';
import { MoverDataloggerComponent } from './mover-datalogger/mover-datalogger.component';
import { PlanoGistComponent } from './plano-gis/plano-gis.component';

@Component({
  selector: 'app-maestro-dataloggers',
  templateUrl: './maestro-dataloggers.component.html',
  styleUrls: ['./maestro-dataloggers.component.scss'],
})
export class MaestroDataloggersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  mobileQuery: MediaQueryList;
  width = '45%';
  height = null;
  @ViewChild(OpenDialogDirective) openDialog;
  nCodequipo: number;
  dataloggersCombo: DataloggerComboResponse[];
  listDataloggersBuscarResponse: DataloggersBuscarResponse[];
  itemsPagination: DataloggersBuscarResponse[];
  dataloggerActualizar: DataloggersBuscarResponse;
  dataloggerCrear: DataloggersCrearRequest;
  codeDatalogger: any;

  selectedRow: number = -1;

  page = 1;
  total = 0;
  limit = 10;
  isAdmin=false;

  private _mobileQueryListener: () => void;
  constructor(
    private validacionDatosService: ValidacionDatosService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private session: SessionService,
    public dialog: MatDialog,
    private dataloggerService: DataloggerService,
    private toastr: ToastrService
  ) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.isAdmin = session.User.codPerfil==1 ? true : false;
  }

  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.width = '100%';
      this.height = '100%';
    }
    this.dataloggerActualizar = new DataloggersBuscarResponse();
    this.listDataloggersBuscarResponse = new Array<DataloggersBuscarResponse>();
    this.itemsPagination = [];
    this.getDataloggers(this.page);
  }

  buscarDataloggers() {
    this.page = 1;
    this.getDataloggers(this.page);
  }

  getDataloggers(pagina: number) {
    
    this.blockUI.start();
    if (this.session.User.codPerfil != 1) { //PEFIL 1 ADMINISTRADOR
      this.nCodequipo = this.session.User.codArea
    } else {
      this.nCodequipo = null;
    }
    const dataloggersConsultarRequest = {
      nCoddat: this.codeDatalogger,
      nCodequipo: this.nCodequipo
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

  add() {
    const dialogRef = this.dialog.open(DetalleDataloggerComponent, {
      height: this.height,
      width: this.width,
      data: { datalogger: this.listDataloggersBuscarResponse, tipo: 'register' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.blockUI.stop();
      if (result == "OK") {
        this.getDataloggers(this.page);
      }
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

  edit() {

    
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado Datalogger', 'Error', {
        closeButton: true,
      });
    } else {
      const dialogRef = this.dialog.open(DetalleDataloggerComponent, {
        height: this.height,
        width: this.width,
        data: { datalogger: this.dataloggerActualizar, tipo: 'edit' },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.blockUI.stop();
        if (result == "OK") {
          this.getDataloggers(this.page);
        }
      });
    }
  }

  mover() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado Datalogger', 'Error', {
        closeButton: true,
      });
    } else {
      const dialogRef = this.dialog.open(MoverDataloggerComponent, {
        height: this.height,
        width: this.width,
        data: { datalogger: this.dataloggerActualizar, tipo: 'mover' },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.blockUI.stop();
        if (result == "OK") {
          this.getDataloggers(this.page);
        }
      });
    }
    this.page = 1;
    this.getDataloggers(this.page);
  }



  gis() {
    
    if (this.selectedRow == -1) {
      this.toastr.warning('Debe seleccionar un registro', 'Información', {
        closeButton: true,
      });
    } else {
      this.dataloggerService.planoGisDatalogger(this.dataloggerActualizar).subscribe(
        (response: Response) => {
          
          this.blockUI.stop();
          if (response.estado == 'OK') {
            response.resultado
            if (response.resultado[0].linkGis != null) {
              const dialogRef = this.dialog.open(PlanoGistComponent, {
                height: '85%',
                width: '500%',
                data: { linkGis: response.resultado[0].linkGis },
              });
              dialogRef.afterClosed().subscribe((result) => {
                this.blockUI.stop();
                if (result == "OK") {
                  this.getDataloggers(this.page);
                }
              });
            }
          }
        },
        (error) => console.log('')
      );
    }
  }



  delete() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado Datalogger', 'Error', {
        closeButton: true,
      });
    } else {


      let data = {coddat:this.dataloggerActualizar.nCoddat};
    this.validacionDatosService.checkvalid(data).subscribe(
      (response) => {
        if (response.estado == 'OK') {
          if(response.resultado==0){
            this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: 'confirm',
              onEvent: (data: any) => {
                if (data === '1') {
                  this.blockUI.start();
                  this.dataloggerService
                    .deleteDatalogger(this.dataloggerActualizar)
                    .subscribe(
                      (response: Response) => {
                        this.blockUI.stop();
                        if (response.estado == 'OK') {
                          this.getDataloggers(this.page);
                          this.toastr.info(
                            'Registro eliminado',
                            'Acción completada!',
                            {
                              closeButton: true,
                            }
                          );
                        }
                      },
                      (error) => console.log('')
                    );
                }
              },
            });
          }
          else{
            this.blockUI.stop();
            this.toastr.info(
              'El Datalogger no se puede eliminar',
              'No se puede Eliminar un Datalogger por tener información en estado VALIDADO.',
              {
                closeButton: true,
              }
            );
          }
          
        } else {
          this.blockUI.stop();
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'error',
            error:
              'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.',
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
  }

  checkValid(coddat){
    let data = {coddat:coddat};
    this.validacionDatosService.checkvalid(data).subscribe(
      (response) => {
        if (response.estado == 'OK') {
          
        } else {
          
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

  selectRow(index, item: DataloggersBuscarResponse) {
    
    this.selectedRow = index;
    this.dataloggerActualizar = item;
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
}