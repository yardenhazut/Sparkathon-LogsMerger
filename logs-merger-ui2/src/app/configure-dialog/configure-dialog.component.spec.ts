import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureDialogComponent } from './configure-dialog.component';

describe('ConfigureDialogComponent', () => {
  let component: ConfigureDialogComponent;
  let fixture: ComponentFixture<ConfigureDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigureDialogComponent]
    });
    fixture = TestBed.createComponent(ConfigureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
