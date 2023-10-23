import { NivelError } from './enums/nivel-error';
type Estados = 'OK' | 'ERROR';

export class Error {
  codigo: string;
  nivel: NivelError;
  mensaje: string;
  mensajeInterno: string;
}

/*add interface response*/
export interface Response {
  estado: Estados;
  paginacion: any;
  acciones?: string[];
  error?: Error;
  resultado?: any;
}