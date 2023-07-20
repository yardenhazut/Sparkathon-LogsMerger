import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiDialogComponent } from './ai-dialog.component';

describe('AiDialogComponent', () => {
  let component: AiDialogComponent;
  let fixture: ComponentFixture<AiDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiDialogComponent]
    });
    fixture = TestBed.createComponent(AiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
