import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteBateriaComponent } from './reporte-bateria.component';

describe('ReporteBateriaComponent', () => {
  let component: ReporteBateriaComponent;
  let fixture: ComponentFixture<ReporteBateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteBateriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteBateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
