import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStatusTestComponent } from './booking-status-test.component';

describe('BookingStatusTestComponent', () => {
  let component: BookingStatusTestComponent;
  let fixture: ComponentFixture<BookingStatusTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingStatusTestComponent]
    });
    fixture = TestBed.createComponent(BookingStatusTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
