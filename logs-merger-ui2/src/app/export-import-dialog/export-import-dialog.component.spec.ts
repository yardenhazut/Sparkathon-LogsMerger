import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportImportDialogComponent } from './export-import-dialog.component';

describe('ExportImportDialogComponent', () => {
  let component: ExportImportDialogComponent;
  let fixture: ComponentFixture<ExportImportDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportImportDialogComponent]
    });
    fixture = TestBed.createComponent(ExportImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
