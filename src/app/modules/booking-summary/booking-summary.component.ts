import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HmacSHA256, enc } from 'crypto-js';

interface RoomData {
  Week_Days_Rate: string;
  Charges_per_Bed_Week_Days: string;
  Charges_per_Bed_Week_End: string;
  Cottage_Type: string;
  Room_Id: string;
  Room_Image: string;
  Max_Allowed_Guest: string;
  ID: string;
  Week_End_Rate: string;
  Max_Allowed_Adult: string;
  Select_Resort: string;
  Room_Name: string;
  is_button_disabled: boolean;
  isExtraGuestChecked: boolean; // or whatever the type of isExtraGuestChecked is

  // Add more properties as needed
}

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})

export class BookingSummaryComponent {
  formattedCheckinDate: { day: number, month: string, year: number };
  formattedCheckoutDate: { day: number, month: string, year: number };
  form: FormGroup;
  adultsCount: number = 1;
  guestCount: number = 0;
  roomsCount: number = 1;
  roomDetails: any[];
  checkInDate: string;
  checkOutDate: string;
  durationOfStay: any;
  seslectedResort: string;
  getFullUser: string;
  maxAdultCount: number = 2;
  totalPrice: number = 0;
  totalGSTPrice: number = 0;
  bookingTypeResort: string;
  roomGuestDetails: any[] = [];
  // me
  summaryData: any;
  resortName: any;
  roomData: RoomData[] = [];
  roomNamesWithGuests: any[] = [];
  guestDetails: any[];
  totalGuests: any;
  extra_guests: any;
  extra_children : any;
  grandTotal:any
  room_ids:any
  // checkinDate: Date;
  // checkoutDate: Date;
  cardData: any[]=[]
  selectedResort:any
  checkinDate:any
  checkoutDate:any

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.selectedResort = this.authService.getSearchData('resort');
    this.checkinDate = this.authService.getSearchData('checkin');
      this.checkoutDate = this.authService.getSearchData('checkout');
      // this.fetchRoomList();

    this.roomDetails = this.authService.getBookingRooms('vanvihari');
    if (this.roomDetails.length > 0) {
      this.adultsCount = 0;
      this.guestCount = 0;
      this.totalPrice = 0;
      this.totalGSTPrice = 0;
      for (const room of this.roomDetails) {
        if (parseInt(room.noof_guest) > 0) {
          this.roomGuestDetails.push(room.id, room.noof_guest);
        }
        this.adultsCount += parseInt(room.noof_adult);
        this.guestCount += parseInt(room.noof_guest);

        this.totalPrice += parseInt(
          room.week_day_rate + room.noof_guest * room.week_day_bed_charge
        );
        this.totalGSTPrice +=
          (parseInt(
            room.week_day_rate + room.noof_guest * room.week_day_bed_charge
          ) *
            12) /
          100;
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
      gcountry: [''],
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.bookingTypeResort = params['bookingTypeResort'];
    });
    this.checkInDate = this.authService.getSearchData('checkin');
    this.checkOutDate = this.authService.getSearchData('checkout');
    this.seslectedResort = this.authService.getSearchData('resort');

    const startDate = (new Date(this.checkInDate));
    const endDate = (new Date(this.checkOutDate));

    this.formattedCheckinDate = this.parseDate(new Date(this.checkInDate));
    this.formattedCheckoutDate = this.parseDate(new Date(this.checkOutDate))
    // this.checkOutDate = endDate
    
    const durationMs = endDate.getTime() - startDate.getTime();
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    // const weeks = Math.floor(durationMs / (1000 * 60 * 60 * 24 * 7));
    this.durationOfStay = `${days} day${days > 1 ? 's' : ''}`;

    this.getFullUser = this.userService.getFullUser();

    this.getUserDetails();
  }

  isModalVisible: boolean = false;

  triggerModal() {
    this.isModalVisible = true;
  }

  onCancel() {
    this.isModalVisible = false;
    // window.location.reload(); // Reload the page
  }

  onConfirm() {
    this.isModalVisible = false;
    this.router.navigate(['/resorts/rooms']);

  }

  getUserDetails() {
    // const params = new HttpParams()
    //   .set('email', this.authService.getAccountUsername() ?? '')
    //   .set('token', this.authService.getAccessToken() ?? '');
    // this.http
    //   .get<any>(
    //     'https://vanavihari.com/zoho-connect?api_type=profile_details',
    //     { params }
    //   )
    //   .subscribe({
    //     next: (response) => {
    //       if (response.code == 3000 && response.result.status == 'success') {
    //         this.form = this.formBuilder.group({
    //           gname: [response.result.name],
    //           gphone: [response.result.phone],
    //           gemail: [response.result.email, Validators.email],
    //           dob: [response.result.dob, Validators.required],
    //           nationality: [response.result.nationality],
    //           gaddress: [response.result.address1],
    //           address2: [response.result.address2],
    //           gcity: [response.result.city],
    //           gstate: [response.result.state],
    //           gpincode: [response.result.pincode],
    //           gcountry: [response.result.country],
    //         });
    //       } else if (response.code == 3000) {
    //         this.userService.clearUser();
    //         alert('Login Error!');
    //         // this.router.navigate(['/home']);
    //       } else {
    //         this.userService.clearUser();
    //         alert('Login Error!');
    //         // this.router.navigate(['/home']);
    //       }
    //     },
    //     error: (err) => {
    //       console.error('Error:', err);
    //     },
    //   });
  }

  parseDate(date: Date): { day: number, month: string, year: number } {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return {
      day: day,
      month: months[monthIndex],
      year: year
    };
  }

  //   fetchRoomList() {
  //     let tempResort = this.selectedResort;
  //     if (this.selectedResort == 'Jungle Star, Valamuru') {
  //       tempResort = 'junglestar';
  //     }
  //     if (this.selectedResort == 'Vanavihari, Maredumilli') {
  //       tempResort = 'vanavihari';
  //     }
  
  //     let perm = '';
  //     perm += `&resort=${tempResort}`;
  
  //     // Concatenate checkin date parameter
  //     perm += `&checkin=${this.convertDateFormat(this.checkinDate?.toString())}`;
  
  //     // Concatenate checkout date pa rameter
  //     perm += `&checkout=${this.convertDateFormat(
  //       this.checkoutDate?.toString()
  //     )}`;
  
  //     this.http
  //       .get<any>('https://vanavihari.com/zoho-connect?api_type=room_list' + perm)
  //       .subscribe({
  //         next: (response) => {
  //           const roomDataResponse = response.result.data;
  
  //           this.roomData = Object.keys(roomDataResponse).map((key) => {
  //             const roomObj = roomDataResponse[key];
  //             return {
  //               Room_Id: roomObj.room_id,
  //               Charges_per_Bed_Week_Days: roomObj.week_day_bed_charge,
  //               Cottage_Type: roomObj.cottage_type,
  //               Max_Allowed_Guest: roomObj.max_guest,
  //               Week_Days_Rate: roomObj.week_day_rate,
  //               Charges_per_Bed_Week_End: roomObj.week_end_bed_charge,
  //               Week_End_Rate: roomObj.week_end_rate,
  //               Room_Name: roomObj.name,
  //               Select_Resort: roomObj.resort,
  //               Max_Allowed_Adult: roomObj.max_adult,
  //               Room_Image: '', // Add default value for Room_Image
  //               ID: '', // Add default value for ID
  //               is_button_disabled: false, // Add default value for is_button_disabled
  //               isExtraGuestChecked: false
  //             };
  //           });
  //           this.getRoomData()

  
  //         },
  //         error: (err) => {
  //           this.http.get<any[]>('./assets/json/rooms.json').subscribe((data) => {
  //             this.roomData = data;
  //             this.getRoomData()

  //           });
  //           // this.showErrorAlert(
  //           //   'An error occurred while fetching room list. Please try again later.'
  //           // );
  //         },
  //       });
  // }

  convertDateFormat(dateString: string): string {
    if (!dateString) {
      return ''; // Return an empty string if dateString is undefined
    }

    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getUTCFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  
  getRoomData() {
    const storedObjectString = localStorage.getItem('summaryData');

    if (storedObjectString !== null) {
      const storedObject = JSON.parse(storedObjectString);
      this.summaryData = storedObject;
    } else {
    }

    let roomIdarray = JSON.parse(this.summaryData.booking_rooms);
    this.grandTotal = JSON.parse(this.summaryData.grand_total)
    const room = this.roomData.find(
      (room: { Room_Id: any }) => room.Room_Id == roomIdarray[0]
    );
    this.resortName = room?.Select_Resort;
    this.room_ids = roomIdarray
    // roomIdarray.forEach((roomId: any) => {
    //   const room = this.roomData.find(
    //     (room: { Room_Id: any }) => room.Room_Id === roomId
    //   );
    //   if (room) {
    //     this.roomNames.push(room.Room_Name);
    //   } else {
    //     this.roomNames.push('Room name not found'); // Or any default value
    //   }
    // });
    this.room_ids.forEach((roomId: any) => {
      const room = this.roomData.find((room: { Room_Id: any; }) => room.Room_Id === roomId);
      if (room) {
        this.cardData.push(room);
      }
    });

    this.extra_children = JSON.parse(this.summaryData.extra_children)
    const roomIdsWithGuests = JSON.parse(this.summaryData.noof_guests);
    roomIdsWithGuests.forEach(
      (item: { split: (arg0: string) => [any, any] }) => {
        const [roomId, noof_guests] = item.split(':');
        const room = this.roomData.find(
          (room: { Room_Id: string }) => room.Room_Id === roomId
        );
        if (room) {
          this.roomNamesWithGuests.push(`${room.Room_Name}:${noof_guests}`);
        } else {
          this.roomNamesWithGuests.push('Room name not found'); // Or any default value
        }
      }
      
    );

    this.guestDetails = this.roomNamesWithGuests.map((item) => {
      const [roomName, numGuestsStr] = item.split(':');
      const numGuests = parseInt(numGuestsStr);
      return { roomName, numGuests };
    });
    this.totalGuests = this.guestDetails.reduce(
      (total, room) => total + room.numGuests,
      0
    );

    this.extra_guests = JSON.parse(this.summaryData.extra_guests).length;
    //  payment details
    this.totalPrice = JSON.parse(this.summaryData.room_charges);
    this.totalGSTPrice = JSON.parse(this.summaryData.total_gst);

    this.guestCount = this.totalGuests + this.extra_children
    this.adultsCount = this.totalGuests
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
  gotToLogin() {
    this.router.navigate(['/sign-in']);
  }
 

  submitBooking() {
    // let room_ids = this.authService
    //   .getBookingRooms(this.bookingTypeResort)
    //   .map((room: { id: any }) => room.id)
    //   .join(',');

    if (this.form.valid) {
      console.log(this.resortName);
      console.log(this.room_ids);
      console.log(this.adultsCount);
      console.log(this.guestCount);
      let params = new HttpParams()
        .set('email', this.authService.getAccountUsername() ?? '')
        .set('token', this.authService.getAccessToken() ?? '')
        .set('checkin', this.convertDateFormat(this.checkinDate?.toString()))
        .set('checkout', this.convertDateFormat(this.checkinDate?.toString()))
        .set('resort', this.resortName)
        .set('selected_rooms', this.room_ids)
        .set('room_guest_details', this.roomGuestDetails.toString())
        .set('noof_adult', this.adultsCount)
        .set('noof_guest', this.guestCount);
      Object.keys(this.form.value).forEach((key) => {
        params = params.append(key, this.form.value[key]);
      });
      // this.showSnackBarAlert("Reservation Success! Booking Id");
      //       this.router.navigate(['/booking-successfull']);
      this.http
        .get<any>('https://vanavihari.com/zoho-connect?api_type=booking', {
          params,
        })
        .subscribe({
          next: (response) => {
            if (response.code == 3000 && response.result.status == 'success') {
              this.authService.clearBookingRooms(this.bookingTypeResort);
              this.showSnackBarAlert(
                'Reservation Success! Booking Id: ' + response.result.booking_id
              );
              // this.router.navigate(['/booking-successfull']);

              const bookingId = response.result.booking_id;
              const MerchantId = 'VANAVIHARI';
              const CurrencyType = 'INR';
              const SecurityId = 'vanavihari';
              const txtCustomerID = 'BK986239234';
              const secretKey = 'rmvlozE7R4v9';
              const amount = 1;
              const rU =
                'https://vanavihari.com/zoho-connect?api_type=get_payment_response';

              const str =
                MerchantId +
                '|' +
                bookingId +
                '|NA|' +
                amount +
                '|NA|NA|NA|' +
                CurrencyType +
                '|NA|R|' +
                SecurityId +
                '|NA|NA|F|NA|NA|NA|NA|NA|NA|NA|' +
                rU +
                '&' +
                Date.now().toFixed().substring(0, 10);

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
              form.action =
                'https://pgi.billdesk.com/pgidsk/PGIMerchantPayment';
              pg_params.keys().forEach((key) => {
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
              this.showSnackBarAlert('Reservation Error!');
            }
          },
          error: (err) => {
            console.error('Error:', err);
          },
        });
    }
  }
  calculateDurationOfStay() {
    if (this.checkInDate && this.checkOutDate) {
      const checkinDate = new Date(this.checkInDate);
      const checkoutDate = new Date(this.checkOutDate);
  
      // Set hours, minutes, seconds, and milliseconds to zero for both dates
      checkinDate.setHours(0, 0, 0, 0);
      checkoutDate.setHours(0, 0, 0, 0);
  
      const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
      this.durationOfStay = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days and round up
    } else {
      this.durationOfStay = 1; // Handle case where dates are not selected
    }
    return this.durationOfStay;
  }


  calculateGrandTotal(){
    
    return this.grandTotal
  }
  showSnackBarAlert(msg = '') {
    var snackBar = this.snackBar.open(msg, 'Close', {
      duration: 3000,
    });
  }

  generateJWSToken() {
    this.http.post<any>('https://vanavihari.com/test', {}).subscribe({
      next: (response) => {},
    });
  }
  urlBase64Encode(str: string): string {
    let base64 = btoa(unescape(encodeURIComponent(str)));
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    return (base64 + padding)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  urlBase64Decode(str: string): string {
    str = (str + '===').slice(0, str.length + (str.length % 4));
    return atob(str.replace(/\-/g, '+').replace(/_/g, '/'));
  }
  utf8Encode(str: string): Uint8Array {
    const utf8 = unescape(encodeURIComponent(str));
    const arr = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
      arr[i] = utf8.charCodeAt(i);
    }
    return arr;
  }
  
}
