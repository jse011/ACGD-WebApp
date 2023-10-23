import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SessionService } from 'src/app/auth/session.service';
import { imagenes, titulos } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() Toggler = new EventEmitter();
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  nombreUsuario: string;
  perfilUsuario: string;
  usuario: string;
  constructor(
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private session: SessionService,
    private auth: AuthService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.nombreUsuario = this.session.User.nombUsuario.substr(0, 41);
    this.perfilUsuario = this.session.User.descPerfil;
    this.usuario = this.session.User.codUsuario;
  }

  getTitulos() {
    return titulos;
  }

  getImagenes() {
    return imagenes;
  }

  toggle() {
    this.Toggler.emit();
  }

  //Cerra sessión
  OnLogout() {
    this.auth.logout();
  }

  OnChangePassword() {
    this.router.navigate(['/cambio-contrasena']);
  }
}