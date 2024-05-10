import { AuthService } from '@/app/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  bookingTypeResort: string;
  showCancelBtn:any = true
  constructor(private authService: AuthService) {
    let status = localStorage.getItem('showCancel')
    if(status == 'no'){
      this.showCancelBtn = false
    }
    if(status == 'yes'){
      this.showCancelBtn = true
    }
  }

  clearData() {
    localStorage.setItem('showCancel','yes')
    this.authService.clearBookingRooms(this.bookingTypeResort);
  }


}
