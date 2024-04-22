import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JungleStarValamuruComponent } from './jungle-star-valamuru.component';

describe('JungleStarValamuruComponent', () => {
  let component: JungleStarValamuruComponent;
  let fixture: ComponentFixture<JungleStarValamuruComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JungleStarValamuruComponent]
    });
    fixture = TestBed.createComponent(JungleStarValamuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
