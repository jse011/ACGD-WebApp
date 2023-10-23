import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroDataloggersComponent } from './maestro-dataloggers.component';

describe('MaestroDataloggersComponent', () => {
  let component: MaestroDataloggersComponent;
  let fixture: ComponentFixture<MaestroDataloggersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestroDataloggersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaestroDataloggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
