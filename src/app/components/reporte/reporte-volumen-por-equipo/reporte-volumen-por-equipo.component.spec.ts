import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVolumenPorEquipoComponent } from './reporte-volumen-por-equipo.component';

describe('ReporteVolumenPorEquipoComponent', () => {
  let component: ReporteVolumenPorEquipoComponent;
  let fixture: ComponentFixture<ReporteVolumenPorEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteVolumenPorEquipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVolumenPorEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
