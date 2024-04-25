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
  bookingId: any;

  bookingTypeResort: any;
  bookingStatus : any;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.bookingId = params['booking_id'];
    });

    const params = new HttpParams().set('booking_id', this.bookingId ?? '');
    this.http
      .get<any>(
        'https://vanavihari.com/zoho-connect?api_type=booking_detail',
        { params }
      )
      .subscribe({
        next: (response) => {
          if (response.code == 3000 && response.result.status == 'success') {
            this.bookingStatus = 'success'
            setTimeout(() => {
              localStorage.clear();
            }, 3000);
            this.reservationDetails = {
              guestName: response.result.name,
              resortName: this.bookingTypeResort,
              resortLocation: 'Jungle Star, Valamuru',
              bookingId: response.result.booking_id,
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
            
            // this.reservationDetails = {
            //   guestName: response.result.name,
            //   resortName: this.bookingId,
            //   resortLocation: 'Jungle Star, Valamuru',
            //   bookingId: 'BJ2404971',
            //   checkInDate: this.authService.getSearchData('checkin'),
            //   checkOutDate: this.authService.getSearchData('checkout'),
            //   amount: 'INR 11000',
            //   upiId: 'QR917382151617-5587@unionbankofindia',
            //   qrCodeUrl: '1711639164121_qr2.pdf',
            //   contactPerson: 'Mr. Veerababu',
            //   contactNumber: '+919494151617',
            //   contactEmail: 'info@vanavihari.com',
            //   guestEmail:response.result.email

            // };
          } else if (response.code == 3000) {
            this.userService.clearUser();
            this.bookingStatus = 'failed'
            alert('Login Error!');
            // this.router.navigate(['/home']);
          } else {
            this.bookingStatus = 'failed'

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
