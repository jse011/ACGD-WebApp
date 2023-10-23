import { Menu } from './menu';
import { Perfil } from './perfil';

export class User {
  codUsuario: string;
  codFicha: number;
  nombUsuario: string;
  descripcion: string;
  codPerfil: number;
  descPerfil: string;
  codArea: number;
  descArea: string;
  abrevArea: string;
  permisos: string[];
  perfilesAsociados: Perfil[];
  menu: Menu[];
}