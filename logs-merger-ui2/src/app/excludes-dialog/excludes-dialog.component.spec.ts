import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcludesDialogComponent } from './excludes-dialog.component';

describe('ExcludesDialogComponent', () => {
  let component: ExcludesDialogComponent;
  let fixture: ComponentFixture<ExcludesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExcludesDialogComponent]
    });
    fixture = TestBed.createComponent(ExcludesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
