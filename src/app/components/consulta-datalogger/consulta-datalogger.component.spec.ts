import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDataloggerComponent } from './consulta-datalogger.component';

describe('ConsultaDataloggerComponent', () => {
  let component: ConsultaDataloggerComponent;
  let fixture: ComponentFixture<ConsultaDataloggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaDataloggerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaDataloggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
