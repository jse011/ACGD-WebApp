import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSeisValoresOemrComponent } from './reporte-seis-valores-oemr.component';

describe('ReporteSeisValoresOemrComponent', () => {
  let component: ReporteSeisValoresOemrComponent;
  let fixture: ComponentFixture<ReporteSeisValoresOemrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteSeisValoresOemrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteSeisValoresOemrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
