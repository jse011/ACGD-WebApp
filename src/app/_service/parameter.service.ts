import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Response } from '../models';
import { ValoresConsultarRequest } from '../models/request/ValoresConsultarRequest';

@Injectable()
export class ParameterService {
  constructor(private http: HttpClient, private API: ApiService) {}

  listParameterCombo(): Observable<Response> {
    return this.http.get<Response>(this.API.listParameterCombo);
  }

  listParameters(valoresConsultarReq:ValoresConsultarRequest, data: any): Observable<Response> {
    let params: HttpParams = new HttpParams()
    .set('pagina', data.pagina.toString())
    .set('registros', data.page_size.toString());
    if(valoresConsultarReq.nNumreg != null)
      params = params.set('nNumreg',valoresConsultarReq.nNumreg.toString());
    return this.http.get<Response>(this.API.listParameters, {params});
  }

  addParameter(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.addParameter, data);
  }

  editParameter(data: any): Observable<Response> {
    return this.http.put<Response>(this.API.editParameter, data);
  }

  deleteParameter(data: any): Observable<Response> {
    return this.http.delete<Response>(`${this.API.deleteParameter}/${data.nCodValor}/${data.nNumReg}`);
  }
}