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
  showLoader = false

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private authService:AuthService
  ) {
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
    this.isModalVisible = true;
  }

  cancelTriggerModal() {
    this.isModalVisible = false;
  }

  confirmCancellation() {
    // Logic to handle the cancellation request submission
    console.log('Cancellation reason:', this.form.value.reason);
    console.log('Cancellation details:', this.form.value.details);
    // this.showLoader = true;
    const params = new HttpParams()
    .set('email', this.authService.getAccountUsername() ?? '')
    .set('token', this.authService.getAccessToken() ?? '')
    .set('booking_id', this.currentBooking_id ?? '')
    .set('more_details', this.form.value.details ?? '')

    .set('cancel_reason', this.form.value.reason ?? '');

    this.http.post<any>(`${this.api_url}?api_type=cancel_init`, params)
      .subscribe({
        next: (response: any) => {
          // this.showLoader = false; // Uncomment if you have a loader
          this.isDialogOpen = false;
          console.log(response);
        },
        error: (err) => {
          console.error(err);
          // this.showLoader = false; // Uncomment if you have a loader
          this.isDialogOpen = false;
        }
      });
  }

  closeDialog() {
    this.isDialogOpen = false;
  }
}
