import { AuthService } from '@/app/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  bookingTypeResort: string;

  constructor(private authService: AuthService) {}

  clearData() {
    this.authService.clearBookingRooms(this.bookingTypeResort);
  }
}
