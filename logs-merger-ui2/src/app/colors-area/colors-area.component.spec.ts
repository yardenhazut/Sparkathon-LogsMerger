import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsAreaComponent } from './colors-area.component';

describe('ColorsAreaComponent', () => {
  let component: ColorsAreaComponent;
  let fixture: ComponentFixture<ColorsAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColorsAreaComponent]
    });
    fixture = TestBed.createComponent(ColorsAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
