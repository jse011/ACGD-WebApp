import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataloggerGerenciaTabComponent } from './datalogger-gerencia-tab.component';

describe('DataloggerGerenciaTabComponent', () => {
  let component: DataloggerGerenciaTabComponent;
  let fixture: ComponentFixture<DataloggerGerenciaTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataloggerGerenciaTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataloggerGerenciaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
