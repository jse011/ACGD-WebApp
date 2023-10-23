import { ReporteConsultarRequest } from "./reporteConsultarRequest";

export interface ReporteVolumenPorEquipoConsultarRequest
  extends ReporteConsultarRequest
{
  nZona: number;
}