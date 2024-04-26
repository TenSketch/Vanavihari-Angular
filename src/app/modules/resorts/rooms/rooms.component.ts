import {
  Component,
  OnInit,
  HostBinding,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AuthService } from '../../../auth.service';
import { filter, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { GalleryService } from '@/app/gallery.service';

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
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  @ViewChild('guestSelect') guestSelect: MatSelect;
  isRoomDataEmpty = false;

  currentImage: string | null = null;
  imageFilenames: string[] = [];
  fullImageSrc: string | null = null;
  isFullImageVisible = false;
  roomData: RoomData[] = [];
  filteredRoomData: any;
  // imageFilenames2: string[] = [];
  noof_guests: any = 0;
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
  extraChildren: any = 0;
  bookingRooms: any;
  storedData: any;
  addExtraGuestCharge = false;
  removeExtraGuestCharge = false;
  @HostBinding('class.sticky')
  get stickyClass() {
    return this.isMobile;
  }
  @ViewChild('cardContainer') cardContainer!: ElementRef;
  @ViewChild('scrollLeftIcon') scrollLeftIcon!: ElementRef;
  @ViewChild('scrollRightIcon') scrollRightIcon!: ElementRef;
  @ViewChild('leftTooltip') leftTooltip!: ElementRef;
  @ViewChild('rightTooltip') rightTooltip!: ElementRef;
  modalPromise: any;
  @ViewChildren('guestSelect') guestSelects: QueryList<MatSelect>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private galleryService: GalleryService
  ) {
    // this.authService.clearBookingRooms(this.bookingTypeResort);

    // for navigation filter
    this.selectedResort = this.authService.getSearchData('resort');
    const storedObjectString = localStorage.getItem('summaryData');

    if (storedObjectString !== null) {
      const storedObject = JSON.parse(storedObjectString);
      this.storedData = storedObject;
    } else {
    }
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
    this.fetchRoomList();

    // this.extraChildren = this.storedData?.extra_children;
    // this.noof_guests = this.storedData?.noof_guests?.length;
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  
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

  ngAfterViewInit() {
    this.cardContainer?.nativeElement.addEventListener('scroll', () => {
      if (this.cardContainer?.nativeElement.scrollLeft > 0) {
        this.scrollLeftIcon.nativeElement.style.opacity = '1';
        this.leftTooltip.nativeElement.style.opacity = '1';
      } else {
        this.scrollLeftIcon.nativeElement.style.opacity = '0';
        this.leftTooltip.nativeElement.style.opacity = '0';
      }

      if (
        this.cardContainer.nativeElement.scrollLeft <
        this.cardContainer.nativeElement.scrollWidth -
          this.cardContainer.nativeElement.clientWidth
      ) {
        this.scrollRightIcon.nativeElement.style.opacity = '1';
        this.rightTooltip.nativeElement.style.opacity = '1';
      } else {
        this.scrollRightIcon.nativeElement.style.opacity = '0';
        this.rightTooltip.nativeElement.style.opacity = '0';
      }
    });
  }

  isModalVisible: boolean = false;

  getRoomImages(roomname: any): string[] {
    const lowercaseRoomName = roomname.toLowerCase();

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

  scrollLeft() {
    this.cardContainer.nativeElement.scrollBy({
      left: -250,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.cardContainer.nativeElement.scrollBy({
      left: 250,
      behavior: 'smooth',
    });
  }

  showFullImage(item: string): void {
    this.fullImageSrc = item; // Set the full-size image source to the clicked image filename
    this.isFullImageVisible = true; // Show the full-size image overlay/modal
  }
  downloadImage(): void {
    // Replace 'this.fullImageSrc' with the URL or path of the image you want to download
    // For simplicity, this example opens the image in a new tab, which allows the user to download it manually
    if (this.fullImageSrc) {
      window.open(this.fullImageSrc, '_blank');
    }
  }

  closeFullImage(): void {
    this.isFullImageVisible = false; // Hide the full-size image overlay/modal
  }

  calculateDurationOfStay() {
    const checkinDate = new Date(this.checkinDate);
    const checkoutDate = new Date(this.checkoutDate);

    // Set hours, minutes, seconds, and milliseconds to zero for both dates
    checkinDate.setHours(0, 0, 0, 0);
    checkoutDate.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const timeDifferenceMs = checkoutDate.getTime() - checkinDate.getTime();

    // Convert milliseconds to days and round up to the nearest whole number
    const durationDays = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24));
    return durationDays;
  }

  isRoomAdded(roomId: any): boolean {
    // Assuming bookingRooms is an array of Room_Id
    this.bookingRooms = localStorage.getItem('booking_rooms');
    if (!this.checkinDate || !this.checkoutDate) {
      return true;
    }
    return this.bookingRooms?.includes(roomId);
  }

  isRoomAvailable() {
    this.bookingRooms = localStorage.getItem('booking_rooms');
    return this.bookingRooms?.length !== 2;
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

  filterByResort(selectResort: string): any[] {
    return this.roomData.filter(
      (room: { Select_Resort: string }) => room.Select_Resort == selectResort
    );
  }

  fetchRoomList() {
    this.loadingRooms = true;
    let tempResort = this.selectedResort;
    if (this.selectedResort == 'Jungle Star, Valamuru') {
      tempResort = 'jungle-star';
    }
    if (this.selectedResort == 'Vanavihari, Maredumilli') {
      tempResort = 'vanavihari';
    }

    let perm = '';
    perm += `&resort=${tempResort}`;

    // Concatenate checkin date parameter
    perm += `&checkin=${this.convertDateFormat(this.checkinDate?.toString())}`;

    // Concatenate checkout date pa rameter
    perm += `&checkout=${this.convertDateFormat(
      this.checkoutDate?.toString()
    )}`;

    this.http
      .get<any>('https://vanavihari.com/zoho-connect?api_type=room_list' + perm)
      .subscribe({
        next: (response) => {
          const roomDataResponse = response.result.data;

          this.roomData = Object.keys(roomDataResponse).map((key) => {
            const roomId = key;
            const roomObj = roomDataResponse[key];
            return {
              Room_Id: roomObj.room_id,
              Charges_per_Bed_Week_Days: roomObj.week_day_bed_charge,
              Cottage_Type: roomObj.cottage_type,
              Max_Allowed_Guest: roomObj.max_guest,
              Week_Days_Rate: roomObj.week_day_rate,
              Charges_per_Bed_Week_End: roomObj.week_end_bed_charge,
              Week_End_Rate: roomObj.week_end_rate,
              Room_Name: roomObj.name,
              Select_Resort: roomObj.resort,
              Max_Allowed_Adult: roomObj.max_adult,
              Room_Image: '', // Add default value for Room_Image
              ID: roomId, // Add default value for ID
              is_button_disabled: false, // Add default value for is_button_disabled
              isExtraGuestChecked: false,
            };
          });
          this.loadingRooms = false;
          this.filteredRoomData = this.filterByResort(this.selectedResort);
          if (this.roomData.length == 0) {
            this.isRoomDataEmpty = true;
          }
        },
        error: (err) => {
          this.loadingRooms = false;

          this.http.get<any[]>('./assets/json/rooms.json').subscribe((data) => {
            this.roomData = data;
            this.filteredRoomData = this.filterByResort(this.selectedResort);
          });
          // this.showErrorAlert(
          //   'An error occurred while fetching room list. Please try again later.'
          // );
        },
      });
  }

  isAnyRoomChecked(): boolean {
    // Check if any room has the extra guest checkbox checked
    return this.roomData.some((room) => room.isExtraGuestChecked ?? false);
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
    return this.roomData?.find((room: { Room_Id: any }) => room.Room_Id === id);
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

    this.roomIds.splice(indexToRemove, 1);
    const indexToRemoveEg = this.extraGuestsIds.indexOf(roomId);

    if (indexToRemove !== -1) {
      this.extraGuestsIds.splice(indexToRemoveEg, 1);
    }

    this.authService.setExtraGuests(this.extraGuestsType, this.extraGuestsIds);
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
    if (this.removeExtraGuestCharge) {
      return (totalPrice -= this.calculateExtraGuestCharges());
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
    let payablePrice =
      (totalPrice + gstAmount) * this.calculateDurationOfStay();

    return payablePrice;
  }

  goToBooking() {
    let summary = {
      booking_rooms: localStorage.getItem('booking_rooms'),
      noof_guests: localStorage.getItem('noof_guests'),
      extra_guests: localStorage.getItem('extra_guests'),
      extra_children: this.extraChildren,
      grand_total: this.calculatePayablePrice(),
      room_charges: this.calculateTotalPrice(),
      total_gst: this.calculateTotalGst(),
    };

    let summaryData = JSON.stringify(summary);

    localStorage.setItem('summaryData', summaryData);

    const bookingRoomsStr = localStorage.getItem('booking_rooms');
    if (bookingRoomsStr) {
      const bookingRooms = JSON.parse(bookingRoomsStr);
      const roomDataToStore: RoomData[] = [];

      bookingRooms.forEach((roomId: string) => {
        const room = this.roomData.find((room: any) => room.Room_Id === roomId);
        if (room) {
          roomDataToStore.push(room);
        }
      });

      localStorage.setItem('room_data', JSON.stringify(roomDataToStore));
    }

    let status = this.userService.isLoggedIn();
    if (status) {
      this.router.navigate(['/booking-summary']);
    } else {
      this.router.navigate(['/booking-summary']);

      // this.router.navigate(['/sign-in']);
    }
  }

  trackByRoomCard(index: number, card: any): string {
    return card.roomName;
  }
  selectedValues: { [key: string]: number } = {};

  isGuestSelectEmpty(): boolean {
    const roomIdsWithNoValue = this.roomIds.filter(
      (roomId) => !this.selectedValues[roomId]
    );
    return roomIdsWithNoValue.length > 0;
  }

  // no. of guests
  noOfGuestAction(event: MatSelectChange, roomId: string) {
    const selectedValue = event.value;
    this.selectedValues[roomId] = event.value;

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
    this.removeExtraGuestCharge = false;
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
