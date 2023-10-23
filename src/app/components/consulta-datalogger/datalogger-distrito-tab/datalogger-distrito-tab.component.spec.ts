import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataloggerDistritoTabComponent } from './datalogger-distrito-tab.component';

describe('DataloggerDistritoTabComponent', () => {
  let component: DataloggerDistritoTabComponent;
  let fixture: ComponentFixture<DataloggerDistritoTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataloggerDistritoTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataloggerDistritoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
