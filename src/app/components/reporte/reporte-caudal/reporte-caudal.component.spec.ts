import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCaudalComponent } from './reporte-caudal.component';

describe('ReporteCaudalComponent', () => {
  let component: ReporteCaudalComponent;
  let fixture: ComponentFixture<ReporteCaudalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCaudalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteCaudalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
