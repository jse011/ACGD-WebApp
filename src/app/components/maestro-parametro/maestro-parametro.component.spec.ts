import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroParametroComponent } from './maestro-parametro.component';

describe('MaestroParametroComponent', () => {
  let component: MaestroParametroComponent;
  let fixture: ComponentFixture<MaestroParametroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestroParametroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaestroParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
