import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativeTimeSelectionComponent } from './relative-time-selection.component';

describe('RelativeTimeSelectionComponent', () => {
  let component: RelativeTimeSelectionComponent;
  let fixture: ComponentFixture<RelativeTimeSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelativeTimeSelectionComponent]
    });
    fixture = TestBed.createComponent(RelativeTimeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
