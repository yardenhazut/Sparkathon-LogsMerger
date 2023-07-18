import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAreaComponent } from './search-area.component';

describe('SearchAreaComponent', () => {
  let component: SearchAreaComponent;
  let fixture: ComponentFixture<SearchAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAreaComponent]
    });
    fixture = TestBed.createComponent(SearchAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
