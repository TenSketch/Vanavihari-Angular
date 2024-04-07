import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss']
})
export class BookingSummaryComponent {
  form: FormGroup;
  adultsCount: number = 1;
  guestCount: number = 0;
  roomsCount: number = 1;
  roomDetails: any[];
  checkInDate: string;
  checkOutDate: string;
  durationOfStay: string = '';
  seslectedResort: string;
  getFullUser: string;
  maxAdultCount: number = 2;
  totalPrice: number = 0;
  totalGSTPrice: number = 0;
  bookingTypeResort:string;
  roomGuestDetails: any[] = [];
  constructor(private router: Router, private authService: AuthService, private http: HttpClient, private formBuilder: FormBuilder, private userService: UserService, private snackBar: MatSnackBar,private route: ActivatedRoute) {
    this.roomDetails = this.authService.getBookingRooms("vanvihari");
    if(this.roomDetails.length > 0) {
      this.adultsCount = 0;
      this.guestCount = 0;
      this.totalPrice = 0;
      this.totalGSTPrice = 0;
      for (const room of this.roomDetails) {
        if(parseInt(room.noof_guest)>0) {
          this.roomGuestDetails.push(room.id, room.noof_guest);
        }
        this.adultsCount += parseInt(room.noof_adult);
        this.guestCount += parseInt(room.noof_guest);

        this.totalPrice += parseInt(room.week_day_rate+(room.noof_guest*room.week_day_bed_charge));
        this.totalGSTPrice += (parseInt(room.week_day_rate+(room.noof_guest*room.week_day_bed_charge))*12)/100;
      }
    }
    
    this.form = this.formBuilder.group({
      gname: [''],
      gphone: [''],
      gemail: ['', Validators.email],
      gaddress: [''],
      gcity: [''],
      gstate: [''],
      gpincode: [''],
      gcountry: ['']
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingTypeResort = params['bookingTypeResort'];
    })
    this.checkInDate = this.authService.getSearchData('checkin');
    this.checkOutDate = this.authService.getSearchData('checkout');
    this.seslectedResort = this.authService.getSearchData('resort');

    const startDate = this.parseDate(this.checkInDate);
    const endDate = this.parseDate(this.checkOutDate);
    const durationMs = endDate.getTime() - startDate.getTime();
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    // const weeks = Math.floor(durationMs / (1000 * 60 * 60 * 24 * 7));
    this.durationOfStay = `${days} day${days>1?'s':''}`;

    this.getFullUser = this.userService.getFullUser();
    
    const params = new HttpParams()
      .set('email', this.authService.getAccountUsername()??'')
      .set('token', this.authService.getAccessToken()??'');
    this.http.get<any>('https://vanavihari-ng.netlify.app/zoho-connect?api_type=profile_details', {params}).subscribe({
      next: response => {
        if(response.code == 3000 && response.result.status == 'success') {
          this.form = this.formBuilder.group({
            gname: [response.result.name],
            gphone: [response.result.phone],
            gemail: [response.result.email, Validators.email],
            dob: [response.result.dob, Validators.required],
            nationality: [response.result.nationality],
            gaddress: [response.result.address1],
            address2: [response.result.address2],
            gcity: [response.result.city],
            gstate: [response.result.state],
            gpincode: [response.result.pincode],
            gcountry: [response.result.country]
          });
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
      error: err => {
        console.error('Error:', err);
      }
    });


  }
  parseDate(dateString: string): Date {
    const parts = dateString.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthIndex = months.findIndex(m => m === parts[1]);
    const day = parseInt(parts[0], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, monthIndex, day);
  }
  
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
  gotToLogin() {
    this.router.navigate(['/sign-in']);
  }
  goToVanavihari() {
    this.router.navigate(['/resorts/vanavihari-maredumilli']);
  }
  submitBooking() {
    let room_ids = (this.authService.getBookingRooms(this.bookingTypeResort)).map((room: { id: any; }) => room.id).join(',');
     if(this.form.valid) {
      let params = new HttpParams()
      .set('email', this.authService.getAccountUsername()??'')
      .set('token', this.authService.getAccessToken()??'')
      .set('checkin', this.checkInDate)
      .set('checkout', this.checkOutDate)
      .set('resort', this.seslectedResort)
      .set('selected_rooms', room_ids)
      .set('room_guest_details', this.roomDetails.map(item => `${item.id}-${item.noof_guest}`).join(','))
      .set('noof_adult', this.adultsCount)
      .set('noof_guest', this.guestCount);
      Object.keys(this.form.value).forEach((key) => {
        params = params.append(key, this.form.value[key]);
      });
      this.showSnackBarAlert("Reservation Success! Booking Id");
            this.router.navigate(['/booking-successfull']);
      this.http.get<any>('https://vanavihari-ng.netlify.app/zoho-connect?api_type=booking', {params}).subscribe({
        next: response => {
          if(response.code == 3000 && response.result.status == 'success') {
            this.authService.clearBookingRooms(this.bookingTypeResort);
            this.showSnackBarAlert("Reservation Success! Booking Id: "+response.result.booking_id);
            this.router.navigate(['/booking-successfull']);
          } else if (response.code == 3000) {
            this.showSnackBarAlert(response.result.msg);
          } else {
            this.showSnackBarAlert("Reservation Error!");
          }
        },
        error: err => {
          console.error('Error:', err);
        }
      });
     }
  }
  showSnackBarAlert(msg = '') {
    var snackBar = this.snackBar.open(msg, 'Close', {
      duration: 3000,
    });
  }
}
