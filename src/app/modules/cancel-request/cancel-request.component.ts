import { AuthService } from '@/app/auth.service';
import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['./cancel-request.component.scss'],
})
export class CancelRequestComponent {
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
  captchaResponse: string | null = null;
  isDialogOpen = true;
  currentBooking_id: any;
  api_url: any;
  showLoader = false;

  totalAmount: any;
  currentDate: any;
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
    this.Payment_Transaction_Id = localStorage.getItem(
      'Payment_Transaction_Id'
    );

    this.form = this.fb.group({
      reason: ['', Validators.required],
      details: ['', Validators.required],
    });
    this.currentBooking_id = localStorage.getItem('current_id');
    this.api_url = environment.API_URL;
  }

  resolvedCaptcha(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
  }

  goBack() {
    this.router.navigateByUrl('my-account/my-bookings');
  }

  submitCancellation() {
    if (this.form.valid && this.captchaResponse) {
      this.isDialogOpen = true;
    }
  }

  triggerModal() {
    this.showLoader = true
    setTimeout(() => {
      this.showLoader = false
      this.isModalVisible = true;
    }, 1000);
  }

  cancelTriggerModal() {
    this.isModalVisible = false;
  }

  

  confirmCancellation() {
    // Logic to handle the cancellation request submission
    this.showLoader = true;
    const refundableAmount = this.calculateAmount(
      this.getCheckInDate(),
      this.totalAmount
    ).toFixed(2);
    const formattedDateTimeStr = this.getformattedDateTimeStr();
    const uniqueKey = this.generateUniqueKey();
    const Payment_Transaction_Date = this.getpaymentTransactionDate();
    let params = {
      email: this.authService.getAccountUsername() ?? '',
      token: this.authService.getAccessToken() ?? '',
      booking_id1: this.currentBooking_id ?? '',
      more_details: this.form.value.details ?? '',
      cancel_reason: this.form.value.reason ?? '',
      refundableAmount: refundableAmount,
      uniqueKey: uniqueKey,
      formattedDateTimeStr: formattedDateTimeStr,
      Payment_Transaction_Amt: this.totalAmount,
      Payment_Transaction_Date: Payment_Transaction_Date,
      Payment_Transaction_Id: this.Payment_Transaction_Id,
      refund_percent: this.refund_percent,
    };
    console.log('params', params);
    this.http
      .post<any>(`${this.api_url}?api_type=cancel_init`, params)
      .subscribe({
        next: (response: any) => {
          this.showLoader = false;
          let refunddata = {
            refund_percent: this.refund_percent,
            refundableAmount: refundableAmount,
            totalAmount: this.totalAmount,
            date: new Date(),
          };

          let refundData = JSON.stringify(refunddata);

          localStorage.setItem('refunddata', refundData);

          this.router.navigate(['/cancel-status']);
        },
        error: (err) => {
          this.router.navigate(['/cancel-status']);
          this.showLoader = false;
        },
      });

    if (this.calculateAmount(this.getCheckInDate(), this.totalAmount) == 0) {
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 4000);
    }
  }

  calculateAmount(checkinDate: string, totalAmount: number): number {
    // Parse checkinDate from the format YYYY-MM-DD
    const [year, month, day] = checkinDate.split('-').map(Number);

    // Create Date object with the check-in date set to 10am
    const fcheckinDate = new Date(year, month - 1, day, 10, 0, 0); // month is zero-based

    // Use current system date
    const currentDate = new Date();

    // Set current date with time to 10am
    const currentDateWithTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds()
    );
    console.log('fcheckinDate', fcheckinDate);
    console.log('current time', currentDateWithTime);
    // Calculate the time difference in milliseconds
    const timeDifference =
      fcheckinDate.getTime() - currentDateWithTime.getTime();
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    console.log('day-difference', dayDifference);

    let refundableAmount = 0;

    // Calculate refundable amount based on day difference
    if (dayDifference >= 2) {
      this.refund_percent = 90;
      refundableAmount = (totalAmount * 90) / 100;
    } else if (dayDifference >= 1 && dayDifference < 2) {
      this.refund_percent = 80;
      refundableAmount = (totalAmount * 80) / 100;
    } else {
      this.refund_percent = 0;
      refundableAmount = 0;
    }

    // Ensure the refundable amount is a floating-point number with two decimal places
    return parseFloat(refundableAmount.toFixed(2));
  }

  generateUniqueKey() {
    // Get the current timestamp in milliseconds
    const timestamp = Date.now();

    // Convert the timestamp to a string
    let timestampStr = timestamp.toString();

    // Ensure the timestamp is 13 digits long
    if (timestampStr.length > 13) {
      timestampStr = timestampStr.slice(0, 13);
    } else if (timestampStr.length < 13) {
      const padding = '0'.repeat(13 - timestampStr.length);
      timestampStr = timestampStr + padding;
    }

    return timestampStr;
  }

  getformattedDateTimeStr() {
    const currentDateTime = new Date();

    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

    const formattedDateTimeStr = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return formattedDateTimeStr;
  }

  getpaymentTransactionDate(): any {
    const paymentTransactionDateStr = localStorage.getItem(
      'Payment_Transaction_Date'
    );

    if (paymentTransactionDateStr) {
      // Parse the Payment_Transaction_Date string
      const [datePart] = paymentTransactionDateStr.split(' ');
      const [day, month, year] = datePart.split('-').map(Number);

      // Format the date in YYYYMMDD format
      const formattedDate = `${year}${String(month).padStart(2, '0')}${String(
        day
      ).padStart(2, '0')}`;
      return formattedDate;
    }

    return null;
  }

  getCheckInDate(): any {
    const paymentTransactionDateStr = localStorage.getItem('booking_checkin');

    if (paymentTransactionDateStr) {
      // Parse the Payment_Transaction_Date string
      // const [datePart] = paymentTransactionDateStr.split(' ');
      // const [day, month, year] = datePart.split('-').map(Number);

      // Format the date in YYYYMMDD format
      // const formattedDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
      // console.log(formattedDate)

      return paymentTransactionDateStr;
    }

    return null;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }
}
