import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionDatosComponent } from './validacion-datos.component';

describe('ValidacionDatosComponent', () => {
  let component: ValidacionDatosComponent;
  let fixture: ComponentFixture<ValidacionDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidacionDatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacionDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
