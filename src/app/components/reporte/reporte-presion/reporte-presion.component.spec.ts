import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePresionComponent } from './reporte-presion.component';

describe('ReportePresionComponent', () => {
  let component: ReportePresionComponent;
  let fixture: ComponentFixture<ReportePresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePresionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
