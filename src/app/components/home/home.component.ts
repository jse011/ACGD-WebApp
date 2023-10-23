import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  nombreUsuario: string;
  perfilUsuario: string;

  constructor(private session: SessionService) {}

  ngOnInit(): void {
    this.nombreUsuario = this.session.User.nombUsuario.substr(0, 41);
    this.perfilUsuario = this.session.User.descPerfil;
  }
}