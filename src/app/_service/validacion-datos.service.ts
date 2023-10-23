import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Response } from '../models';
import { ListarValidacionDatosRequest } from '../models/request/listarValidacionDatosRequest';

@Injectable()
export class ValidacionDatosService {
  constructor(private http: HttpClient, private API: ApiService) {}

  observarValidacionDatos(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.observarValidacionDatos, data);
  }

  validar(lstId: any): Observable<Response> {
    return this.http.post<Response>(this.API.validar, lstId);
  }

  listValidacionDatos(
    listarValidacionDatosRequest: ListarValidacionDatosRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (listarValidacionDatosRequest.fec != null)
      params = params.set('fec', listarValidacionDatosRequest.fec.toString());
    if (listarValidacionDatosRequest.codeParametro != null)
      params = params.set(
        'codeParametro',
        listarValidacionDatosRequest.codeParametro.toString()
      );
    if (listarValidacionDatosRequest.codeDatalogger != null)
      params = params.set(
        'codeDatalogger',
        listarValidacionDatosRequest.codeDatalogger.toString()
      );
    return this.http.get<Response>(this.API.listValidacionDatos, {
      params,
    });
  }

  checkvalid(
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('coddat', data.coddat.toString());
    return this.http.get<Response>(this.API.checkvalid, {
      params,
    });
  }

  listValidacionDatosDetalle(
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
    return this.http.get<Response>(this.API.verDetalleValidacionDatos, {
      params,
    });
  }
}