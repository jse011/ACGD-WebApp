import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OpenDialogDirective } from '../../../directives';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComboResponse } from 'src/app/models/response/comboResponse';
import { DataloggerService } from 'src/app/_service/datalogger.service';

@Component({
  selector: 'app-mover-datalogger',
  templateUrl: './mover-datalogger.component.html',
  styleUrls: ['./mover-datalogger.component.scss'],
})
export class MoverDataloggerComponent implements OnInit {
  @ViewChild(OpenDialogDirective) openDialog;
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;
  //habilitar: boolean;
  //mostrar: boolean;
  error = '';
  titulo: string;
  listZonaCombo: ComboResponse[];
  listSectorCombo: ComboResponse[];
  

  constructor(
    public dialogRef: MatDialogRef<MoverDataloggerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataloggerService: DataloggerService
  ) {
    this.form = new FormGroup({
      vCodarea: new FormControl({ value: '', disabled: true }),
      nCoddat: new FormControl({ value: '', disabled: true }),
      vDesdistrito: new FormControl({ value: '', disabled: true }),
      nCodseg: new FormControl({ value: '', disabled: true }),
      nSector: new FormControl('', [Validators.required]),
      nZona: new FormControl('', [Validators.required]),
      vDir: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.listZonaCombo = new Array<ComboResponse>();
    this.listSectorCombo = new Array<ComboResponse>();
    this.loadComboZona();
    this.loadComboSector();
    switch (this.data.tipo) {
      case 'mover': {
        this.titulo = 'MOVER DATALOGGER';
        this.form
          .get('vCodarea')
          .patchValue(this.data.datalogger.areaBuscarResponse.vCodarea);
        this.form.get('nCoddat').patchValue(this.data.datalogger.nCoddat);
        this.form
          .get('vDesdistrito')
          .patchValue(this.data.datalogger.distritoBuscarResponse.vDesdistrito);
        this.form.get('nCodseg').patchValue(this.data.datalogger.nCodseg);
        this.form.get('nSector').patchValue(this.data.datalogger.nSector);
        this.form
          .get('nZona')
          .patchValue(this.data.datalogger.zonaBuscarResponse.nZona);
        this.form.get('vDir').patchValue(this.data.datalogger.vDir);
        //this.habilitar = true;
        //this.mostrar = false;
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
      case 'mover': {
        const body = {
          id: this.data.datalogger.id,
          nSector: this.form.value.nSector,
          nZona: this.form.value.nZona,
          vDir: this.form.value.vDir,
        };
        this.dataloggerService.moverDatalogger(body).subscribe(
          (response) => {
            this.dialogRef.close(response.estado);
            if (response.estado == 'OK') {
              this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: 'moveOK',
                mensaje: 'Movido',
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
    }
  }

  loadComboZona() {
    this.dataloggerService.loadComboZona().subscribe((response) => {
      this.listZonaCombo = response.resultado;
      this.listZonaCombo.unshift({
        nCodigo: -1,
        vDescripcion: '--Seleccione--',
      });
    });
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