import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEstadisticosComponent } from './reporte-estadisticos.component';

describe('ReporteEstadisticosComponent', () => {
  let component: ReporteEstadisticosComponent;
  let fixture: ComponentFixture<ReporteEstadisticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEstadisticosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteEstadisticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
