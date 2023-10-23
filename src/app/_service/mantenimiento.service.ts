import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Response } from '../models';
import { ListarImporacionManualRequest } from '../models/request/listarImporacionManualRequest';

@Injectable()
export class MantenimientoService {
  constructor(private http: HttpClient, private API: ApiService) {}

  importacionManual(data: any): Observable<Response> {
    let params: HttpParams = new HttpParams();
    params = params.set(
      'parametro',
      data.codeParametro != null ? data.codeParametro.toString() : ''
    );
    params = params.set(
      'dataLogger',
      data.codeDatalogger != null ? data.codeDatalogger.toString() : ''
    );
    params = params.set(
      'fecha',
      data.fecha != null ? data.fecha.toString() : ''
    );

    const formData = new FormData();
    for (const file of data.document) {
      formData.append('file', file, file.name);
    }
    return this.http.put<Response>(this.API.importacionManual, formData, {
      params,
    });
  }

  listImportacionManual(
    listarImporacionManualRequest: ListarImporacionManualRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (listarImporacionManualRequest.fec != null)
      params = params.set('fec', listarImporacionManualRequest.fec.toString());
    if (listarImporacionManualRequest.codeParametro != null)
      params = params.set(
        'codeParametro',
        listarImporacionManualRequest.codeParametro.toString()
      );
    if (listarImporacionManualRequest.codeDatalogger != null)
      params = params.set(
        'codeDatalogger',
        listarImporacionManualRequest.codeDatalogger.toString()
      );
    return this.http.get<Response>(this.API.listImportacionManual, {
      params,
    });
  }

  listImportacionManualDetalle(
    fecha: Date,
    datalogger: string,
    data: any,
    idParametro: string,
    idDataloggerCabercera: string
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString())
      .set('fecha', fecha.toString())
      .set('dataloggers', datalogger.toString())
      .set('idParametro', idParametro.toString())
      .set('idDataloggerCabercera', idDataloggerCabercera.toString());
    return this.http.get<Response>(this.API.verDetalleImportacionManual, {
      params,
    });
  }

  cancelarImportacion(lstId: any): Observable<Response> {
    return this.http.post<Response>(this.API.cancelarImportacion, lstId);
  }
}