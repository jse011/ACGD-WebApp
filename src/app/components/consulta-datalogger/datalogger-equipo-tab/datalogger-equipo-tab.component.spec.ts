import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataloggerEquipoTabComponent } from './datalogger-equipo-tab.component';

describe('DataloggerEquipoTabComponent', () => {
  let component: DataloggerEquipoTabComponent;
  let fixture: ComponentFixture<DataloggerEquipoTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataloggerEquipoTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataloggerEquipoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
