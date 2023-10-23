import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { AuthService } from 'src/app/auth/auth.service';
import { SessionService } from 'src/app/services';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.scss']
})
export class CambioContrasenaComponent implements OnInit {
  id: string;
  name: string;
  copyright: string;
  version: string;
  info: string;
  oldPassword: string;
  newPassword: string;
  newPasswordCheck: string;
  waiting: boolean;
  username: string;
  password: string;
  loading: boolean;
  authenticated: boolean;
  requested: boolean;
  //imagenesPDF = new Array<ImagenesPDF>();
  error: string;
  pathImagen:string;
  userNew: boolean;
  title:string = 'Recuperar Contraseña';

  constructor(
    private auth: AuthService,
    private session: SessionService,
    private router: Router
  ) {
    this.id = AppSettings.APP_ID;
    this.name = AppSettings.APP_NAME;
    this.copyright = AppSettings.APP_COPYRIGHT;
    this.version = AppSettings.APP_VERSION;
    this.loading = false;
    this.authenticated = false;    
    this.requested = false;
    this.error = '';
    this.userNew = false
  }

  ngOnInit() {
    this.pathImagen = environment.pathImagen;
    if (this.session.isLoggedIn) {
      this.router.navigate(['/']);
    }
    if (this.auth.error) {
      this.error = this.auth.error;
    }
    if (this.auth.info) {
      this.info = this.auth.info;
    }
    this.auth.passwordRequested.subscribe((resetResult: number) => {
      switch (resetResult) {
        case 0:
          //this.waiting = false;
          this.requested = false;
          this.error = this.auth.error || null;
          this.info = this.auth.info || null;
          
          break;
        case 1:
          //this.waiting = false;
          this.requested = true;
          this.error = this.auth.error || null;
          this.info = this.auth.info || null;
          
          break;
        case 2:
          this.router.navigate(['/login']);
          break;
        case 3:
            this.username = this.auth.userProfile.codUsuario
            this.oldPassword = this.auth.userProfile.clave
            this.userNew = true
            this.requested = true;
            this.error = this.auth.error || null;
            this.info = this.auth.info || null;
            this.title = 'Cambio Contraseña Temporal';
            break;  
      }
    });


    /* SED-213 - Inicio */
    /*this.route.params.subscribe(
      (params: Params) => {
        this.username = params['usuario'];
        if (params['usuario']) {
          console.log('envio USUARIO')
        }
      });*/
    /* SED-213 - Fin */
  }

  


  doRequest(form) {
    if (form.valid) {
      if (!this.username) { this.error = 'Debe ingresar su nombre de usuario.'; return; }
    }    
    this.waiting = true;
    this.auth.requestPassword(this.username);    
  }

  doReset(form) {
    this.error = '';
    if (!form.valid) {
      if (!this.oldPassword) { this.info=null; this.error = 'Debe ingresar la contraseña temporal'; return; }
      if (!this.newPassword) { this.info=null; this.error = 'Debe ingresar su nueva contraseña'; return; }
      if (!this.newPasswordCheck) { this.info=null; this.error = 'Debe repetir la nueva contraseña'; return; }
      if (this.newPassword !== this.newPasswordCheck) { this.info=null; this.error = 'La contraseñas no coinciden'; return; }

    }
    if (this.newPassword !== this.newPasswordCheck) { this.info=null; this.error = 'La contraseñas no coinciden'; return; }
    this.waiting = true;
    if (this.requested) {
      this.auth.resetPassword(this.username, this.oldPassword, this.newPassword, this.newPasswordCheck, this.userNew);
    }
  }


}
