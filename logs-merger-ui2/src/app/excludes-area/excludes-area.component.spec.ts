import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcludesAreaComponent } from './excludes-area.component';

describe('ExcludesAreaComponent', () => {
  let component: ExcludesAreaComponent;
  let fixture: ComponentFixture<ExcludesAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExcludesAreaComponent]
    });
    fixture = TestBed.createComponent(ExcludesAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
