import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

(window as any).global = window;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiEndpoint: string;
  expiresAt: Date;
  @BlockUI() blockUI: NgBlockUI;
  //authenticated: BehaviorSubject<boolean>; // false=sin autenticar, true=autenticado
  authenticated: BehaviorSubject<0 | 1 | 2 | 3>; // 0=sin autenticar, 1=autentico usr/pwd, 2=selecciono perfil, 3=cambiar clave(usuario nuevo)
  passwordRequested: BehaviorSubject<0 | 1 | 2 | 3>; // 0=solicitar password, 1=actualizar password, 2=password actualizado, 3=cambiar clave(usuario nuevo)
  accessToken: string;
  userProfile: any;
  info: string;
  requested: boolean;
  error: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private session: SessionService
  ) {
    this.apiEndpoint = `${environment.serviceEndpointAuth}`;
    this.authenticated = new BehaviorSubject(null);
    this.passwordRequested = new BehaviorSubject(null);
  }

  login(username: string, password: string) {
    this.blockUI.start();
    this.info = null;
    this.error = null;
    const loginParams = { username, password };
    this.http.post<any>(`${this.apiEndpoint}/login`, loginParams).subscribe(
      (response) => {        
        this.blockUI.stop();
        if (response && response.resultado && response.resultado.token) {
          this.session.setSession(response.resultado);
          //this.authenticated.next(true);
          window.location.hash = '';
          if (response.resultado.perfiles && response.resultado.perfiles.length > 1) {
            this.authenticated.next(1);
          } else {
            this.session.setSessionPerfil(response.resultado.userProfile, response.resultado.userProfile.codPerfil, response.resultado.userProfile.descPerfil);
            this.authenticated.next(2);            
          }
         this.router.navigate(['/inicio']);
         //this.router.navigate(['/inicio']);
        } else {
          this.error =
            'El procedimiento de autenticación no se realizó correctamente';
          this.authenticated.next(0);
        }
        this.blockUI.stop();
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error =
            'Ocurrió un error al durante la conexión con el servicio de autenticación';
        } else {
          switch (errorResponse.status) {
            case 400:
            case 401:
            case 403:
              this.error = errorResponse.error.error.mensaje;
              break;
            case 404:
              this.error =
                'La configuración del servicio de autenticación no es correcta';
              break;
            case 500:
            default: {
              //this.error = 'Ocurrió un error durante el proceso de autenticación';
              this.error = errorResponse.error.mensaje;
              //this.error = errorResponse.error.mensajeInterno;
            }
          }
          if (!environment.production) {
          }
        }
        this.blockUI.stop();
        this.authenticated.next(0);
      }
    );
  }

  loginnew(username: string, password: string) {

    this.blockUI.start();
    this.info = null;
    this.error = null;
    const loginParams = { username, password };
    this.http.post<any>(`${this.apiEndpoint}/login`, loginParams).subscribe(
      (response) => {
        console.log(response)
        this.blockUI.stop();
        if(response.resultado.userProfile.restablecerClave)
        {
          this.userProfile = response.resultado.userProfile
          this.authenticated.next(3);
          this.info = "Ingrese una nueva clave"
          this.passwordRequested.next(3);
        }
        else
        {
          if (response && response.resultado && response.resultado.token) {
            this.session.setSession(response.resultado);
            window.location.hash = '';
            console.log(response.resultado)
            if (response.resultado.perfiles && response.resultado.perfiles.length > 1) {
              this.authenticated.next(1);
            } else {
              this.session.setSessionPerfil(response.resultado.userProfile, response.resultado.userProfile.codPerfil, response.resultado.userProfile.descPerfil);
              this.authenticated.next(2);
            }
            this.router.navigate(['/']);
          } else {
            this.error =
              'El procedimiento de autenticación no se realizó correctamente';
            this.authenticated.next(0);
          }
        }
        this.blockUI.stop();
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error =
            'Ocurrió un error al durante la conexión con el servicio de autenticación';
        } else {
          switch (errorResponse.status) {
            case 400:
            case 401:
            case 403:
              this.error = errorResponse.error.error.mensaje;
              break;
            case 404:
              this.error =
                'La configuración del servicio de autenticación no es correcta';
              break;
            case 500:
            default: {
              //this.error = 'Ocurrió un error durante el proceso de autenticación';
              this.error = errorResponse.error.mensaje;
              //this.error = errorResponse.error.mensajeInterno;
            }
          }
          if (!environment.production) {
          }
        }
        this.blockUI.stop();
        this.authenticated.next(0);
      }
    );
  }

  logout() {
    this.blockUI.start();
    this.http.post<any>(`${this.apiEndpoint}/logout`, {}).subscribe(
      (response) => {
        this.blockUI.stop();
        // clear session info
        this.session.deleteSession();
        this.error = null;
        this.authenticated.next(0);
        this.toastr.success(
          'Finalizo la sesión del usuario correctamente.',
          'Correcto',
          { closeButton: true }
        );
        this.router.navigate(['/login']);
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error =
            'Ocurrió un error al durante la cngonexión con el servicio de autenticación';
        } else if (errorResponse.status !== 200) {
          switch (errorResponse.status) {
            case 404:
              this.error =
                'La configuración del servicio de autenticación no es correcta';
              break;
            case 500:
            default:
              this.error =
                'Ocurrió un error durante el proceso de autenticación';
          }
          console.error(`Auth Error: ${this.error}`);
        }
        // clear session info
        this.session.deleteSession();
        this.authenticated.next(0);
        this.router.navigate(['/login']);
      }
    );
  }

  requestPassword(username: string) {
    this.info = null;
    this.error = null;
    this.requested = null;
    const requestParams = { username };
    this.http
      .post<any>(`${this.apiEndpoint}/login/password/request`, requestParams)
      .subscribe(
        (response) => {
          if (response && response.resultado) {
            this.info = response.resultado;
            this.passwordRequested.next(1);
          } else {
            this.error = 'La solicitud no se realizó correctamente';
            this.passwordRequested.next(0);
          }
        },
        (errorResponse) => {
          if (!errorResponse && !errorResponse.status) {
            this.error =
              'Ocurrió un error al durante la conexión con el sistema de seguridad';
          } else {
            switch (errorResponse.status) {
              case 401:
              case 404:
                this.error = errorResponse.error.error.mensaje;
                break;
              case 500:
              default:
                this.error = 'Ocurrió un error durante la solicitud';
            }
            if (!environment.production) {
              console.error(`Auth Error:`, errorResponse.error);
            }
          }
          this.passwordRequested.next(0);
        }
      );
  }

  changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
    newPasswordCheck: string
  ) {
    const requestParams = {
      username,
      oldPassword,
      newPassword,
      newPasswordCheck,
    };
    return this.http.post<any>(
      `${this.apiEndpoint}/login/password/reset`,
      requestParams
    );
  }

  resetPassword(
    username: string,
    oldPassword: string,
    newPassword: string,
    newPasswordCheck: string,
    userNew: boolean
  ) {
    this.info = null;
    this.error = null;
    const requestParams = { username , oldPassword , newPassword , newPasswordCheck};
    this.blockUI.start();
    this.http
      .post<any>(`${this.apiEndpoint}/login/password/reset`, requestParams)
      .subscribe(
        (response) => {
          this.blockUI.stop();

          if (response && response.resultado) {
            this.info = response.resultado;
            this.passwordRequested.next(2);
            if(userNew){
              this.authenticated.next(null);
            }
          } else {
            this.error = 'La solicitud no se realizó correctamente';
            this.passwordRequested.next(1);
          }
        },
        (errorResponse) => {
          this.blockUI.stop();
          if (!errorResponse && !errorResponse.status) {
            this.error =
              'Ocurrió un error al durante la conexión con el sistema de seguridad';
          } else {
            switch (errorResponse.status) {
              case 401:
              case 404:
                this.error = errorResponse.error.error.mensaje;
                break;
              case 500:
              default:
                // this.error = 'Ocurrió un error durante la solicitud';
                this.error = errorResponse.error.mensaje;
            }
            if (!environment.production) {
              console.error(`Auth Error:`, errorResponse.error);
            }
          }
          this.passwordRequested.next(1);
        }
      );
  }

  setProfile(username: String, roleId: number, descPerfil: string) {
    //    this.spinner.show();
    this.info = null;
    this.error = null;
    const loginParams = { username, roleId };
    sessionStorage.setItem('roleID', String(roleId));

    this.http
      .post<any>(`${this.apiEndpoint}/login/profile`, loginParams)
      .subscribe(
        (response) => {
          console.log(response);
          if (response && response.resultado) {
            this.session.setSessionPerfil(
              response.resultado,
              roleId,
              descPerfil
            );
            window.location.hash = '';
            this.authenticated.next(2);
          } else {
            this.error =
              'Se presentaron problemas al establecer el perfil seleccionado';
            this.authenticated.next(0);
          }
          // this.spinner.hide();
        },
        (errorResponse) => {
          if (!errorResponse && !errorResponse.status) {
            this.error =
              'Ocurrió un error al durante la conexión con el servicio de autenticación';
          } else {
            /* SED-213 - Inicio */
            // switch (errorResponse.status) {
            switch (errorResponse.error.codigo) {
              /* SED-213 - Fin */
              case 400:
              case 401:
                /* SED-213 - Inicio */
                this.error = errorResponse.error.mensajeInterno;
                break;
              /* SED-213 - Fin */
              case 403:
                this.error = errorResponse.error.error.mensaje;
                break;
              case 404:
                this.error =
                  'La configuración del servicio de autenticación no es correcta';
                break;
              case 500:
              default:
                this.error =
                  'Ocurrió un error durante el proceso de selección de perfil';
            }
            if (!environment.production) {
              console.error(`Auth Error:`, errorResponse.error);
            }
            //  this.spinner.hide();
          }
          this.authenticated.next(0);
        }
      );
    sessionStorage.getItem('roleID');
    // this.spinner.hide();
  }
}