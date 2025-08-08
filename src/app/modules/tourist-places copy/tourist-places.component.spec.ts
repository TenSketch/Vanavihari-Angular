import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristPlacesComponent } from './tourist-places.component';

describe('TouristPlacesComponent', () => {
  let component: TouristPlacesComponent;
  let fixture: ComponentFixture<TouristPlacesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TouristPlacesComponent]
    });
    fixture = TestBed.createComponent(TouristPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
