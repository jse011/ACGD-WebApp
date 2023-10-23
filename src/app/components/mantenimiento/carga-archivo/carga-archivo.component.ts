import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-carga-archivo',
  templateUrl: './carga-archivo.component.html',
  styleUrls: ['./carga-archivo.component.scss'],
})
export class CargaArchivoComponent implements OnInit {
  form: FormGroup;
  progressInfo = [];
  fileList: File[] = [];
  listOfFiles: any[] = [];
  fileName = '';
  boton_seleccionar_modal = '';
  boton_subir_modal = '';
  boton_eliminar_modal = '';
  deshabilitarBtnCarga: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CargaArchivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
  ) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    //this.fileList = this.data.fileListPadre;
    this.boton_eliminar_modal = this.data.boton_eliminar_modal;
    this.boton_seleccionar_modal = this.data.boton_seleccionar_modal;
    this.boton_subir_modal = this.data.boton_subir_modal;
    this.deshabilitarBtnCarga = this.data.disabled_boton_seleccionar_modal;
    /*for (var i = 0; i < this.fileList.length; i++) {
      this.listOfFiles[i] = this.formatSizeUnits(this.fileList[i].size);
    }*/
  }

  selectFiles(event) {
    let cantidad = this.fileList.length + event.target.files.length;
    if (cantidad < 2) {
      let archivosExcel = true;
      for (var i = 0; i < event.target.files.length; i++) {
        if (
          event.target.files[i].type !=
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
          archivosExcel = false;
      }
      if (archivosExcel) {
        this.deshabilitarBtnCarga = true;
        let tamanoPdf = this.checkTamanopdf(event); //260422
        this.setTempFiles(event, tamanoPdf); //260422
      } else {
        this.toastr.warning('Solo se permiten archivos EXCEL', 'Error', {
          closeButton: true,
        });
        return;
      }
    } else {
      this.toastr.warning('Solo puede adjuntar un máximo 1 archivo', 'Error', {
        closeButton: true,
      });
      return;
    }
  }

  checkTamanopdf(event) {
    let tamanoPdf = true;
    for (var i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].size > 10485760) {
        tamanoPdf = false;
      }
    }
    return tamanoPdf;
  }

  setTempFiles(event, tamanoPdf: Boolean) {
    if (tamanoPdf) {
      var archivostemporal = [];
      this.progressInfo = [];
      event.target.files.length == 1
        ? (this.fileName = event.target.files[0].name)
        : (this.fileName = event.target.files.length + ' archivos');
      archivostemporal = event.target.files;
      if (this.fileList.length == 0) {
        for (var i = 0; i < archivostemporal.length; i++) {
          this.listOfFiles[i] = this.formatSizeUnits(archivostemporal[i].size);
        }
        this.fileList = archivostemporal;
      } else {
        let myFileList;
        let list = new DataTransfer();

        for (var i = 0; i < this.fileList.length; i++) {
          list.items.add(this.fileList[i]);
        }
        for (var i = 0; i < event.target.files.length; i++) {
          this.listOfFiles[i + this.fileList.length] = this.formatSizeUnits(
            event.target.files[i].size
          );
          list.items.add(event.target.files[i]);
        }
        myFileList = list.files;
        this.fileList = myFileList;
      }
    } else {
      this.toastr.warning(
        'El tamaño permitido de cada archivo es de 10Mb',
        'Error',
        { closeButton: true }
      );
      return;
    }
  }

  doAction() {
    if (this.fileList.length == 0)
      this.toastr.warning('Selecciona almenos un archivo excel.', 'Error', {
        closeButton: true,
      });
    else this.dialogRef.close({ event: 'Guardar', data: this.fileList });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  formatSizeUnits(bytes) {
    if (bytes >= 1073741824) {
      bytes = (bytes / 1073741824).toFixed(2) + ' GB';
    } else if (bytes >= 1048576) {
      bytes = (bytes / 1048576).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
      bytes = (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes > 1) {
      bytes = bytes + ' bytes';
    } else if (bytes == 1) {
      bytes = bytes + ' byte';
    } else {
      bytes = '0 bytes';
    }
    return bytes;
  }

  removeSelectedFile(index) {
    let myFileList;
    let file = this.fileList[index];
    const dt = new DataTransfer();
    for (var i = 0; i < this.fileList.length; i++) {
      if (file !== this.fileList[i]) {
        dt.items.add(this.fileList[i]);
      }
    }
    myFileList = dt.files;
    this.fileList = myFileList;
    this.deshabilitarBtnCarga = false;
  }
}