import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDialogComponent } from './summary-dialog.component';

describe('SummaryDialogComponent', () => {
  let component: SummaryDialogComponent;
  let fixture: ComponentFixture<SummaryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryDialogComponent]
    });
    fixture = TestBed.createComponent(SummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
