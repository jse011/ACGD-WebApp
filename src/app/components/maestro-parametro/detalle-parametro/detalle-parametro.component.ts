import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParameterService } from '../../../services';
import { OpenDialogDirective } from '../../../directives';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ValoresComboEstado } from 'src/app/models/valoresComboEstado';

@Component({
  selector: 'app-detalle-parametro',
  templateUrl: './detalle-parametro.component.html',
  styleUrls: ['./detalle-parametro.component.scss'],
})
export class DetalleParametroComponent implements OnInit {
  @ViewChild(OpenDialogDirective) openDialog;
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;
  habilitar: boolean;
  mostrar: boolean;
  error = '';
  titulo: string;
  listParametroCombo: ValoresComboEstado[];

  constructor(
    public dialogRef: MatDialogRef<DetalleParametroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private parameterService: ParameterService
  ) {
    this.form = new FormGroup({
      nombre1: new FormControl('', [Validators.required]),
      nombre2: new FormControl(''),
      nombre3: new FormControl(''),
      nombre4: new FormControl(''),
      nombre5: new FormControl(''),
      nombre6: new FormControl(''),
      nIndicador: new FormControl(''),
    });
  }

  ngOnInit() {
    this.listParametroCombo = new Array<ValoresComboEstado>();
    this.listParametroCombo.push({ nCodValor: 1, vDescripcion: 'ACTIVO' });
    this.listParametroCombo.push({ nCodValor: 2, vDescripcion: 'BAJA' });
    switch (this.data.tipo) {
      case 'register': {
        this.titulo = 'Registrar Parámetro';
        this.habilitar = true;
        this.mostrar = false;
        break;
      }
      case 'edit': {
        this.titulo = 'Editar Parámetro';
        this.form.get('nombre1').patchValue(this.data.parameter.nombre1);
        this.form.get('nombre2').patchValue(this.data.parameter.nombre2);
        this.form.get('nombre3').patchValue(this.data.parameter.nombre3);
        this.form.get('nombre4').patchValue(this.data.parameter.nombre4);
        this.form.get('nombre5').patchValue(this.data.parameter.nombre5);
        this.form.get('nombre6').patchValue(this.data.parameter.nombre6);
        this.form.get('nIndicador').patchValue(this.data.parameter.nIndicador);
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
    let vDescripcion = [];
    if (this.form.value.nombre1 != '')
      vDescripcion.push(this.form.value.nombre1);
    if (this.form.value.nombre2 != '' && this.form.value.nombre2 != null)
      vDescripcion.push(this.form.value.nombre2);
    if (this.form.value.nombre3 != '' && this.form.value.nombre3 != null)
      vDescripcion.push(this.form.value.nombre3);
    if (this.form.value.nombre4 != '' && this.form.value.nombre4 != null)
      vDescripcion.push(this.form.value.nombre4);
    if (this.form.value.nombre5 != '' && this.form.value.nombre5 != null)
      vDescripcion.push(this.form.value.nombre5);
    if (this.form.value.nombre6 != '' && this.form.value.nombre6 != null)
      vDescripcion.push(this.form.value.nombre6);
    switch (this.data.tipo) {
      case 'register': {
        const body = {
          vDescripcion: vDescripcion.join(','),
        };
        console.log('body', body);
        this.parameterService.addParameter(body).subscribe(
          (response) => {
            this.dialogRef.close(response);
            if (response.estado == 'OK') {
              this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: 'addOK',
                mensaje: 'Registrado',
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
            this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: 'error',
              error:
                'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.',
            });
            this.dialogRef.close(error);
          }
        );
        break;
      }
      case 'edit': {
        const body = {
          nCodValor: this.data.parameter.nCodValor,
          nNumReg: this.data.parameter.nNumReg,
          vDescripcion: vDescripcion.join(','),
        };
        console.log('body', body);
        this.parameterService.editParameter(body).subscribe(
          (response) => {
            this.dialogRef.close(response);
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
}