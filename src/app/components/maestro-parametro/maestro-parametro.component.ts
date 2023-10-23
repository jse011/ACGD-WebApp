import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ParameterService } from 'src/app/_service/parameter.service';
import { Response, ValoresComboResponse } from 'src/app/models';
import { ValoresBuscarResponse } from 'src/app/models/response/valoresBuscarResponse';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DetalleParametroComponent } from './detalle-parametro/detalle-parametro.component';
import { MatDialog } from '@angular/material/dialog';
import { ValoresCrearRequest } from 'src/app/models/request/valoresCrearRequest';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-maestro-parametro',
  templateUrl: './maestro-parametro.component.html',
  styleUrls: ['./maestro-parametro.component.scss'],
})
export class MaestroParametroComponent implements OnInit {
  parametrosCombo: ValoresComboResponse[];
  @BlockUI() blockUI: NgBlockUI;
  mobileQuery: MediaQueryList;
  selectedRow: number = -1;
  limit = 10;
  page = 1;
  total = 0;
  listValoresBuscarResponse: ValoresBuscarResponse[];
  itemsPagination: ValoresBuscarResponse[];
  parametroActualizar: ValoresBuscarResponse;
  codeParametro: any;
  width = '35%';
  height = null;
  parametroCrear: ValoresCrearRequest;

  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private parameterService: ParameterService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.width = '80%';
      this.height = '70%';
    }
    this.loadParametroCombo();
    this.parametroActualizar = new ValoresBuscarResponse();
    this.listValoresBuscarResponse = new Array<ValoresBuscarResponse>();
    this.itemsPagination = [];
    this.getParametros(this.page);
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

  add() {
    const dialogRef = this.dialog.open(DetalleParametroComponent, {
      height: this.height,
      width: this.width,
      data: { parameter: this.parametroCrear, tipo: 'register' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loadParametroCombo();
        this.getParametros(this.page);
      }
    });
  }

  edit() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado parametro', 'Error', {
        closeButton: true,
      });
    } else {
      const dialogRef = this.dialog.open(DetalleParametroComponent, {
        height: this.height,
        width: this.width,
        data: { parameter: this.parametroActualizar, tipo: 'edit' },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          this.loadParametroCombo();
          this.getParametros(this.page);
        }
      });
    }
  }

  delete() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado parametro', 'Error', {
        closeButton: true,
      });
    } else {
      this.parameterService.deleteParameter(this.parametroActualizar).subscribe(
        (response: Response) => {
          if (response.estado == 'OK') {
            this.loadParametroCombo();
            this.getParametros(this.page);
            this.toastr.info('Registro eliminado', 'Acción completada!', {
              closeButton: true,
            });
          }
        },
        (error) => console.log('')
      );
    }
  }

  selectRow(index, item: ValoresBuscarResponse) {
    this.selectedRow = index;
    this.parametroActualizar = item;
  }

  goToPage(n: number): void {
    this.page = n;
    this.getParametroPaginada();
  }

  onNext(): void {
    this.page++;
    this.getParametroPaginada();
  }

  onPrev(): void {
    this.page--;
    this.getParametroPaginada();
  }

  getParametros(pagina: number) {
    this.blockUI.start();
    const valoresConsultarReq = {
      nNumreg: this.codeParametro,
    };
    const page = {
      pagina: pagina,
      page_size: 10,
    };
    this.parameterService.listParameters(valoresConsultarReq, page).subscribe(
      (response) => {
        if (response.estado == 'ERROR') {
          this.blockUI.stop();
          //this.router.navigate([''])
        } else {
          if (response.paginacion.totalRegistros > 0) {
            this.listValoresBuscarResponse = response.resultado;
            this.getParametroPaginada();
            this.total = response.paginacion.totalRegistros;
          } else {
            this.toastr.warning('No se encontraron parametros', 'Error', {
              closeButton: true,
            });
          }
          this.blockUI.stop();
        }
      },
      (error) => {
        this.blockUI.stop();
      }
    );
  }

  buscarParametros() {
    this.page = 1;
    this.getParametros(this.page);
  }

  getParametroPaginada(): void {
    this.itemsPagination = [];
    let j = 0;
    if(this.listValoresBuscarResponse.length > 0){
      if(this.listValoresBuscarResponse.length < this.page*this.limit ){
        for(let i = (this.page - 1)*(this.limit); i < this.listValoresBuscarResponse.length; i++) {
          this.itemsPagination[j] = this.listValoresBuscarResponse[i];
          j++;  
        }
      }else{
        for(let i = (this.page - 1)*(this.limit); i < (this.page)*this.limit; i++) {
          this.itemsPagination[j] = this.listValoresBuscarResponse[i];
          j++;  
        }
      }
    }else{
      this.itemsPagination = this.listValoresBuscarResponse;
    }
  }
}