import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OpenDialogDirective } from '../../../directives';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComboResponse } from 'src/app/models/response/comboResponse';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/auth/session.service';

@Component({
  selector: 'app-detalle-datalogger',
  templateUrl: './detalle-datalogger.component.html',
  styleUrls: ['./detalle-datalogger.component.scss'],
})
export class DetalleDataloggerComponent implements OnInit {
  @ViewChild(OpenDialogDirective) openDialog;
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;
  habilitar: boolean;
  mostrar: boolean;
  error = '';
  titulo: string;
  listAreaCombo: ComboResponse[];
  listZonaCombo: ComboResponse[];
  listDistritoCombo: ComboResponse[];
  listSectorCombo: ComboResponse[];
  listIndicadorCombo: ComboResponse[];
  listEstadoCombo: ComboResponse[];
  

  constructor(
    public session: SessionService,
    public dialogRef: MatDialogRef<DetalleDataloggerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataloggerService: DataloggerService,
    private toastr: ToastrService
  ) {    
    this.form = new FormGroup({
      nCodarea: new FormControl('', [Validators.required]),
      nSector: new FormControl('', [Validators.required]),
      nCoddat: new FormControl('', [
        Validators.required,Validators.pattern('[0-9]+'),
      ]),
      vDesdat: new FormControl(''), //, [Validators.pattern('^[a-zA-Z0-9]+$')]
      /*nSector: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]+'),
      ]),*/
      nZona: new FormControl('', [Validators.required]),
      nCodseg: new FormControl('', [Validators.required,Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]),
      vDir: new FormControl(''),
      dFecins: new FormControl(''),
      vDistrito: new FormControl('', [Validators.required]),
      nMarca: new FormControl('', [Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]),
      nSerieInst: new FormControl(''),
      nModelo: new FormControl('', [Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]),
      nSerieCapt: new FormControl(''),
      vCamara: new FormControl(''),
      nroEquipo: new FormControl(''),
      vCambioPila: new FormControl(''),
      indicador: new FormControl(''),
      nEstado: new FormControl(''),
      nNis: new FormControl('', [Validators.pattern('[0-9]+'), Validators.minLength(7), Validators.maxLength(7)]),
    });
  }

  ngOnInit() {
    this.listAreaCombo = new Array<ComboResponse>();
    this.listZonaCombo = new Array<ComboResponse>();
    this.listDistritoCombo = new Array<ComboResponse>();
    this.listIndicadorCombo = new Array<ComboResponse>();
    this.listEstadoCombo = new Array<ComboResponse>();
    this.listSectorCombo = new Array<ComboResponse>();
    this.loadComboArea();
    this.loadComboZona();
    this.loadComboSector();
    this.loadComboDistrito();
    this.loadComboIndicador();
    this.loadComboEstado();
    
    switch (this.data.tipo) {
      case 'register': {
        this.titulo = 'REGISTRAR DATALOGGER';
        this.habilitar = true;
        this.mostrar = false;
        
       if( this.session.User.codPerfil!=1){ //PEFIL 1 ADMINISTRADOR
        this.form.get('nCodarea').patchValue(this.session.User.codArea);
       }
        
        break;
      }
      case 'edit': {
        this.titulo = 'Editar Datalogger';
        this.form.get('nCodarea').patchValue(this.data.datalogger.areaBuscarResponse.nCodarea);
        this.form.get('nCoddat').patchValue(this.data.datalogger.nCoddat);
        this.form.get('nSector').patchValue(this.data.datalogger.sectorBuscarResponse.nSector);
        this.form.get('vDesdat').patchValue(this.data.datalogger.vDesdat);
        this.form
          .get('nZona')
          .patchValue(this.data.datalogger.zonaBuscarResponse.nZona);
        this.form.get('nCodseg').patchValue(this.data.datalogger.nCodseg);
        this.form.get('vDir').patchValue(this.data.datalogger.vDir);
        if (this.data.datalogger.dFecins != null){
          let fIns = this.data.datalogger.dFecins.split('/');
          this.form
            .get('dFecins')
            .patchValue(
              new Date(
                parseInt(fIns[2]),
                parseInt(fIns[1]) - 1,
                parseInt(fIns[0])
              )
            );
        }
               
        this.form
          .get('vDistrito')
          .patchValue(this.data.datalogger.distritoBuscarResponse.vDistrito);
        this.form.get('nMarca').patchValue(this.data.datalogger.nMarca);
        this.form.get('nSerieInst').patchValue(this.data.datalogger.nSerieInst);
        this.form.get('nModelo').patchValue(this.data.datalogger.nModelo);
        this.form.get('nSerieCapt').patchValue(this.data.datalogger.nSerieCapt);
        this.form.get('vCamara').patchValue(this.data.datalogger.vCamara);
        this.form.get('nroEquipo').patchValue(this.data.datalogger.nroEquipo);
        this.form.get('nNis').patchValue(this.data.datalogger.nNis);
        this.form
          .get('vCambioPila')
          .patchValue(this.data.datalogger.vCambioPila);
        this.form
          .get('indicador')
          .patchValue(this.data.datalogger.indicadorBuscarResponse.indicador);
        this.form
          .get('nEstado')
          .patchValue(this.data.datalogger.estadoBuscarResponse.nEstado);
        this.habilitar = true;
        this.mostrar = false;
        break;
      }
    }
  }

  onSubmit() {
    
    if (this.form.invalid) {
      this.error = 'Por favor, ingrese correctamente todos los datos.';
      return;
    }
    
    this.blockUI.start();
    this.error = '';
    switch (this.data.tipo) {
      case 'register': {
        const datalogger = this.data.datalogger.find(
          (obj) => obj.nCoddat == this.form.value.nCoddat
        );
        if (datalogger != null) {
          this.blockUI.stop();
          this.toastr.warning('El Datalogger ingresado ya existe.', 'Validación', {
            closeButton: true,
          });
        } else {
          const body = {
            nCodarea: this.form.value.nCodarea,
            //codeSector: this.form.value.codeSector,
            nCoddat: this.form.value.nCoddat,
            nSector: this.form.value.nSector,
            vDesdat: this.form.value.vDesdat,
            nZona: this.form.value.nZona,
            nCodseg: this.form.value.nCodseg,
            vDir: this.form.value.vDir,
            dFecins: this.form.value.dFecins,
            vDistrito: this.form.value.vDistrito,
            nMarca: this.form.value.nMarca,
            nSerieInst: this.form.value.nSerieInst,
            nModelo: this.form.value.nModelo,
            nSerieCapt: this.form.value.nSerieCapt,
            vCamara: this.form.value.vCamara,
            nroEquipo: this.form.value.nroEquipo,
            vCambioPila: this.form.value.vCambioPila,
            nNis: this.form.value.nNis,
          };
          this.dataloggerService.addDatalogger(body).subscribe(
            (response) => {
              this.dialogRef.close(response.estado);
              if (response.estado == 'OK') {
                this.openDialog.onClick({
                  dialogType: 'content',
                  dialogSRC: 'addOK',
                  mensaje: 'Registrado',
                });
              } else {
                this.openDialog.onClick({
                  dialogType: 'content',
                  dialogSRC: 'error',
                  error: 'Error',
                });
              }
            },
            (error) => {
              this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: 'error',
                error:
                  'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.',
              });
              this.dialogRef.close(error);
            }
          );
        }
        break;
      }
      case 'edit': {
        const body = {
          id: this.data.datalogger.id,
          nCodarea: this.form.value.nCodarea,
          nCoddat: this.form.value.nCoddat,
          nSector: this.form.value.nSector,          
          vDesdat: this.form.value.vDesdat,
          nZona: this.form.value.nZona,
          nCodseg: this.form.value.nCodseg,
          vDir: this.form.value.vDir,
          dFecins: this.form.value.dFecins,
          vDistrito: this.form.value.vDistrito,
          nMarca: this.form.value.nMarca,
          nSerieInst: this.form.value.nSerieInst,
          nModelo: this.form.value.nModelo,
          nSerieCapt: this.form.value.nSerieCapt,
          vCamara: this.form.value.vCamara,
          nroEquipo: this.form.value.nroEquipo,
          vCambioPila: this.form.value.vCambioPila,
          indicador: this.form.value.indicador,
          nEstado: this.form.value.nEstado,
          nNis: this.form.value.nNis,
        };
        this.dataloggerService.editDatalogger(body).subscribe(
          (response) => {
            this.dialogRef.close(response.estado);
            if (response.estado == 'OK') {
              this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: 'updateOK',
                mensaje: 'Actualizado',
                //mensaje: response.cRESP_SP
              });
            } else {
              this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: 'error',
                error: 'Error',
                //error: response.cRESP_SP
              });
            }
          },
          (error) => {
            this.dialogRef.close(error);
            this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: 'error',
              error:
                'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.',
            });
          }
        );
        break;
      }
    }
  }

  loadComboArea() {
    this.dataloggerService.loadComboArea().subscribe((response) => {
      this.listAreaCombo = response.resultado;
      // this.listAreaCombo.unshift({
      //   nCodigo: -1,
      //   vDescripcion: '--Seleccione--',
      // });
    });
  }

  loadComboZona() {
    this.dataloggerService.loadComboZona().subscribe((response) => {
      this.listZonaCombo = response.resultado;
      // this.listZonaCombo.unshift({
      //   nCodigo: -1,
      //   vDescripcion: '--Seleccione--',
      // });
    });
  }

  loadComboDistrito() {
    this.dataloggerService.loadComboDistrito().subscribe((response) => {
      this.listDistritoCombo = response.resultado;
      // this.listDistritoCombo.unshift({
      //   nCodigo: -1,
      //   vDescripcion: '--Seleccione--',
      // });
    });
  }

  loadComboIndicador() {
    this.dataloggerService.loadComboIndicador().subscribe((response) => {
      this.listIndicadorCombo = response.resultado;
      // this.listIndicadorCombo.unshift({
      //   nCodigo: -1,
      //   vDescripcion: '--Seleccione--',
      // });
    });
  }

  loadComboEstado() {
    this.dataloggerService.loadComboEstado().subscribe((response) => {
      this.listEstadoCombo = response.resultado;
      // this.listEstadoCombo.unshift({
      //   nCodigo: -1,
      //   vDescripcion: '--Seleccione--',
      // });
    });
  }

  changeTextToUppercase(field) {
    const obj = {};
    obj[field] = this.form.controls[field].value.toUpperCase();
    this.form.patchValue(obj);
  }

  loadComboSector() {
    
    this.dataloggerService.loadComboSector().subscribe((response) => {
      
      this.listSectorCombo = response.resultado;
      /*this.listSectorCombo.unshift({
        nCodigo: -1,
        vDescripcion: 'TODOS',
      });*/
    });
  }

}