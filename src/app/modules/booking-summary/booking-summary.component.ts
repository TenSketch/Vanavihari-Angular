import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HmacSHA256, enc } from 'crypto-js';
import { filter, Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { EnvService } from '@/app/env.service';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})
export class BookingSummaryComponent {
  roomID: any;
  formattedCheckinDate: { day: number; month: string; year: number };
  formattedCheckoutDate: { day: number; month: string; year: number };
  form: FormGroup;
  adultsCount: any = 1;
  guestCount: any = 0;

  roomsCount: number = 1;
  roomDetails: any[];
  checkInDate: any;
  checkOutDate: any;
  durationOfStay: any;
  seslectedResort: string;
  getFullUser: string;
  maxAdultCount: number = 2;
  totalPrice: any;
  totalGSTPrice: any;
  bookingTypeResort: string;
  roomGuestDetails: any[] = [];
  // me
  summaryData: any;
  resortName: any;
  roomData: any;
  roomNamesWithGuests: any[] = [];
  guestDetails: any[];
  totalGuests: any;
  extra_guests: any;
  extra_children: any;
  grandTotal: any;
  room_ids: any;
  // checkinDate: Date;
  // checkoutDate: Date;
  cardData: any[] = [];
  selectedResort: any;
  checkinDate: any;
  checkoutDate: any;
  resort_name: any;

  date: any;
  now: any;
  targetTime: any;
  difference: number;
  subBillerId: string;
  isModalVisible: boolean = false;
  isInfoModalVisible = false;
  showLoader = false;
  noofrooms: any;
  @ViewChild('minutes', { static: true }) minutes: ElementRef;
  @ViewChild('seconds', { static: true }) seconds: ElementRef;
  intervalId: any;

  api_url: any;
  input_str: any;
  output_str: any;
  updatingGSTNumber = false;
  updatingCompanyName = false;
  ngAfterViewInit() {
    // Set target time 5 minutes from now
    this.targetTime = new Date();
    this.targetTime.setMinutes(this.targetTime.getMinutes() + 5);

    let redirectDone = false; // Flag to track if redirection has been done

    this.intervalId = setInterval(() => {
      this.tickTock();
      this.difference = this.targetTime - this.now;
      const minutesLeft = Math.floor(
        (this.difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const secondsLeft = Math.floor((this.difference % (1000 * 60)) / 1000);

      if (this.difference <= 0 && !redirectDone) {
        redirectDone = true; // Set flag to true to indicate redirection
        clearInterval(this.intervalId); // Clear the interval when difference reaches 0
        localStorage.setItem('showCancel', 'no');
        this.router.navigate(['resorts/rooms']);
        this.authService.clearBookingRooms(this.bookingTypeResort);
      }

      this.minutes.nativeElement.innerText =
        minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft;
      this.seconds.nativeElement.innerText =
        secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
    }, 1000);
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    clearInterval(this.intervalId);
  }

  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
  }
  billdeskkey: string;

  billdesksecurityid: any;
  billdeskmerchantid: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private envService: EnvService
  ) {
    this.api_url = environment.API_URL;

    localStorage.setItem('isSummary', 'yes');

    this.selectedResort = this.authService.getSearchData('resort');

    // this.checkinDate = this.authService.getSearchData('checkin');
    this.checkinDate = JSON.parse(
      localStorage.getItem('checkindate') as string
    );
    // this.checkoutDate = this.authService.getSearchData('checkout');
    this.checkoutDate = JSON.parse(
      localStorage.getItem('checkoutdate') as string
    );
    this.fetchRoomList();

    this.roomDetails = this.authService.getBookingRooms('vanvihari');
    if (this.roomDetails.length > 0) {
      this.adultsCount = 0;
      this.guestCount = 0;
      for (const room of this.roomDetails) {
        if (parseInt(room.noof_guest) > 0) {
          this.roomGuestDetails.push(room.id, room.noof_guest);
        }
        this.adultsCount += parseInt(room.noof_guest);
        this.guestCount += parseInt(room.extra_guests);

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

    if (this.selectedResort == 'Jungle Star, Valamuru') {
      this.form = this.formBuilder.group({
        gname: [''],
        gphone: [''],
        gemail: ['', Validators.email],
        gaddress: ['', Validators.required],
        gcity: ['', Validators.required],
        gstate: ['', Validators.required],
        gpincode: ['', Validators.required],
        gcountry: ['', Validators.required],
        gstnumber: [''],
        companyname: [''],
        foodpreference: ['', Validators.required],
      });
    } else {
      this.form = this.formBuilder.group({
        gname: [''],
        gphone: [''],
        gemail: ['', Validators.email],
        gaddress: ['', Validators.required],
        gcity: ['', Validators.required],
        gstate: ['', Validators.required],
        gpincode: ['', Validators.required],
        gcountry: ['', Validators.required],
        gstnumber: [''],
        companyname: [''],
        foodpreference: [''],
      });
    }

    this.form.get('gstnumber')?.valueChanges.subscribe(() => {
      if (!this.updatingGSTNumber) {
        this.updateGSTNumberValidators();
      }
    });

    this.form.get('companyname')?.valueChanges.subscribe(() => {
      if (!this.updatingCompanyName) {
        this.updateCompanyNameValidators();
      }
    });
  }

  private updateGSTNumberValidators(): void {
    this.updatingGSTNumber = true;

    const gstNumberControl = this.form.get('gstnumber');

    if (gstNumberControl?.value) {
      gstNumberControl.setValidators([Validators.pattern('^[a-zA-Z0-9]*$')]);
    } else {
      gstNumberControl?.clearValidators();
    }

    gstNumberControl?.updateValueAndValidity();
    this.updatingGSTNumber = false;

  }

  private updateCompanyNameValidators(): void {
    this.updatingCompanyName = true;

    const companyNameControl = this.form.get('companyname');

    if (companyNameControl?.value) {
      companyNameControl.setValidators([
        Validators.pattern('^[a-zA-Z.]+(?:\\s[a-zA-Z.]+)*$'),
      ]);
    } else {
      companyNameControl?.clearValidators();
    }

    companyNameControl?.updateValueAndValidity();
    this.updatingCompanyName = false;

  }

  // Function to access form control
  getFormControl(controlName: string): any {
    return this.form.get(controlName);
  }

  ngOnInit(): void {
    this.envService.getEnvVars().subscribe(
      (envVars) => {
        this.billdeskkey = envVars.billdeskkey;
        this.billdesksecurityid = envVars.billdesksecurityid;
        this.billdeskmerchantid = envVars.billdeskmerchantid;
       

      },
      (error) => {
        console.error('Error fetching environment variables:', error);
      }
    );

    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);

    this.route.queryParams.subscribe((params) => {
      this.bookingTypeResort = params['bookingTypeResort'];
    });
    // this.checkInDate = this.authService.getSearchData('checkin');
    const checkInDateString = localStorage.getItem('checkindate');
    if (checkInDateString) {
      this.checkInDate = JSON.parse(checkInDateString);
    }
    const checkOutDateString = localStorage.getItem('checkoutdate');
    if (checkOutDateString) {
      this.checkOutDate = JSON.parse(checkOutDateString);
    }

    const noofroomsString = localStorage.getItem('noofrooms');
    if (noofroomsString) {
      this.noofrooms = JSON.parse(noofroomsString);
    }
    // this.checkOutDate = this.authService.getSearchData('checkout');
    this.seslectedResort = this.authService.getSearchData('resort');

    const startDate = new Date(this.checkInDate);
    const endDate = new Date(this.checkOutDate);

    this.formattedCheckinDate = this.parseDate(new Date(this.checkInDate));
    this.formattedCheckoutDate = this.parseDate(new Date(this.checkOutDate));
    // this.checkOutDate = endDate

    const durationMs = endDate.getTime() - startDate.getTime();
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    // const weeks = Math.floor(durationMs / (1000 * 60 * 60 * 24 * 7));
    this.durationOfStay = `${days} day${days > 1 ? 's' : ''}`;

    this.getFullUser = this.userService.getFullUser();

    this.getUserDetails();
  }

  
  isCompanyNameValidationRequired(): boolean {
    // Add your condition to determine whether company name validation is required or not
    // For example, you can return true or false based on certain criteria
    // Here, returning true means company name validation is required
    return false;
  }

  isMobileOrTablet(): boolean {
    const screenWidth = window.innerWidth;
    return screenWidth < 992;
  }
  getModalStyles(): object {
    if (this.isMobileOrTablet()) {
      return {
        display: 'block',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    } else {
      return {
        display: 'block',
      }; // Return empty object for default styles on larger devices
    }
  }

  triggerModal() {
    // this.isModalVisible = true;
    this.router.navigate(['/resorts/rooms']);
  }
  triggerInfoModal() {
    this.isInfoModalVisible = true;
  }
  onCancel() {
    this.isModalVisible = false;
    this.isInfoModalVisible = false;
    // window.location.reload(); // Reload the page
  }

  onConfirm() {
    this.isModalVisible = false;
    this.router.navigate(['/resorts/rooms']);
  }
  onOk() {
    this.submitBooking();
    this.isInfoModalVisible = false;
  }
  getUserDetails() {
    this.showLoader = true;
    const params = new HttpParams()
      .set('email', this.authService.getAccountUsername() ?? '')
      .set('token', this.authService.getAccessToken() ?? '');
    this.http
      .get<any>(this.api_url + '?api_type=profile_details', { params })
      .subscribe({
        next: (response) => {
          this.showLoader = false;
          if (response.code == 3000 && response.result.status == 'success') {
            this.form.patchValue({
              gname: response.result.name,
              gphone: response.result.phone,
              gemail: response.result.email,
              gaddress: response.result.address1,
              gcity: response.result.city,
              gstate: response.result.state,
              gpincode: response.result.pincode,
              gcountry: response.result.country,
              foodPreference: response.result.foodPreference,
              gstnumber: response.result.gstnumber
                ? response.result.gstnumber
                : '',
              companyname: response.result.companyname
                ? response.result.companyname
                : '',
            });
          } else if (response.code == 3000) {
          } else {
          }
        },
        error: (err) => {
          this.showLoader = false;
        },
      });
  }

  parseDate(date: Date): { day: number; month: string; year: number } {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return {
      day: day,
      month: months[monthIndex],
      year: year,
    };
  }

  fetchRoomList() {
    const roomDataString = localStorage.getItem('room_data');

    if (roomDataString) {
      const roomData = JSON.parse(roomDataString);
      this.roomData = roomData;
    }
    this.getRoomData();
  }

  convertDateFormat(dateString: string): string {
    if (!dateString) {
      return '';
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
    this.grandTotal = JSON.parse(this.summaryData.grand_total);
    this.totalPrice = JSON.parse(this.summaryData.room_charges);
    this.totalGSTPrice = JSON.parse(this.summaryData.total_gst);

    const room = this.roomData.find(
      (room: { Room_Id: any }) => room.Room_Id == roomIdarray[0]
    );
    this.resortName = room?.Select_Resort;
    this.room_ids = roomIdarray;
    this.roomID = roomIdarray.map((roomId: string) => {
      const room = this.roomData.find(
        (room: { Room_Id: string }) => room.Room_Id === roomId
      );
      return room ? room.ID : null;
    });

    this.room_ids.forEach((roomId: any) => {
      const room = this.roomData.find(
        (room: { Room_Id: any }) => room.Room_Id === roomId
      );
      if (room) {
        this.cardData.push(room);
      }
    });

    this.extra_children = JSON.parse(this.summaryData.extra_children);
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
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  gotToLogin() {
    this.router.navigate(['/sign-in']);
  }

  submitBooking() {
    this.showLoader = true;
    this.extra_guests = JSON.parse(this.summaryData.extra_guests).length;
    // this.totalGuests = this.totalGuests + this.extra_guests
    this.guestCount = parseInt(this.totalGuests + this.extra_children);
    this.adultsCount = parseInt(this.totalGuests);
    // noof_child
    if (this.resortName == 'Vanavihari, Maredumilli') {
      this.resort_name = 'vanavihari';
      this.subBillerId = 'MMILLI';
    }
    if (this.resortName == 'Jungle Star, Valamuru') {
      this.resort_name = 'jungle-star';
      this.subBillerId = 'JSTAR';
    }
    if (this.form.valid) {
      let params = new HttpParams()
        .set('email', this.authService.getAccountUsername() ?? '')
        .set('token', this.authService.getAccessToken() ?? '')
        .set('checkin', this.convertDateFormat(this.checkinDate))
        .set('checkout', this.convertDateFormat(this.checkoutDate))
        .set('resort', this.resort_name)
        .set('selected_rooms', this.roomID)
        .set(
          'room_guest_details',
          this.roomDetails
            .map((item) => `${item.id}-${item.noof_guest}`)
            .join(',')
        )
        .set('noof_adult', this.totalGuests)
        .set('noof_guest', this.extra_guests)
        .set('noof_child', this.extra_children);
      Object.keys(this.form.value).forEach((key) => {
        params = params.append(key, this.form.value[key]);
      });
      // this.showSnackBarAlert("Reservation Success! Booking Id");
      // this.router.navigate(['/booking-successfull']);
      this.http
        .get<any>(this.api_url + '?api_type=booking', {
          params,
        })
        .subscribe({
          next: (response) => {
            this.showLoader = false;
            if (response.code == 3000 && response.result.status == 'success') {
              this.authService.clearBookingRooms(this.bookingTypeResort);
              this.showSnackBarAlert(
                'Reservation submitted! Booking Id: ' +
                  response.result.booking_id
              );
              // this.router.navigate(['/booking-successfull']);

              const bookingId = response.result.booking_id;
              const MerchantId = this.billdeskmerchantid;
              const CurrencyType = 'INR';
              const SecurityId = this.billdesksecurityid;
              const txtCustomerID = 'BK986239234';
              const secretKey = this.billdeskkey;
              const amount = this.calculateGrandTotal();
              // const amount = '1.00';
              const rU = this.api_url + '?api_type=get_payment_response';   

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
                '|NA|NA|F|' +
                this.subBillerId +
                '|' +
                this.form.value.gname +
                '|' +
                this.form.value.gphone +
                '|' +
                this.resort_name +
                '|NA|NA|NA|' +
                rU;

              const hmac = HmacSHA256(str, secretKey);
              const checksum = hmac.toString().toUpperCase();
              const msg = `${str}|${checksum}`;

              let username = localStorage.getItem('userfullname');
              this.logMessage(
                bookingId,
                this.form.value.gname,
                "request",
                msg
              );
              let pg_params = new HttpParams()
                .set('MerchantId', MerchantId)
                .set('CurrencyType', CurrencyType)
                .set('SecurityId', SecurityId)
                .set('txtCustomerID', txtCustomerID)
                .set('txtTxnAmount', amount)
                .set('txtAdditionalInfo1', this.subBillerId) // Sub Biller id
                .set('txtAdditionalInfo2', bookingId)
                .set('txtAdditionalInfo3', this.form.value.gname)
                .set('txtAdditionalInfo4', this.form.value.gphone)
                .set('RU', rU)
                .set('CheckSumKey', secretKey)
                .set('CheckSum', checksum)
                .set('msg', msg);
                this.input_str = msg
                localStorage.setItem('input_str',this.input_str)

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
            }
          },
          error: (err) => {
            
            this.showLoader = false;
          },
        });
    }
  }

  //catch logs
  logMessage(
    booking_id: string,
    username: string,
    type: string,
    msg: string
  )  {

    const params = new HttpParams()
    .set('booking_id', booking_id ?? '')
    .set('username', username ?? '')
    .set('type', type ?? '')
    .set('msg', msg ?? '');

  this.http.get(this.api_url + '?api_type=logs', { params }).subscribe({
    next: (response) => {},
  });
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

  calculateGrandTotal() {
    let total = parseFloat(this.grandTotal).toFixed(2);

    return total;
  }
  calculateTotalPrice() {
    return JSON.parse(this.summaryData.room_charges);
  }

  calculateTotalGSTPrice() {
    return JSON.parse(this.summaryData.total_gst);
  }

  showSnackBarAlert(msg = '') {
    var snackBar = this.snackBar.open(msg, 'Close', {
      duration: 3000,
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
