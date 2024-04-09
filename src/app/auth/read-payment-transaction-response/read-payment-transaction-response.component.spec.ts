import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadPaymentTransactionResponseComponent } from './read-payment-transaction-response.component';

describe('ReadPaymentTransactionResponseComponent', () => {
  let component: ReadPaymentTransactionResponseComponent;
  let fixture: ComponentFixture<ReadPaymentTransactionResponseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadPaymentTransactionResponseComponent]
    });
    fixture = TestBed.createComponent(ReadPaymentTransactionResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
