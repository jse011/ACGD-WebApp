import { DataloggersAreaBuscarResponse } from './dataloggersAreaBuscarResponse';
import { DataloggersDistritoBuscarResponse } from './dataloggersDistritoBuscarResponse';

export class DataloggersPorEquipoBuscarResponse {
  nro: number;
  nCoddat: string;
  areaBuscarResponse: DataloggersAreaBuscarResponse;
  cantidad: number;
  vAbreviatura: string;
}