import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HmacSHA256, enc } from 'crypto-js';
import { map } from 'rxjs/operators';

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

    // this.getUserDetails();
  }
  getUserDetails() {
    
    const params = new HttpParams()
      .set('email', this.authService.getAccountUsername()??'')
      .set('token', this.authService.getAccessToken()??'');
    this.http.get<any>('https://vanavihari.com/zoho-connect?api_type=profile_details', {params}).subscribe({
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
      // this.showSnackBarAlert("Reservation Success! Booking Id");
      //       this.router.navigate(['/booking-successfull']);
      this.http.get<any>('https://vanavihari.com/zoho-connect?api_type=booking', {params}).subscribe({
        next: response => {
          if(response.code == 3000 && response.result.status == 'success') {
            this.authService.clearBookingRooms(this.bookingTypeResort);
            this.showSnackBarAlert("Reservation Success! Booking Id: "+response.result.booking_id);
            // this.router.navigate(['/booking-successfull']);

              console.log(response.result.booking_id);
            
              const bookingId = response.result.booking_id;
              const MerchantId = 'VANAVIHARI';
              const CurrencyType = 'INR';
              const SecurityId = 'vanavihari';
              const txtCustomerID = 'BK986239234';
              const secretKey = 'rmvlozE7R4v9';
              const amount = 1;
              const rU = 'https://vanavihari.com/zoho-connect?api_type=get_payment_response';

              const str = MerchantId+'|'+bookingId+'|NA|'+amount+'|NA|NA|NA|'+CurrencyType+'|NA|R|'+SecurityId+'|NA|NA|F|NA|NA|NA|NA|NA|NA|NA|'+rU+'&' + Date.now().toFixed().substring(0, 10);

              const hmac = HmacSHA256(str, secretKey);
              const checksum = hmac.toString().toUpperCase();
              const msg = `${str}|${checksum}`;

              let pg_params = new HttpParams()
              .set('MerchantId', MerchantId)
              .set('CurrencyType', CurrencyType)
              .set('SecurityId', SecurityId)
              .set('txtCustomerID', txtCustomerID)
              .set('txtTxnAmount', amount)
              .set('txtAdditionalInfo1', bookingId)
              .set('txtAdditionalInfo2', this.form.value.gname)
              .set('txtAdditionalInfo3', this.form.value.gphone)
              .set('RU', rU)
              .set('CheckSumKey', secretKey)
              .set('CheckSum', checksum)
              .set('msg', msg);

              const form = document.createElement('form');
              form.method = 'post';
              form.action = 'https://pgi.billdesk.com/pgidsk/PGIMerchantPayment';
              pg_params.keys().forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                const value = pg_params.get(key) || '';
                input.value = value;
                form.appendChild(input);
              });
              document.body.appendChild(form);
              form.submit();


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






  
  
  generateJWSToken() {
    const clientID = "bduatv2apt";
    const secretKey = "DnVd1pJpk3oFOdjNgRRPT1OgwfH1DYku";

    const jwsHeader = JSON.stringify({
      "alg": "HS256",
      "clientid": clientID
    });

    const jwsPayload = JSON.stringify({
      "mercid": "BDUATV2APT",
      "orderid": "order45608988",
      "amount": "300.00",
      "order_date": "2023-07-16T10:59:15+05:30",
      "currency": "356",
      "ru": "https://www.merchant.com/",
      "additional_info": {
        "additional_info1": "Details1",
        "additional_info2": "Details2"
      },
      "itemcode": "DIRECT",
      "device": {
        "init_channel": "internet",
        "ip": "75.2.60.5",
        "user_agent": "Mozilla/5.0(WindowsNT10.0;WOW64;rv:51.0)Gecko/20100101 Firefox/51.0",
        "accept_header": "text/html",
        "fingerprintid": "61b12c18b5d0cf901be34a23ca64bb19",
        "browser_tz": "-330",
        "browser_color_depth": "32",
        "browser_java_enabled": "false",
        "browser_screen_height": "601",
        "browser_screen_width": "657",
        "browser_language": "en-US",
        "browser_javascript_enabled": "true"
      }
    });

    const base64UrlHeader = this.urlBase64Encode(jwsHeader);
    const base64UrlPayload = this.urlBase64Encode(jwsPayload);

    const unsignedToken = base64UrlHeader + "." + base64UrlPayload;

    // Calculate HMACSHA256 signature
    const signature = HmacSHA256(unsignedToken, secretKey);
    const base64UrlSignature = this.urlBase64Encode(signature.toString());
    console.log(base64UrlSignature);
    
    
    const jwsToken = base64UrlHeader + "." + base64UrlPayload + "." + base64UrlSignature;
    console.log(jwsToken); // Print JWS Token

    // Make the POST request
    const apiUrl = "https://uat1.billdesk.com/u2/payments/ve1_2/orders/create";
    const headers = new HttpHeaders({
      "Content-Type": "application/jose",
      "Accept": "application/jose",
      "BD-Traceid": "20200817132207ABD1K",
      "BD-Timestamp": String(Math.floor(Date.now() / 1000)) // Current Unix timestamp
    });

    this.http.post(apiUrl, jwsToken, { headers }).subscribe(
      (response) => {
        console.log("API Response:", response);
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }

  urlBase64Encode(str: string) {
    let encodedStr = btoa(str).replace(/\+/g, '-').replace(/\//g, '_');
    const padding = '='.repeat((4 - encodedStr.length % 4) % 4);
    return encodedStr + padding;
  }
}
