import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';

interface ReservationDetails {
  guestName: string;
  resortName: string;
  resortLocation: string;
  bookingId: string;
  checkInDate: string;
  checkOutDate: string;
  amount: string;
  upiId: string;
  qrCodeUrl: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  guestEmail:string
}

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss'],
})
export class BookingStatusComponent {
  reservationDetails: ReservationDetails = {} as ReservationDetails;
  bookingTypeResort: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.bookingTypeResort = params['bookingTypeResort'];
    });

    const params = new HttpParams()
      .set('email', this.authService.getAccountUsername() ?? '')
      .set('token', this.authService.getAccessToken() ?? '');
    this.http
      .get<any>(
        'https://vanavihari.com/zoho-connect?api_type=profile_details',
        { params }
      )
      .subscribe({
        next: (response) => {
          if (response.code == 3000 && response.result.status == 'success') {
            this.reservationDetails = {
              guestName: response.result.name,
              resortName: this.bookingTypeResort,
              resortLocation: 'Jungle Star, Valamuru',
              bookingId: 'BJ2404971',
              checkInDate: this.authService.getSearchData('checkin'),
              checkOutDate: this.authService.getSearchData('checkout'),
              amount: 'INR 11000',
              upiId: 'QR917382151617-5587@unionbankofindia',
              qrCodeUrl: '1711639164121_qr2.pdf',
              contactPerson: 'Mr. Veerababu',
              contactNumber: '+919494151617',
              contactEmail: 'info@vanavihari.com',
              guestEmail:response.result.email

            };
          } else if (response.code == 3000) {
            this.userService.clearUser();
            alert('Login Error!');
            // this.router.navigate(['/home']);
          } else {
            this.userService.clearUser();
            alert('Login Error!');
            // this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
  }
}
