import { Component } from '@angular/core';
import { AuthService } from '@/app/auth.service';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-request-manual',
  templateUrl: './cancel-request-manual.component.html',
  styleUrls: ['./cancel-request-manual.component.scss'],
})
export class CancelRequestManualComponent {
  form: FormGroup;
  isModalVisible = false;
  reasons: string[] = [
    'Plans changed',
    'Personal reasons',
    'Found another resort',
    'Want to postpone',
    'Budget constraints',
    'Booking error',
    'Health concerns',
    'Other (please specify)',
  ];
  isDialogOpen = true;
  currentBooking_id: any;
  api_url: any;
  showLoader = false;

  totalAmount: any;
  Payment_Transaction_Id: any;
  showMessage = false;
  refund_percent: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.totalAmount = localStorage.getItem('Payment_Transaction_Amt');
    this.Payment_Transaction_Id = localStorage.getItem('Payment_Transaction_Id');

    this.form = this.fb.group({
      reason: ['', Validators.required],
      details: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      refund_per: ['', Validators.required],
    });

    this.currentBooking_id = localStorage.getItem('current_id');
    this.api_url = environment.API_URL;
  }

  goBack() {
    this.router.navigateByUrl('my-account/my-bookings');
  }

  submitCancellation() {
    if (this.form.valid) {
      this.triggerModal();
    }
  }

  triggerModal() {
    this.isModalVisible = true;
  }

  cancelTriggerModal() {
    this.isModalVisible = false;
  }

  confirmCancellation() {
    this.showLoader = true;

    const refundableAmount = parseFloat(
      this.form.value.amount.replace(/,/g, '')
    ).toFixed(2);
    const formattedDateTimeStr = this.getformattedDateTimeStr();
    const uniqueKey = this.generateUniqueKey();
    const Payment_Transaction_Date = this.getpaymentTransactionDate();

    const params = {
      email1: this.authService.getAccountUsername() ?? '',
      token1: this.authService.getAccessToken() ?? '',
      booking_id11: this.currentBooking_id ?? '',
      more_details1: this.form.value.details ?? '',
      cancel_reason1: this.form.value.reason ?? '',
      refundableAmount1: refundableAmount,
      uniqueKey1: uniqueKey,
      formattedDateTimeStr1: formattedDateTimeStr,
      Payment_Transaction_Amt1: parseFloat(this.totalAmount).toFixed(2),
      Payment_Transaction_Date1: Payment_Transaction_Date,
      Payment_Transaction_Id1: this.Payment_Transaction_Id,
      refund_percent1: this.form.value.refund_per,
    };

    console.log('params', params);

    this.http
      .post<any>(`${this.api_url}?api_type=manual_cancel_init`, params)
      .subscribe({
        next: (response: any) => {
          this.showLoader = false;

          const refunddata = {
            refund_percent: this.refund_percent,
            refundableAmount: this.form.value.amount,
            totalAmount: this.totalAmount,
            date: new Date(),
          };

          localStorage.setItem('refunddata', JSON.stringify(refunddata));
          this.router.navigate(['/cancel-status']);
        },
        error: (err) => {
          this.router.navigate(['/cancel-status']);
          this.showLoader = false;
        },
      });

    if (refundableAmount === '0.00') {
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 4000);
    }
  }

  generateUniqueKey() {
    const timestamp = Date.now();
    return timestamp.toString().padEnd(13, '0');
  }

  getformattedDateTimeStr() {
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  getpaymentTransactionDate() {
    const paymentTransactionDateStr = localStorage.getItem('Payment_Transaction_Date');
    if (paymentTransactionDateStr) {
      const [day, month, year] = paymentTransactionDateStr.split('-').map(Number);
      return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    }
    return null;
  }

  getCheckInDate() {
    const checkInDateStr = localStorage.getItem('booking_checkin');
    return checkInDateStr ?? null;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }
}
