import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../models/response';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private auth: AuthService,
    private session: SessionService,
    private toastr: ToastrService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((response) => {
        if (response instanceof HttpErrorResponse) {
          // no hubo respuesta
          if (response.status === 0) {
            console.error('Not Response Error', response);
            /*this.toastr.error(
              'No se pudo establecer comunicación con el servicio del sistema STDC',
              'Error'
            );*/
            this.blockUI.stop();
            return EMPTY;
          }
          // controlar error de sesión caducada
          else if (response.status === 403) {
            this.session.expireSession();
            this.auth.logout();
            this.blockUI.stop();
            return EMPTY;
          }
          // controlar otras excepciones
          else if (response.status === 500) {
            console.error('Response Error', response);
            this.toastr.error(
              'Se presentó un error inesperado en la última acción',
              'Error'
            );
            // si error tiene la propiedad estado entonces es un error propio del servicio
            // retornar objeto Response al componente
            if (response.error.estado) {
              this.blockUI.stop();
              return Observable.throw(
                Object.assign(new Response(), response.error)
              );
            } else {
              this.blockUI.stop();
              return EMPTY;
            }
          }
          // si error tiene la propiedad estado entonces es un error propio del servicio
          // retornar objeto Response al componente
          if (response.error.estado) {
            this.blockUI.stop();
            return Observable.throw(
              Object.assign(new Response(), response.error)
            );
          } else {
            this.blockUI.stop();
            return Observable.throw(response);
          }
        }
      })
    );
  }
}