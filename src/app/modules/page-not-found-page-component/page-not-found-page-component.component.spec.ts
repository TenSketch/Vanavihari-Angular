import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundPageComponentComponent } from './page-not-found-page-component.component';

describe('PageNotFoundPageComponentComponent', () => {
  let component: PageNotFoundPageComponentComponent;
  let fixture: ComponentFixture<PageNotFoundPageComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotFoundPageComponentComponent]
    });
    fixture = TestBed.createComponent(PageNotFoundPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
