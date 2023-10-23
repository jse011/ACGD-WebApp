import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacionManualComponent } from './importacion-manual.component';

describe('ImportacionManualComponent', () => {
  let component: ImportacionManualComponent;
  let fixture: ComponentFixture<ImportacionManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportacionManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportacionManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
