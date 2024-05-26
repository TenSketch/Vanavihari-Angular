import { GalleryService } from '@/app/gallery.service';
import { environment } from '@/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  guestEmail: string;
  rooms: any[];
  totalGuest: any;
  totalExtraGuests: any;
  totalChildren: any;
  stayDuration: any;
  email: any;
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
  bookingStatus: any;
  showLoader = false;

  api_url: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private galleryService: GalleryService
  ) {
    this.api_url = environment.API_URL;
  }
  // http://localhost:4200/#/booking-status?booking_id=BVJ2405062
  ngOnInit(): void {
    this.showLoader = true;

    this.route.queryParams.subscribe((params) => {
      this.bookingId = params['booking_id'];
    });

    const params = new HttpParams().set('booking_id', this.bookingId ?? '');
    this.http
      .get<any>(this.api_url + '?api_type=booking_detail', { params })
      .subscribe({
        next: (response) => {
          this.showLoader = false;
          if (response.result.payment_transaction_id == '') {
            this.bookingStatus = 'failed';
            let input_str = localStorage.getItem('input_str');
            let username = localStorage.getItem('userfullname');
            if (input_str && username) {
              
              this.logMessage(    
                response.result.booking_id,
                username,
                'request',
                input_str
              );
            }
          } else {
            let input_str = localStorage.getItem('input_str');
            let username = localStorage.getItem('userfullname');

            if (input_str && username) {
              // let modifiedString = input_str.replace(/\|/g, '$');

              this.logMessage(
                response.result.booking_id,
                username,
                'request',
                input_str
              );
            }
            this.bookingStatus = 'success';
          }
          if (response.code == 3000 && response.result.status == 'success') {
            this.showLoader = false;

            setTimeout(() => {
              this.authService.clearBookingRooms(this.bookingTypeResort);
            }, 3000);
            this.reservationDetails = {
              guestName: response.result.guest_name,
              resortName: response.result.resort,
              transactionId: response.result.payment_transaction_id ?? null,
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
              guestEmail: response.result.email,
              rooms: response.result.rooms,
              totalGuest: response.result.total_guest,
              totalExtraGuests: response.result.total_extra_guest,
              totalChildren: response.result.total_children,
              stayDuration: this.durationOfStay(
                response.result.checkin,
                response.result.checkout
              ),
              email: response.result.email,
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
            this.showLoader = false;

            this.bookingStatus = 'failed';
            // alert('Login Error!');
            setTimeout(() => {
              this.authService.clearBookingRooms(this.bookingTypeResort);
              // this.router.navigate(['/home']);
            }, 10 * 1000);
          } else {
            // alert('Login Error!');
            setTimeout(() => {
              this.authService.clearBookingRooms(this.bookingTypeResort);
              // this.router.navigate(['/home']);
            }, 10 * 1000);
          }
        },
        error: (err) => {
          this.showLoader = false;
        },
      });
  }

  //catch logs    
  logMessage(booking_id: string, username: string, type: string, msg: string) {

    // let modifiedString = msg
    // .replace(/\$/g, 'dollar')
    // .replace(/\+/g, 'plus')
    // .replace(/%/g, 'percentage')
    // .replace(/-/g, 'dash')
    // .replace(/_/g, 'underscore')
    // .replace(/\//g, 'fslash')
    // .replace(/:/g, 'colan')
    // .replace(/\?/g, 'qmark');
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams()
      .set('booking_id', booking_id ?? '')
      .set('username', username ?? '')
      .set('type', type ?? '')
      .set('msg', msg ?? '');

    this.http.get(this.api_url + '?api_type=logs', { params }).subscribe({
      next: (response) => {},
    });
  }

  getRoomImages(roomname: string): string[] {
    let roomName = this.getRoomName(roomname);

    const lowercaseRoomName = roomName.toLowerCase();
    switch (lowercaseRoomName) {
      case 'panther':
        return this.galleryService.panther();
      case 'bahuda':
        return this.galleryService.bahuda();
      case 'bear':
        return this.galleryService.bear();
      case 'bonnet':
        return this.galleryService.bonnet();
      case 'bulbul':
        return this.galleryService.bulbul();
      case 'chital':
        return this.galleryService.chital();
      case 'chousingha':
        return this.galleryService.chousingha();
      case 'hornbill':
        return this.galleryService.hornbill();
      case 'kingfisher':
        return this.galleryService.kingfisher();
      case 'pamuleru':
        return this.galleryService.pamuleru();
      case 'narmada':
        return this.galleryService.narmada();
      case 'peacock':
        return this.galleryService.peacock();
      case 'redjunglefowl':
        return this.galleryService.redjunglefowl();
      case 'sambar':
        return this.galleryService.sambar();
      case 'sokuleru':
        return this.galleryService.sokuleru();
      case 'bear':
        return this.galleryService.bear();
      case 'tapathi':
        return this.galleryService.tapathi();
      case 'tribal':
        return this.galleryService.tribal();
      case 'woodpecker':
        return this.galleryService.woodpecker();
      case 'ambara':
        return this.galleryService.ambara();
      case 'aditya':
        return this.galleryService.aditya();
      case 'avani':
        return this.galleryService.avani();
      case 'aranya':
        return this.galleryService.aranya();
      case 'prakruti':
        return this.galleryService.prakruti();
      case 'prana':
        return this.galleryService.prana();
      case 'vanya':
        return this.galleryService.vanya();
      case 'agathi':
        return this.galleryService.agathi();
      case 'vennela':
        return this.galleryService.vennela();
      case 'jabilli':
        return this.galleryService.jabilli();
      default:
        return this.galleryService.panther();

      // Add more cases for other rooms as needed
    }
  }

  getRoomName(room: string): string {
    const index = room.indexOf(',');
    if (index !== -1) {
      return room.substring(0, index);
    }
    return room; // If there's no comma, return the whole string
  }

  durationOfStay(checkin: any, checkout: any) {
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
