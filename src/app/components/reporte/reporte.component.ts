import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
})
export class ReporteComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {}

  redireccionar(url: string) {
    this.router.navigate([url]);
  }
}