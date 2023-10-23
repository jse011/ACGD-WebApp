import { ReporteConsultarRequest } from "./reporteConsultarRequest";

export interface ReportePresionConsultarRequest
  extends ReporteConsultarRequest {
  nZona: number;
}