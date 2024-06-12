import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBookingsComponent } from './test-bookings.component';

describe('TestBookingsComponent', () => {
  let component: TestBookingsComponent;
  let fixture: ComponentFixture<TestBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestBookingsComponent]
    });
    fixture = TestBed.createComponent(TestBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
