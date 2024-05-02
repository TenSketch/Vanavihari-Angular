import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';

interface ReservationDetails {
  guestName: string;
  resortName: string;
  transactionId: string;
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
  guestEmail:string;
  rooms:any[];
  totalGuest:any;
  stayDuration:any;
  email:any;
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
  showLoader = false

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.showLoader = true

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
          this.showLoader = false
          if(response.result.payment_transaction_id == ''){
            this.bookingStatus = 'failed'
          }
          else{
            this.bookingStatus = 'success'

          }
          if (response.code == 3000 && response.result.status == 'success') {
            this.showLoader = false

            setTimeout(() => {
              localStorage.clear();
            }, 3000);
            this.reservationDetails = {
              guestName: response.result.guest_name,
              resortName: this.bookingTypeResort,
              transactionId: response.result.payment_transaction_id??null,
              resortLocation: 'Jungle Star, Valamuru',
              bookingId: response.result.booking_id,
              checkInDate: response.result.checkin,
              checkOutDate: response.result.checkout,
              amount: response.result.payment_transaction_amt,
              upiId: 'QR917382151617-5587@unionbankofindia',
              qrCodeUrl: '1711639164121_qr2.pdf',
              contactPerson: 'Mr. Veerababu',
              contactNumber: '+919494151617',
              contactEmail: 'info@vanavihari.com',
              guestEmail:response.result.email,
              rooms:response.result.rooms,
              totalGuest: response.result.total_guest,
              stayDuration: this.durationOfStay(response.result.checkin,response.result.checkout),
              email:response.result.email
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
            this.showLoader = false

            this.userService.clearUser();
            this.bookingStatus = 'failed'
            // alert('Login Error!');
            setTimeout(() => {
              localStorage.clear();
              this.router.navigate(['/home']);
            }, 10 * 1000); 
          } else {

            this.userService.clearUser();
            // alert('Login Error!');
            setTimeout(() => {
              localStorage.clear();
              this.router.navigate(['/home']);
            }, 10 * 1000);           }
        },
        error: (err) => {
          this.showLoader = false

          console.error('Error:', err);
        },
      });
  }

  durationOfStay(checkin:any,checkout:any){
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    // Set hours, minutes, seconds, and milliseconds to zero for both dates
    checkinDate.setHours(0, 0, 0, 0);
    checkoutDate.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const timeDifferenceMs = checkoutDate.getTime() - checkinDate.getTime();

    // Convert milliseconds to days and round up to the nearest whole number
    const durationDays = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24));
    return durationDays;

  }
}
