
import { NgModule, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import {SessionService} from '../services';
import { debuglog } from 'util';

/**
 * Muestra un elemento del DOM en caso tenga todos los permisos solicitados.
 * @example
 * <nav>
 *  <div class="menu-item" *authIf="['/editar']">Editar</div>
 * </nav>
 */
@Directive({
  selector: '[authIf]'
})
export class ShowIfDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private session: SessionService) { }

    private _queryPermissions: string[];
    @Input() set authIf(permissions: string|string[]) {
      this._queryPermissions = (typeof permissions === 'string') ? [permissions] : permissions;
      let validated = true;
      if (!this._queryPermissions) { return; }
      //validated = this._queryPermissions.every(this.session.validatePermission);
      for (let i = 0; i < this._queryPermissions.length; i++) {
        if (!this.session.validatePermission(this._queryPermissions[i])) {
          validated = false;
          break;
        }
      }
      if (validated) {
        // Si se validaron todos los permisos añadimos el elemento al DOM
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // En caso contrario, eliminamos el contenido del DOM
        this.viewContainer.clear();
      }
    }
}

/**
 * Muestra un elemento del DOM evaluando si un permiso se encuentra en una lista de permisos otorgados.
 * @example
 * <div class="button" *authIfList="['permiso1','permiso2'];has:'permiso1'">Editar</div>
 */
@Directive({
  selector: '[authIfList]'
})
export class IfListDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

    private _assigned: string[];
    @Input() set authIfList(value: string[]) {
      this._assigned = value;
      if (!this._assigned) { return; }
      if (this._assigned.includes(this._check)) {
        // Si se cumple la condición añadimos el elemento al DOM
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // En caso contrario, eliminamos el contenido del DOM
        this.viewContainer.clear();
      }
    }

    private _check: string;
    @Input() set authIfListHas(value: string) {
      this._check = value;
    }
}

@Directive({
  selector: '[authAndViewIf]'
})
export class ShowIfAuthAndViewDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private session: SessionService) { }

    @Input() ruta:string;
    private valorRuta:string;

    private listaPermisos: string[];
    @Input() set authAndViewIf(value: string[]) {

      this.listaPermisos = value;
      if (!this.listaPermisos) { return; }
      let encontroPermiso:boolean = false;
      let permisoEncontrado:string = "";
      this.valorRuta = this.session.getRouteSecurity(this.ruta);

      for(let permiso of this.listaPermisos){

        if(permiso.indexOf(this.valorRuta+"/")==-1){ //Para el caso de ruta dentro de otra ruta
          if(permiso.indexOf(this.valorRuta)>-1){
            encontroPermiso = true;
            permisoEncontrado = permiso;
            break;
          }
        }
        
      }
      if(encontroPermiso){
        let validated = false;
        if (this.session.validatePermission(permisoEncontrado)) {
          validated = true;
        }
        if (validated) {
          // Si se validaron todos los permisos añadimos el elemento al DOM
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          // En caso contrario, eliminamos el contenido del DOM
          this.viewContainer.clear();
        }

      }else{
        return;
      }
    }

    private valor: string;
    @Input() set authAndViewIfHas(value: string) {
      this.valor = value;
      //this.valor = this.session.getRouteSecurity(value);
    }
}

@Directive({
  selector: '[buttonConsultaIf]'
})
export class ButtonConsultaIf {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private session: SessionService) { }

    @Input() rutaAnterior:string;
    @Input() rutaAnteriorAnterior:string;

    private listaPermisos: string[];
    @Input() set buttonConsultaIf(value: string[]) {

      this.listaPermisos = value;
      if (!this.listaPermisos) { return; }
      let encontroPermiso:boolean = false;
      let permisoEvaluacion:string = "";

      if(this.rutaAnterior == this.session.Ruta.ConsultaGeneral){
        permisoEvaluacion = this.listaPermisos[0];
        encontroPermiso= true;
      }else{
        if(this.rutaAnteriorAnterior == this.session.Ruta.Starterview){
          permisoEvaluacion = this.listaPermisos[1];
          encontroPermiso= true;
        }else if(this.rutaAnteriorAnterior == this.session.Ruta.ConsultaPorJerarquia){
          permisoEvaluacion = this.listaPermisos[2];
          encontroPermiso= true;
        }else{
          encontroPermiso = false;
        }
      }

      if(encontroPermiso){
        let validated = false;
        if (this.session.validatePermission(permisoEvaluacion)) {
          validated = true;
        }
        if (validated) {
          // Si se validaron todos los permisos añadimos el elemento al DOM
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          // En caso contrario, eliminamos el contenido del DOM
          this.viewContainer.clear();
        }

      }else{
        return;
      }



    }


}

@Directive({
  selector: '[authButtonComplexIf]'
})
export class ShowIfButtonComplexDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private session: SessionService) { }

    @Input() ruta:string;
    private valorRuta:string;
    @Input() valorComponente:string;
    @Input() valorBoton:string;

    private listaPermisos: string[];
    @Input() set authButtonComplexIf(value: string[]) {      
      this.listaPermisos = value;
      if (!this.listaPermisos) { return; }
      let encontroPermiso:boolean = false;
      let permisoEncontrado:string = "";
     // let rutas:any[] = this.session.getRutas();
      //this.valorRuta = this.session.getRouteSecurity(this.ruta);

      if(this.valorComponente != undefined){
        this.valorRuta = this.valorRuta + "/" + this.valorComponente;
      } 

      this.valorRuta = this.valorRuta + this.valorBoton;
      //Cguerra       
      for(let permiso of this.listaPermisos){
        if(permiso != undefined){
          if(permiso.indexOf(this.valorRuta)>-1){
            encontroPermiso = true;
            permisoEncontrado = permiso;
            break;
          }
        }
      }  
      //Cguerra

      if(encontroPermiso){
        let validated = false;
        if (this.session.validatePermission(permisoEncontrado)) {
          validated = true;
        }
        if (validated) {
          // Si se validaron todos los permisos añadimos el elemento al DOM
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          // En caso contrario, eliminamos el contenido del DOM
          this.viewContainer.clear();
        }

      }else{
        return;
      }



    }


}



@NgModule({
  declarations: [
    ShowIfDirective,
    IfListDirective,
    ShowIfAuthAndViewDirective,
    ShowIfButtonComplexDirective,
    ButtonConsultaIf
  ],
  exports: [
    ShowIfDirective,
    IfListDirective,
    ShowIfAuthAndViewDirective,
    ShowIfButtonComplexDirective,
    ButtonConsultaIf
  ],
  imports: []
})
export class AuthDirectivesModule {}
