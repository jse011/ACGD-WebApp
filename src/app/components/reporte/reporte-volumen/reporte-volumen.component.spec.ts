import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVolumenComponent } from './reporte-volumen.component';

describe('ReporteVolumenComponent', () => {
  let component: ReporteVolumenComponent;
  let fixture: ComponentFixture<ReporteVolumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteVolumenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVolumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
