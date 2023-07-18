import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesAreaComponent } from './rules-area.component';

describe('RulesAreaComponent', () => {
  let component: RulesAreaComponent;
  let fixture: ComponentFixture<RulesAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RulesAreaComponent]
    });
    fixture = TestBed.createComponent(RulesAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
