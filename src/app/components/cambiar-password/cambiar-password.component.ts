import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { AuthService } from 'src/app/auth/auth.service';
import { SessionService } from 'src/app/services';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss'],
})
export class CambiarPasswordComponent implements OnInit {
  nombreUsuario: string;
  perfilUsuario: string;

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
  error: string;

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
    this.requested = true;
    this.error = '';
  }

  ngOnInit() {
    this.nombreUsuario = this.session.User.nombUsuario.substr(0, 41);
    this.perfilUsuario = this.session.User.descPerfil;
    this.username = this.session.User.codUsuario;
  }

  doReset(form) {
    this.error = '';
    if (!form.valid) {
      if (!this.oldPassword) {
        this.info = null;
        this.error = 'Debe ingresar la contraseña actual';
        return;
      }
      if (!this.newPassword) {
        this.info = null;
        this.error = 'Debe ingresar su nueva contraseña';
        return;
      }
      if (!this.newPasswordCheck) {
        this.info = null;
        this.error = 'Debe repetir la nueva contraseña';
        return;
      }
      if (this.newPassword !== this.newPasswordCheck) {
        this.info = null;
        this.error = 'La contraseñas no coinciden';
        return;
      }
    }
    if (this.newPassword !== this.newPasswordCheck) {
      this.info = null;
      this.error = 'La contraseñas no coinciden';
      return;
    }
    this.waiting = true;
    if (this.requested) {
      this.auth
        .changePassword(
          this.username,
          this.oldPassword,
          this.newPassword,
          this.newPasswordCheck
        )
        .subscribe(
          (response) => {
            this.info = response.resultado;
            this.error = null;
            setTimeout((o) => {
              this.auth.logout();
            }, 1000);
          },
          (errorResponse) => {
            this.info = null;
            this.error = errorResponse.error.mensaje;
            return;
          }
        );
    }
  }
}