import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { OpenDialogDirective } from '../../../directives';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { MantenimientoService } from 'src/app/_service/mantenimiento.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidacionDatosService } from 'src/app/_service/validacion-datos.service';

@Component({
  selector: 'app-observar-validacion-datos',
  templateUrl: './observar-validacion-datos.component.html',
  styleUrls: ['./observar-validacion-datos.component.scss'],
})
export class ObservarValidacionDatosComponent implements OnInit {
  @ViewChild(OpenDialogDirective) openDialog;
  @BlockUI() blockUI: NgBlockUI;
  mobileQuery: MediaQueryList;
  titulo: string;
  id: string;
  form: FormGroup;
  error = '';

  constructor(
    media: MediaMatcher,
    public dialogRef: MatDialogRef<ObservarValidacionDatosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private validacionDatosService: ValidacionDatosService,
    private toastr: ToastrService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.form = new FormGroup({
      observacion: new FormControl('', [
        Validators.required,
        Validators.pattern(RegExp(/^\S+(?: \S+)*$/)),
      ]),
    });
  }

  ngOnInit() {
    this.titulo = 'OBSERVAR';
    this.cargarDatos(this.data);
  }

  cargarDatos(data: any) {
    this.form
      .get('observacion')
      .patchValue(this.data.validacionDatos.observacion.trim());
  }

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Por favor, ingrese correctamente la observación.';
      return;
    }
    this.blockUI.start();
    this.error = '';
    const body = {
      id: this.data.validacionDatos.id,
      observacion: this.form.value.observacion,
    };
    this.validacionDatosService.observarValidacionDatos(body).subscribe(
      (response) => {
        this.dialogRef.close(response);
        if (response.estado == 'OK') {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'addOK',
            mensaje: 'Observado',
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
}