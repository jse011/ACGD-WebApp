import { NivelError } from '../models/enums/nivel-error';
type Estados = 'OK' | 'ERROR';

/*add interface response*/
export interface Response {
  estado: Estados;
  paginacion: any;
  acciones?: string[];
  error?: Error;
  resultado?: any;
}

export interface Error {
  codigo: string;
  nivel: NivelError;
  mensaje: string;
  mensajeInterno: string;
}