export class ImportacionManualListarResponse {
  id: number;
  sector: number;
  area: number;
  fecha: string;
  datalogger: number;
  codeParametro: number;
  descParametro: string;
  min: number;
  max: number;
  prom: number;
  cantidadRegistros: number;
  observacion: string;
  idEstado?: number;
  estado: string;
  select?: boolean = false;
}