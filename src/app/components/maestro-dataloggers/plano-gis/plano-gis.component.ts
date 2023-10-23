import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OpenDialogDirective } from '../../../directives';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComboResponse } from 'src/app/models/response/comboResponse';
import { DataloggerService } from 'src/app/_service/datalogger.service';
import { ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-plano-gis',
  templateUrl: './plano-gis.component.html',
  styleUrls: ['./plano-gis.component.scss'],
})
export class PlanoGistComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  @ViewChild(OpenDialogDirective) openDialog;
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;  
  error = '';
  titulo: string;
  listZonaCombo: ComboResponse[];
  listSectorCombo: ComboResponse[];
  url: string;
  urls: SafeResourceUrl;
  constructor(private domSanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PlanoGistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataloggerService: DataloggerService
  ) {
  }

  ngOnInit(): void {
    this.urls = this.domSanitizer.bypassSecurityTrustResourceUrl(this.data.linkGis);
    this.setIframeReady(this.iframe);
    console.log(this.iframe);
  }
  private setIframeReady(iframe: ElementRef): void {
    const win: Window = iframe.nativeElement.contentWindow;
    this.iframe.nativeElement.src = this.urls;
  }
}