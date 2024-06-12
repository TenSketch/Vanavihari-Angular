import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['./cancel-request.component.scss']
})
export class CancelRequestComponent {
  form: FormGroup;
  isModalVisible = false
  reasons: string[] = [
    'Plans changed',
    'Personal reasons',
    'Found another resort',
    'Want to postpone',
    'Budget constraints',
    'Booking error',
    'Health concerns',
    'Other (please specify)'
  ];
  captchaResponse: string | null = null;
  isDialogOpen = true;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private router: Router) {
    this.form = this.fb.group({
      reason: ['', Validators.required],
      details: ['', Validators.required]
    });
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

  triggerModal(){
    this.isModalVisible = true
  }

  cancelTriggerModal(){
    this.isModalVisible = false
  } 
  
  confirmCancellation() {
    // Logic to handle the cancellation request submission
    console.log('Cancellation reason:', this.form.value.reason);
    console.log('Cancellation details:', this.form.value.details);
    this.isDialogOpen = false;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

}
