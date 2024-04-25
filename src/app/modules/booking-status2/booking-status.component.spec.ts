import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStatusComponent } from './booking-status.component';

describe('BookingSuccessfullComponent', () => {
  let component: BookingStatusComponent;
  let fixture: ComponentFixture<BookingStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingStatusComponent]
    });
    fixture = TestBed.createComponent(BookingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
