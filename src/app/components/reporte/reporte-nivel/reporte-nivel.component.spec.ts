import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteNivelComponent } from './reporte-nivel.component';

describe('ReporteNivelComponent', () => {
  let component: ReporteNivelComponent;
  let fixture: ComponentFixture<ReporteNivelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteNivelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteNivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
