import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRequestManualComponent } from './cancel-request-manual.component';

describe('CancelRequestManualComponent', () => {
  let component: CancelRequestManualComponent;
  let fixture: ComponentFixture<CancelRequestManualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelRequestManualComponent]
    });
    fixture = TestBed.createComponent(CancelRequestManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
