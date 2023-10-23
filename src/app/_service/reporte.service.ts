import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReporteBateriaConsultarRequest } from '../models/request/reporteBateriaConsultarRequest';
import { ReporteCaudalConsultarRequest } from '../models/request/reporteCaudalConsultarRequest';
import { ReporteEstadisticoConsultarRequest } from '../models/request/reporteEstadisticoConsultarRequest';
import { ReporteNivelConsultarRequest } from '../models/request/reporteNivelConsultarRequest';
import { ReportePresionConsultarRequest } from '../models/request/reportePresionConsultarRequest';
import { ReporteSeisValoresEomrConsultarRequest } from '../models/request/reporteSeisValoresEomrConsultarRequest';
import { ReporteVolumenConsultarRequest } from '../models/request/reporteVolumenConsultarRequest';
import { ReporteVolumenPorEquipoConsultarRequest } from '../models/request/reporteVolumenPorEquipoConsultarRequest';
import { Response } from '../models';
import { ApiService } from './api.service';

@Injectable()
export class ReporteService {
  constructor(private http: HttpClient, private API: ApiService) {}

  listVolumenPorEquipo(
    reporteVolumenPorEquipoConsultarRequest: ReporteVolumenPorEquipoConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (reporteVolumenPorEquipoConsultarRequest.fecInic != null)
      params = params.set(
        'fecInic',
        reporteVolumenPorEquipoConsultarRequest.fecInic.toString()
      );
    if (reporteVolumenPorEquipoConsultarRequest.fecFin != null)
      params = params.set(
        'fecFin',
        reporteVolumenPorEquipoConsultarRequest.fecFin.toString()
      );
    if (reporteVolumenPorEquipoConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        reporteVolumenPorEquipoConsultarRequest.nCoddat.toString()
      );
    if (reporteVolumenPorEquipoConsultarRequest.nEquipo != null)
      params = params.set(
        'nEquipo',
        reporteVolumenPorEquipoConsultarRequest.nEquipo.toString()
      );
    if (reporteVolumenPorEquipoConsultarRequest.nSector != null)
      params = params.set(
        'nSector',
        reporteVolumenPorEquipoConsultarRequest.nSector.toString()
      );
    if (reporteVolumenPorEquipoConsultarRequest.nZona != null)
      params = params.set(
        'nZona',
        reporteVolumenPorEquipoConsultarRequest.nZona.toString()
      );
    return this.http.get<Response>(this.API.listVolumenPorEquipo, {
      params,
    });
  }

  listPresion(
    reportePresionConsultarRequest: ReportePresionConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (reportePresionConsultarRequest.fecInic != null)
      params = params.set(
        'fecInic',
        reportePresionConsultarRequest.fecInic.toString()
      );
    if (reportePresionConsultarRequest.fecFin != null)
      params = params.set(
        'fecFin',
        reportePresionConsultarRequest.fecFin.toString()
      );
    if (reportePresionConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        reportePresionConsultarRequest.nCoddat.toString()
      );
    if (reportePresionConsultarRequest.nEquipo != null)
      params = params.set(
        'nEquipo',
        reportePresionConsultarRequest.nEquipo.toString()
      );
    if (reportePresionConsultarRequest.nSector != null)
      params = params.set(
        'nSector',
        reportePresionConsultarRequest.nSector.toString()
      );
    if (reportePresionConsultarRequest.nZona != null)
      params = params.set(
        'nZona',
        reportePresionConsultarRequest.nZona.toString()
      );
    return this.http.get<Response>(this.API.listPresion, {
      params,
    });
  }

  listCaudal(
    reporteCaudalConsultarRequest: ReporteCaudalConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (reporteCaudalConsultarRequest.fecInic != null)
      params = params.set(
        'fecInic',
        reporteCaudalConsultarRequest.fecInic.toString()
      );
    if (reporteCaudalConsultarRequest.fecFin != null)
      params = params.set(
        'fecFin',
        reporteCaudalConsultarRequest.fecFin.toString()
      );
    if (reporteCaudalConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        reporteCaudalConsultarRequest.nCoddat.toString()
      );
    if (reporteCaudalConsultarRequest.nEquipo != null)
      params = params.set(
        'nEquipo',
        reporteCaudalConsultarRequest.nEquipo.toString()
      );
    if (reporteCaudalConsultarRequest.nSector != null)
      params = params.set(
        'nSector',
        reporteCaudalConsultarRequest.nSector.toString()
      );
    if (reporteCaudalConsultarRequest.nZona != null)
      params = params.set(
        'nZona',
        reporteCaudalConsultarRequest.nZona.toString()
      );
    return this.http.get<Response>(this.API.listCaudal, {
      params,
    });
  }

  listNivel(
    reporteNivelConsultarRequest: ReporteNivelConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (reporteNivelConsultarRequest.fecInic != null)
      params = params.set(
        'fecInic',
        reporteNivelConsultarRequest.fecInic.toString()
      );
    if (reporteNivelConsultarRequest.fecFin != null)
      params = params.set(
        'fecFin',
        reporteNivelConsultarRequest.fecFin.toString()
      );
    if (reporteNivelConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        reporteNivelConsultarRequest.nCoddat.toString()
      );
    if (reporteNivelConsultarRequest.nEquipo != null)
      params = params.set(
        'nEquipo',
        reporteNivelConsultarRequest.nEquipo.toString()
      );
    if (reporteNivelConsultarRequest.nSector != null)
      params = params.set(
        'nSector',
        reporteNivelConsultarRequest.nSector.toString()
      );
    if (reporteNivelConsultarRequest.nZona != null)
      params = params.set(
        'nZona',
        reporteNivelConsultarRequest.nZona.toString()
      );
    return this.http.get<Response>(this.API.listNivel, {
      params,
    });
  }

  listVolumen(
    reporteVolumenConsultarRequest: ReporteVolumenConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (reporteVolumenConsultarRequest.fecInic != null)
      params = params.set(
        'fecInic',
        reporteVolumenConsultarRequest.fecInic.toString()
      );
    if (reporteVolumenConsultarRequest.fecFin != null)
      params = params.set(
        'fecFin',
        reporteVolumenConsultarRequest.fecFin.toString()
      );
    if (reporteVolumenConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        reporteVolumenConsultarRequest.nCoddat.toString()
      );
    if (reporteVolumenConsultarRequest.nEquipo != null)
      params = params.set(
        'nEquipo',
        reporteVolumenConsultarRequest.nEquipo.toString()
      );
    if (reporteVolumenConsultarRequest.nSector != null)
      params = params.set(
        'nSector',
        reporteVolumenConsultarRequest.nSector.toString()
      );
    if (reporteVolumenConsultarRequest.nZona != null)
      params = params.set(
        'nZona',
        reporteVolumenConsultarRequest.nZona.toString()
      );
    return this.http.get<Response>(this.API.listVolumen, {
      params,
    });
  }

  listBateria(
    reporteBateriaConsultarRequest: ReporteBateriaConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (reporteBateriaConsultarRequest.fecInic != null)
      params = params.set(
        'fecInic',
        reporteBateriaConsultarRequest.fecInic.toString()
      );
    if (reporteBateriaConsultarRequest.fecFin != null)
      params = params.set(
        'fecFin',
        reporteBateriaConsultarRequest.fecFin.toString()
      );
    if (reporteBateriaConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        reporteBateriaConsultarRequest.nCoddat.toString()
      );
    if (reporteBateriaConsultarRequest.nEquipo != null)
      params = params.set(
        'nEquipo',
        reporteBateriaConsultarRequest.nEquipo.toString()
      );
    if (reporteBateriaConsultarRequest.nSector != null)
      params = params.set(
        'nSector',
        reporteBateriaConsultarRequest.nSector.toString()
      );
    return this.http.get<Response>(this.API.listBateria, {
      params,
    });
  }

  listSeisValoresEomr(
    reporteSeisValoresEomrConsultarRequest: ReporteSeisValoresEomrConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (reporteSeisValoresEomrConsultarRequest.fecInic != null)
      params = params.set(
        'fecInic',
        reporteSeisValoresEomrConsultarRequest.fecInic.toString()
      );
    if (reporteSeisValoresEomrConsultarRequest.fecFin != null)
      params = params.set(
        'fecFin',
        reporteSeisValoresEomrConsultarRequest.fecFin.toString()
      );
    if (reporteSeisValoresEomrConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        reporteSeisValoresEomrConsultarRequest.nCoddat.toString()
      );
    if (reporteSeisValoresEomrConsultarRequest.nEquipo != null)
      params = params.set(
        'nEquipo',
        reporteSeisValoresEomrConsultarRequest.nEquipo.toString()
      );
    if (reporteSeisValoresEomrConsultarRequest.nSector != null)
      params = params.set(
        'nSector',
        reporteSeisValoresEomrConsultarRequest.nSector.toString()
      );
    return this.http.get<Response>(this.API.listSeisValoresEomr, {
      params,
    });
  }

  listEstadistico(
    reporteEstadisticoConsultarRequest: ReporteEstadisticoConsultarRequest,
    data: any
  ): Observable<Response> {
    let params: HttpParams = new HttpParams()
      .set('pagina', data.pagina.toString())
      .set('registros', data.page_size.toString());
    if (reporteEstadisticoConsultarRequest.fecInic != null)
      params = params.set(
        'fecInic',
        reporteEstadisticoConsultarRequest.fecInic.toString()
      );
    if (reporteEstadisticoConsultarRequest.fecFin != null)
      params = params.set(
        'fecFin',
        reporteEstadisticoConsultarRequest.fecFin.toString()
      );
    if (reporteEstadisticoConsultarRequest.nParametro != null)
      params = params.set(
        'nParametro',
        reporteEstadisticoConsultarRequest.nParametro.toString()
      );
    if (reporteEstadisticoConsultarRequest.nTiempo != null)
      params = params.set(
        'nTiempo',
        reporteEstadisticoConsultarRequest.nTiempo.toString()
      );
    if (reporteEstadisticoConsultarRequest.nCoddat != null)
      params = params.set(
        'nCoddat',
        reporteEstadisticoConsultarRequest.nCoddat.toString()
      );
    if (reporteEstadisticoConsultarRequest.nEquipo != null)
      params = params.set(
        'nEquipo',
        reporteEstadisticoConsultarRequest.nEquipo.toString()
      );
    if (reporteEstadisticoConsultarRequest.nSector != null)
      params = params.set(
        'nSector',
        reporteEstadisticoConsultarRequest.nSector.toString()
      );
    return this.http.get<Response>(this.API.listEstadistico, {
      params,
    });
  }
  ///////////////////////////////////////////////////////////////////
  obtenerVolumenPorEquipoPDF(element: any) {
    return this.http.post(this.API.listVolumenPorEquipoPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerPresionPDF(element: any) {
    return this.http.post(this.API.listPresionPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerCaudalPDF(element: any) {
    return this.http.post(this.API.listCaudalPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerNivelPDF(element: any) {
    return this.http.post(this.API.listNivelPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerVolumenPDF(element: any) {
    return this.http.post(this.API.listVolumenPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerBateriaPDF(element: any) {
    return this.http.post(this.API.listBateriaPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerSeisValoresEomrPDF(element: any) {
    return this.http.post(this.API.listSeisValoresEomrPDF, element, {
      responseType: 'blob' as 'json',
    });
  }

  obtenerEstadisticoPDF(element: any) {
    return this.http.post(this.API.listEstadisticoPDF, element, {
      responseType: 'blob' as 'json',
    });
  }
}