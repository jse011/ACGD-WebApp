import { ReporteConsultarRequest } from "./reporteConsultarRequest";

export interface ReporteEstadisticoConsultarRequest
  extends ReporteConsultarRequest {
  nParametro: number;
  nTiempo: number;
}