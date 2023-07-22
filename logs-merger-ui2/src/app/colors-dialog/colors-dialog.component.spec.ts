import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsDialogComponent } from './colors-dialog.component';

describe('ColorsDialogComponent', () => {
  let component: ColorsDialogComponent;
  let fixture: ComponentFixture<ColorsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColorsDialogComponent]
    });
    fixture = TestBed.createComponent(ColorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
