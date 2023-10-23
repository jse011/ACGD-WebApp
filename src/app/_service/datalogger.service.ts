import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Response } from '../models';
import { DataloggersConsultarRequest } from '../models/request/dataloggersConsultarRequest';
import { DataloggersBuscarResponse } from '../models/response/dataloggersBuscarResponse';

@Injectable()
export class DataloggerService {
  constructor(private http: HttpClient, private API: ApiService) {}

  listDataloggerCombo(codArea: any): Observable<Response> {    
    let params: HttpParams = new HttpParams().set('codArea', codArea.toString());
    return this.http.get<Response>(this.API.listDataloggerCombo, { params });
  }

  listDataloggers(
    dataloggersConsultarRequest: DataloggersConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (dataloggersConsultarRequest.nCoddat != null && dataloggersConsultarRequest.nCoddat != -1){
      params = params.set(
        'nCoddat',
        dataloggersConsultarRequest.nCoddat.toString()        
      )}else{
        params = params.set('nCoddat','');
      };
    if (dataloggersConsultarRequest.nCodequipo != null && dataloggersConsultarRequest.nCodequipo != -1){
      params = params.set(
        'nCodequipo',
        dataloggersConsultarRequest.nCodequipo.toString()
      )}else {
        params = params.set('nCodequipo','');
      };
    if (dataloggersConsultarRequest.nCoddistrito != null && dataloggersConsultarRequest.nCoddistrito != -1){
      params = params.set(
        'nCoddistrito',
        dataloggersConsultarRequest.nCoddistrito.toString()
      )}else{
        params = params.set('nCoddistrito','');
      };
    return this.http.get<Response>(this.API.listDataloggers, { params });
  }

  listDataloggersPorEquipo(
    dataloggersConsultarRequest: DataloggersConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (dataloggersConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        dataloggersConsultarRequest.nCoddat.toString()
      );
    if (dataloggersConsultarRequest.nCodarea != null)
      params = params.set(
        'nCodarea',
        dataloggersConsultarRequest.nCodarea.toString()
      );
    return this.http.get<Response>(this.API.listDataloggersPorEquipo, {
      params,
    });
  }

  listDataloggersPorGerencia(
    dataloggersConsultarRequest: DataloggersConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (dataloggersConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        dataloggersConsultarRequest.nCoddat.toString()
      );
    if (dataloggersConsultarRequest.nCodarea != null)
      params = params.set(
        'nCodarea',
        dataloggersConsultarRequest.nCodarea.toString()
      );
    return this.http.get<Response>(this.API.listDataloggersPorGerencia, {
      params,
    });
  }

  listDataloggersPorDistrito(data: any): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    return this.http.get<Response>(this.API.listDataloggersPorDistrito, {
      params,
    });
  }

  addDatalogger(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.addDatalogger, data);
  }

  editDatalogger(data: any): Observable<Response> {
    return this.http.put<Response>(this.API.editDatalogger, data);
  }

  deleteDatalogger(data: any): Observable<Response> {
    return this.http.delete<Response>(
      `${this.API.deleteDatalogger}/${data.id}`
    );
  }  

  planoGisDatalogger(dataloggersConsultarRequest: DataloggersBuscarResponse): Observable<Response> {    
    let params: HttpParams = new HttpParams();
    if (dataloggersConsultarRequest.nNis != null)
    params = params.set(
      'nNis',
      dataloggersConsultarRequest.nNis.toString()
    );
    if (dataloggersConsultarRequest.id != null)
      params = params.set(
        'id',
        dataloggersConsultarRequest.id.toString()
      );
    return this.http.get<Response>(this.API.planoGisDatalogger, { params });
  }

  moverDatalogger(data: any): Observable<Response> {
    return this.http.put<Response>(this.API.moverDatalogger, data);
  }

  loadComboArea(): Observable<Response> {
    return this.http.get<Response>(this.API.listDataloggerComboArea);
  }

  loadComboEquipo(): Observable<Response> {
    return this.http.get<Response>(this.API.listDataloggerComboEquipo);
  }

  loadComboGerencia(): Observable<Response> {
    return this.http.get<Response>(this.API.listDataloggerComboGerencia);
  }

  loadComboZona(): Observable<Response> {
    return this.http.get<Response>(this.API.listDataloggerComboZona);
  }
  loadComboTiempo(): Observable<Response> {
    return this.http.get<Response>(this.API.listDataloggerComboTiempo);
  }
  
  loadComboSector(): Observable<Response> {
    return this.http.get<Response>(this.API.listDataloggerComboSector);
  }

  loadComboDistrito(): Observable<Response> {
    return this.http.get<Response>(this.API.listDataloggerComboDistrito);
  }

  loadComboIndicador(): Observable<Response> {
    return this.http.get<Response>(this.API.listDataloggerComboIndicador);
  }

  loadComboEstado(): Observable<Response> {
    return this.http.get<Response>(this.API.listDataloggerComboEstado);
  }

  obtenerDataloggersPDF(element: any) {
    return this.http.post(this.API.listDataloggersPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerDataloggersPorEquipoPDF(element: any) {
    return this.http.post(this.API.listDataloggersPorEquipoPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerDataloggersPorGerenciaPDF(element: any) {
    return this.http.post(this.API.listDataloggersPorGerenciaPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerDataloggersPorDistritoPDF(element: any) {
    return this.http.post(this.API.listDataloggersPorDistritoPDF, element, {
      responseType: 'blob' as 'json',
    });
  }
}