import {
  Component,
  OnInit,
  HostBinding,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { RoomsComponent } from '../rooms/rooms.component';
// import { UserService } from '../../user.service';
import { SharedService } from '../../../shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import lgZoom from 'lightgallery/plugins/zoom';
import { BeforeSlideDetail } from 'lightgallery/lg-events';

import * as data from '../../../../assets/json/rooms.json';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { UserService } from 'src/app/user.service';

interface Room {
  //roomId:string;
  name: string;
  cottage_type: string;
  // bed_type: string;
  // amenities: string[];
  // rating: string;
  week_day_rate: number;
  week_end_rate: number;
  week_day_guest_charge: number;
  week_end_guest_charge: number;
  image: string;
  max_adult: number;
  // max_child: number;
  max_guest: number;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  @ViewChild('guestSelect') guestSelect: MatSelect;

  currentImage: string | null = null;
  imageFilenames: string[] = [];
  roomData: any;
  filteredRoomData: any;
  // imageFilenames2: string[] = [];
  noof_guests: any;
  isWeekend: boolean = false; // Variable to determine if it's a weekend

  searchResortData: any;
  resorts: any = {
    'Vanavihari, Maredumilli': {
      title: 'Vanavihari',
      about: 'About Vanavihari',
    },
    'Jungle Star, Valamuru': {
      title: 'Jungle Star',
      about: 'About Jungle Star',
    },
  };
  selectedResortInfo: any = {};
  private subscription: Subscription;
  selectedSortOption: string;
  panelOpenState = false;
  showBookingSummary: boolean = false;
  roomCards: any[] = [];
  roomIds: any[] = [];
  extraGuestsIds: any[] = [];
  noofGuestsIds: any[] = [];
  loadingRooms: boolean = false;
  selectedResort: string;
  checkinDate: Date;
  checkoutDate: Date;
  selected: string = '';
  isChecked: boolean = false;
  isAddedExtraGuest = false;
  isMobile: boolean = false;
  expandable: boolean = false;
  selectedRoom: any;
  bookingTypeResort: any;
  extraGuestsType: any;
  totalExtraGuestCharges: number;
  noof_guest: number | null = null; // Initialize it with null or any default value
  extraChildren: any;
  bookingRooms: any;
  storedData: any;
  addExtraGuestCharge = false;
  removeExtraGuestCharge = false;
  @HostBinding('class.sticky')
  get stickyClass() {
    return this.isMobile;
  }


  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // this.authService.clearBookingRooms(this.bookingTypeResort);

    // for navigation filter
    this.selectedResort = this.authService.getSearchData('resort');
    this.fetchRoomList();
    const storedObjectString = localStorage.getItem('summaryData');

    if (storedObjectString !== null) {
      const storedObject = JSON.parse(storedObjectString);
      this.storedData = storedObject;
    } else {
    }
    // this.filteredRoomData = this.roomData;
    this.subscription = this.authService.buttonClick$.subscribe(() => {
      // Retrieve data when button is clicked
      this.selectedResort = this.authService.getSearchData('resort');
      this.checkinDate = this.authService.getSearchData('checkin');
      this.checkoutDate = this.authService.getSearchData('checkout');
      this.fetchRoomList();
    });
    this.checkIfWeekend(); // Check if it's a weekend on component initialization

    this.currentImage = this.imageFilenames[0];
    for (let i = 1; i <= 5; i++) {
      this.imageFilenames.push(`assets/img/bahuda/img-${i}.jpg`);
    }
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
    this.selectedSortOption = 'lowToHigh';

    this.selectedResort = this.authService.getSearchData('resort');
    this.checkinDate = this.authService.getSearchData('checkin');
    this.checkoutDate = this.authService.getSearchData('checkout');

    this.extraChildren = this.storedData?.extra_children;
    this.noof_guests = this.storedData?.noof_guests.length;
    console.log(this.extraChildren);
  }
  ngOnInit(): void {
    // Set extra_guests in localStorage to an empty array
    localStorage.setItem('extra_guests', JSON.stringify([]));

    this.route.queryParams.subscribe((params) => {
      this.bookingTypeResort = params['bookingTypeResort'];
    });
    this.searchResortData = this.authService.getSearchData(null);
    this.getSelectedResortInfo();
    this.subscription = this.authService.refreshRoomsComponent$.subscribe(
      () => {
        this.getSelectedResortInfo();
      }
    );
    this.roomIds =
      this.authService.getBookingRooms(this.bookingTypeResort) != null &&
      this.authService.getBookingRooms(this.bookingTypeResort) != '' &&
      this.authService.getBookingRooms(this.bookingTypeResort).length > 0
        ? this.authService.getBookingRooms(this.bookingTypeResort)
        : [];

    // this.authService.clearBookingRooms(this.bookingTypeResort);

    if (this.roomIds.length > 0) {
      this.showBookingSummary = true;
    }
  }

  

  isRoomAdded(roomId: any): boolean {
    // Assuming bookingRooms is an array of Room_Id
    this.bookingRooms = localStorage.getItem('booking_rooms');

    return this.bookingRooms?.includes(roomId);
  }

  toggleBookingSummary() {
    this.showBookingSummary = !this.showBookingSummary;
  }

  getSelectedResortInfo(): void {
    this.selectedResort = this.authService.getSearchData('resort');
    if (this.selectedResort) {
      this.selectedResortInfo = this.resorts[this.selectedResort];
    }
  }

  convertDateFormat(dateString: string): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const [monthAbbr, day, year] = dateString.split('/');
    const formattedDate = `${year}-${months[parseInt(monthAbbr) - 1]}-${day}`;

    return formattedDate;
  }

  filterByResort(selectResort: string): any[] {
    return this.roomData.filter(
      (room: { Select_Resort: string }) => room.Select_Resort == selectResort
    );
  }

  fetchRoomList() {
    this.http.get<any[]>('./assets/json/rooms.json').subscribe((data) => {
      this.roomData = data;
      this.filteredRoomData = this.filterByResort(this.selectedResort);
    });

    let perm = '';
      if (this.selectedResort) perm += `&resort=${this.selectedResort}`;
      if (this.checkinDate) perm += `&checkin=${this.convertDateFormat(this.checkinDate.toString())}`;
      if (this.checkoutDate) perm += `&checkout=${this.convertDateFormat(this.checkoutDate.toString())}`;

    this.http
        .get<any>(
          'https://vanavihari-ng.netlify.app/zoho-connect?api_type=room_list' + perm
        )
        .subscribe({
          next: (response) => {
            console.log(response)
            this.loadingRooms = false;
          },
          error: (err) => {
            console.error('Error:', err);
            this.showErrorAlert(
              'An error occurred while fetching room list. Please try again later.'
            );
          },
        });
  }

  isAnyRoomChecked(): boolean {
    // Check if any room has the extra guest checkbox checked
    return this.roomData.some(
      (room: { isExtraGuestChecked: any }) => room.isExtraGuestChecked
    );
  }

  toggleButtonDisabledById(room_id: number, roomIds: any[]): any {
    for (const roomId of roomIds) {
      if (roomId.id === room_id) return true;
    }
    return false;
  }

  showErrorAlert(msg = '') {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
    });
  }

  findRoomById(id: string) {
    return this.roomData.find((room: { Room_Id: any }) => room.Room_Id === id);
  }

  checkIfWeekend(): void {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    this.isWeekend = currentDay === 0 || currentDay === 6; // Check if it's Saturday or Sunday
  }

  addRoom(room: any) {
    this.addExtraGuestCharge = false;
    this.removeExtraGuestCharge = false;
    this.roomIds.push(room.Room_Id);
    this.showBookingSummary = true;
    room.is_button_disabled = true;

    this.authService.setBookingRooms(this.bookingTypeResort, this.roomIds);
    this.isRoomAdded(room.Room_Id);
  }

  removeRoom(roomIds: any, roomId: any) {
    this.isRoomAdded(roomId);
    const room = this.roomData.find(
      (room: { Room_Id: any }) => room.Room_Id === roomId
    );
    if (room) {
      room.is_button_disabled = false;
    }

    const indexToRemove = this.roomIds.indexOf(roomId);

    if (indexToRemove !== -1) {
      this.roomIds.splice(indexToRemove, 1);
    }

    if (this.roomIds.length == 0) {
      this.showBookingSummary = false;
    }

    this.authService.setBookingRooms(this.bookingTypeResort, this.roomIds);
  }

  calculateTotalPrice(): number {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isWeekend = currentDay === 0 || currentDay === 6; // Sunday or Saturday are considered weekend days

    let totalPrice = 0;
    for (const roomId of this.roomIds) {
      const room = this.roomData.find(
        (room: { Room_Id: any }) => room.Room_Id === roomId
      );
      if (room) {
        const rate = isWeekend
          ? parseFloat(room.Week_End_Rate)
          : parseFloat(room.Week_Days_Rate);
        totalPrice = this.getRoomCharges();
      }
    }
    if (this.isAddedExtraGuest) {
      return (totalPrice += this.calculateExtraGuestCharges());
    }

    return totalPrice;
  }

  getRoomCharges(): number {
    let roomCharges = 0;
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.

    for (const roomId of this.roomIds) {
      const room = this.roomData.find(
        (r: { Room_Id: any }) => r.Room_Id === roomId
      );
      if (room) {
        if (currentDay === 0 || currentDay === 6) {
          // It's a weekend (Sunday or Saturday)
          roomCharges += parseFloat(room.Week_End_Rate);
        } else {
          // It's a weekday (Monday to Friday)
          roomCharges += parseFloat(room.Week_Days_Rate);
        }
      }
    }

    return roomCharges;
  }

  calculateTotalGst(): number {
    let totalPrice = this.calculateTotalPrice();
    const gstRate = 12; // GST rate is 12%

    totalPrice = (totalPrice * gstRate) / 100;
    return totalPrice;
  }

  calculatePayablePrice(): number {
    const totalPrice = this.calculateTotalPrice();
    const gstPercentage = 0.12; // GST @12%
    const gstAmount = totalPrice * gstPercentage;
    let payablePrice = totalPrice + gstAmount;

    // if (this.addExtraGuestCharge) {
    //   // this.addExtraGuestCharge = false
    //   return (payablePrice += 500);
    // }
    // if (this.removeExtraGuestCharge) {
    //   return (payablePrice -= 500);
    // }
    let extraGuests = this.authService.getExtraGuests(this.extraGuestsType);
    let totalExtraGuests = extraGuests?.length;

    return payablePrice;
  }

  goToBooking() {
    let summary = {
      booking_rooms: localStorage.getItem('booking_rooms'),
      noof_guests: localStorage.getItem('noof_guests'),
      extra_guests: localStorage.getItem('extra_guests'),
      extra_children: this.extraChildren,
      grand_total: this.calculatePayablePrice(),
      room_charges: this.getRoomCharges(),
      total_gst: this.calculateTotalGst(),
    };

    let summaryData = JSON.stringify(summary);

    localStorage.setItem('summaryData', summaryData);

    let status = this.userService.isLoggedIn();
    if (status) {
      this.router.navigate(['/booking-summary']);
    } else {
      // this.router.navigate(['/booking-summary']);

      this.router.navigate(['/sign-in']);
    }
  }

  trackByRoomCard(index: number, card: any): string {
    return card.roomName;
  }

  isGuestSelectEmpty(select: MatSelect): boolean {
    return !select || !select.value;
  }

  // no. of guests
  noOfGuestAction(event: MatSelectChange, roomId: string) {
    const selectedValue = event.value;

    this.handleNoOfGuests(selectedValue, roomId);
  }

  handleNoOfGuests(selectedValue: any, roomId: string) {
    this.noofGuestsIds.push(roomId + ':' + selectedValue);

    this.authService.setNoOfGuests(this.noofGuestsIds);
  }

  // extra guest
  extraGuestActions(event: MatCheckboxChange, roomId: string) {
    if (event.checked) {
      // Call function when checkbox is checked
      this.addExtraGuest(roomId);
    } else {
      // Call function when checkbox is unchecked
      this.removeExtraGuest(roomId);
    }
  }

  addExtraGuest(roomId: string) {
    this.isAddedExtraGuest = true;

    this.extraGuestsIds.push(roomId);
    this.authService.setExtraGuests(this.extraGuestsType, this.extraGuestsIds);

    this.calculatePayablePrice();
  }

  removeExtraGuest(roomId: string) {
    this.addExtraGuestCharge = false;
    this.isAddedExtraGuest = false;
    const indexToRemove = this.extraGuestsIds.indexOf(roomId);

    if (indexToRemove !== -1) {
      this.extraGuestsIds.splice(indexToRemove, 1);
    }

    this.authService.setExtraGuests(this.extraGuestsType, this.extraGuestsIds);

    this.removeExtraGuestCharge = true;
    this.calculatePayablePrice();
  }

  calculateExtraGuestCharges() {
    let totalExtraGuestCharges = 0;
    let extraGuests = this.authService.getExtraGuests(this.extraGuestsType);
    let totalExtraGuests = extraGuests?.length;
    let resortName = this.authService.getSearchData('resort');
    if (resortName == 'Vanavihari, Maredumilli') {
      totalExtraGuestCharges = totalExtraGuests * 500;
    } else {
      totalExtraGuestCharges = totalExtraGuests * 1500;
    }
    return totalExtraGuestCharges;
  }
  settings = {
    counter: false,
    plugins: [lgZoom], // Include the lgZoom plugin
  };
  onBeforeSlide(detail: BeforeSlideDetail): void {
    const { index, prevIndex } = detail;
  }
}
