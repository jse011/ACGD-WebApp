import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { SessionService } from '../../auth/session.service';
import { Router } from '@angular/router';
import { AppSettings } from '../../app.settings';
import { environment } from 'src/environments/environment';
import { Perfil } from 'src/app/auth/perfil';
import { BehaviorSubject } from 'rxjs';
//import { ImagenesPDF } from 'src/app/models';

@Component({
  selector: 'login',
  templateUrl: 'login.template.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  id: string;
  name: string;
  copyright: string;
  version: string;
  username: string;
  password: string;
  loading: boolean;
  waiting: boolean;
  authenticated: boolean;
  //imagenesPDF = new Array<ImagenesPDF>();
  error: string;
  info: string;
  pathImagen: string;
  perfiles: Perfil[];
  perfil: number;
  indexsesi = 0;

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
    this.error = '';
    this.perfiles = [];
  }

  ngOnInit() {
    this.pathImagen = environment.pathImagen;
    if (this.session.isLoggedIn) {
      this.router.navigate(['/']);
    }
    if (this.session.expired) {
      this.indexsesi = 1;
      this.error = 'Su sesión ha expirado';
    } else if (this.auth.error) {
      this.error = this.auth.error;
    }
    this.auth.authenticated.subscribe((loginResult: number) => {
      switch (loginResult) {
        case 0:
          this.waiting = false;
          this.authenticated = false;
          //  this.spinner.hide();
          if (this.indexsesi == 1) {
            this.error = 'Su sesión ha expirado';
          } else {
            this.error = this.auth.error || null;
          }
          break;
        case 1:
          this.waiting = false;
          this.authenticated = true;
          this.error = this.auth.error || null;
          if (!this.error) {
            this.perfiles = this.session.User.perfilesAsociados;
            this.perfil = this.perfiles[0].codPerfil;
          }
          break;
        case 2:          
          this.router.navigate(['/inicio']);
          break;
        case 3:
          this.router.navigate(['/login/reset']);
          break;  
        default:
          this.info = this.auth.info;
          this.auth.info = null;
          this.auth.error = null;
          this.auth.passwordRequested = new BehaviorSubject(null);
      }

      /*f (!loginResult && this.auth.error) {
        this.error = this.auth.error;
      }
      if (!this.error) {
        this.perfiles = this.session.User.perfilesAsociados;
        this.perfil = this.perfiles[0].codPerfil;
      }*/
    });
    this.waiting = true;
  }

  doLogin(form) {
    
    this.error = '';
    if (form.valid) {
      this.loading = true;
      if (this.authenticated) {
        const perfilSeleccionado = this.perfiles.find((e) => e.codPerfil === Number.parseInt(this.perfil.toString()));
        this.auth.setProfile(this.username.toLocaleUpperCase(),perfilSeleccionado.codPerfil,perfilSeleccionado.descripcion);
      } else {
        this.auth.loginnew(this.username.toLocaleUpperCase(), this.password);
      }

      //this.auth.login(this.username, this.password);
    } else {
      if (!this.username) {
        this.error = 'Debe ingresar su nombre de usuario';
        return;
      }
      if (!this.password) {
        this.error = 'Debe ingresar su contraseña';
        return;
      }
    }
  }

  doRecover() {
    this.router.navigate(['/login/reset']);
  }
}