import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSuccessfullComponent } from './booking-successfull.component';

describe('BookingSuccessfullComponent', () => {
  let component: BookingSuccessfullComponent;
  let fixture: ComponentFixture<BookingSuccessfullComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingSuccessfullComponent]
    });
    fixture = TestBed.createComponent(BookingSuccessfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
