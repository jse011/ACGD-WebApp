import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataloggerTabComponent } from './datalogger-tab.component';

describe('DataloggerTabComponent', () => {
  let component: DataloggerTabComponent;
  let fixture: ComponentFixture<DataloggerTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataloggerTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataloggerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
