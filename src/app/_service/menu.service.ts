import { Injectable } from '@angular/core';
import { IMenu } from '../_interface/IMenu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menu : IMenu[] = [
    {title: 'Home', url: '/inicio', icon: 'done'},
    {title: 'Módulo Maestros', url: '/', icon: 'done'},
    {title: 'Módulo Mantenimiento', url: '/', icon: 'done'},
    {title: 'Módulo Consultas', url: '/', icon: 'done'},
    {title: 'Maestro de Párametros', url: '/', icon: 'done'},
    {title: 'Maestro de DataLoggers', url: '/', icon: 'done'},
    {title: 'Importación Manual', url: '/importManual', icon: 'done'},
    {title: 'Validación de Datos', url: '/', icon: 'done'},
    {title: 'Maestro de Parámetros', url: '/maestro-parametro', icon: 'done'}

  ]

  constructor() { }

  getItems(): IMenu[]{
    return [...this.menu]
  }
}
