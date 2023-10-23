import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  nombreUsuario: string;
  perfilUsuario: string;
  desArea: string;
  constructor(private session: SessionService) {}

  ngOnInit() {
    this.nombreUsuario = this.session.User.nombUsuario.substr(0, 41);
    this.perfilUsuario = this.session.User.descPerfil;
    this.desArea= this.session.User.abrevArea;
  }
}