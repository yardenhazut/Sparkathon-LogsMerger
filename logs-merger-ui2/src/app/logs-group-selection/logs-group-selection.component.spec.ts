import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsGroupSelectionComponent } from './logs-group-selection.component';

describe('LogsGroupSelectionComponent', () => {
  let component: LogsGroupSelectionComponent;
  let fixture: ComponentFixture<LogsGroupSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogsGroupSelectionComponent]
    });
    fixture = TestBed.createComponent(LogsGroupSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
