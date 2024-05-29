import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRoomComponent } from './test-room.component';

describe('TestRoomComponent', () => {
  let component: TestRoomComponent;
  let fixture: ComponentFixture<TestRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestRoomComponent]
    });
    fixture = TestBed.createComponent(TestRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
