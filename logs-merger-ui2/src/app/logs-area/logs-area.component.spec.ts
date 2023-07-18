import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsAreaComponent } from './logs-area.component';

describe('LogsAreaComponent', () => {
  let component: LogsAreaComponent;
  let fixture: ComponentFixture<LogsAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogsAreaComponent]
    });
    fixture = TestBed.createComponent(LogsAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
