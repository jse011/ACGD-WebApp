import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDataloggerComponent } from './lista-datalogger.component';

describe('ListaDataloggerComponent', () => {
  let component: ListaDataloggerComponent;
  let fixture: ComponentFixture<ListaDataloggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDataloggerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDataloggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
