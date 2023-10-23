import { DataloggersAreaBuscarResponse } from './dataloggersAreaBuscarResponse';
import { DataloggersDistritoBuscarResponse } from './dataloggersDistritoBuscarResponse';
import { DataloggersEstadoBuscarResponse } from './dataloggersEstadoBuscarResponse';
import { DataloggersIndicadorBuscarResponse } from './dataloggersIndicadorBuscarResponse';
import { DataloggersSectorBuscarResponse } from './dataloggersSectorBuscarResponse';
import { DataloggersZonaBuscarResponse } from './dataloggersZonaBuscarResponse';

export class DataloggersBuscarResponse {
  nro: number;
  id: number;
  nCoddat: string;
  vDesdat: string;
  areaBuscarResponse: DataloggersAreaBuscarResponse;
  sectorBuscarResponse: DataloggersSectorBuscarResponse;  
  nSector: number;
  nCodseg: string;
  zonaBuscarResponse: DataloggersZonaBuscarResponse;
  distritoBuscarResponse: DataloggersDistritoBuscarResponse;
  estadoBuscarResponse: DataloggersEstadoBuscarResponse;
  indicadorBuscarResponse: DataloggersIndicadorBuscarResponse;
  vDir: string;
  nSerieInst: string;
  nSerieCapt: string;
  nroEquipo: string;
  dFecins: string;
  nMarca: string;
  nModelo: string;
  vCamara: string;
  vCambioPila: string;
  nNis: number;
}