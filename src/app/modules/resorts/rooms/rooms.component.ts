import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
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
  currentImage: string | null = null;
  imageFilenames: string[] = [];
  roomData: any;
  filteredRoomData: any;
  // imageFilenames2: string[] = [];
  noof_guests: any;
  isWeekend: boolean = false; // Variable to determine if it's a weekend

  searchResortData: any;
  resorts: any = {
    vanavihari: {
      title: 'Vanavihari',
      about: 'About Vanavihari',
    },
    'jungle-star': {
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
  totalExtraGuestCharges: number;
  noof_guest: number | null = null; // Initialize it with null or any default value
private fetchRoomListSubscription:Subscription;
  @HostBinding('class.sticky')
  get stickyClass() {
    return this.isMobile;
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    
  ) {
    

   

    // for navigation filter
    this.selectedResort = this.authService.getSearchData('resort');
    this.fetchRoomList();

    // this.filteredRoomData = this.roomData;
    this.subscription = this.authService.buttonClick$.subscribe(() => {
      // Retrieve data when button is clicked
      this.selectedResort = this.authService.getSearchData('resort');
      this.checkinDate = this.authService.getSearchData('checkin');
      this.checkoutDate = this.authService.getSearchData('checkout');
      console.log(this.selectedResort);
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
        console.log('result====', result);
        this.isMobile = result.matches;
      });
    this.selectedSortOption = 'lowToHigh';

    this.selectedResort = this.authService.getSearchData('resort');
    console.log(this.selectedResort);
    this.checkinDate = this.authService.getSearchData('checkin');
    this.checkoutDate = this.authService.getSearchData('checkout');
  }
  ngOnInit(): void {

    const savedTotalExtraGuestCharges = localStorage.getItem(
      'totalExtraGuestCharges'
    );
    if (savedTotalExtraGuestCharges) {
      this.totalExtraGuestCharges = parseFloat(savedTotalExtraGuestCharges);
    }
    this.route.queryParams.subscribe(params => {
      this.bookingTypeResort = params['bookingTypeResort'];
    this.staticRoomsDetails()
    this.searchResortData = this.authService.getSearchData(null);
    this.getSelectedResortInfo();
 
    this.subscription = this.authService.refreshRoomsComponent$.subscribe(() => {
      this.getSelectedResortInfo();
    });


      this.authService.getBookingRooms(this.bookingTypeResort) != null &&
      this.authService.getBookingRooms(this.bookingTypeResort) != '' &&
      this.authService.getBookingRooms(this.bookingTypeResort).length > 0
        ? this.authService.getBookingRooms(this.bookingTypeResort)
        : [];

        if (this.roomIds.length > 0) {
          this.roomIds = this.roomIds.filter((room) =>
            room.resort.toLowerCase().includes(this.bookingTypeResort)
          );
  
          this.showBookingSummary = true;
  
  
        }
        else{
          this.showBookingSummary=false
        }
    this.fetchRoomListSubscription =
      this.sharedService.fetchRoomList$.subscribe(() => {
        this.fetchRoomList();
      });
      this.calculateExtraGuestCharges();
    })

  }

  toggleBookingSummary() {
    this.showBookingSummary = !this.showBookingSummary;
  }
  getSelectedResortInfo(): void {
    this.selectedResort = this.authService.getSearchData('resort');
    if (this.selectedResort) {
      this.selectedResortInfo = this.resorts[this.selectedResort];

      console.log("this.selectedResortInfo-----",this.selectedResortInfo)
      if (
        this.selectedResort != '' &&
        this.checkinDate != null &&
        this.checkoutDate != null
      ) {
        this.fetchRoomList();
      } else {
        this.staticRoomsDetails();
      }

    }
  }
  staticRoomsDetails() {
    console.log('staticRoomsDetails');
    interface RoomDetails {
      id: string;
      week_day_bed_charge: number;
      cottage_type: string;
      max_guest: string;
      week_day_rate: number;
      week_end_bed_charge: number;
      week_end_rate: number;
      name: string;
      resort: string;
      max_adult: number;
    }
    // // Sample JSON object with the defined type
    // old json
    const json: { [key: string]: RoomDetails } = {
      '4554333000000159043': {
        id: '4554333000000159043',
        week_day_bed_charge: 500,
        cottage_type: 'Wooden Cottages',
        max_guest: '4',
        week_day_rate: 4000,
        week_end_bed_charge: 700,
        week_end_rate: 4500,
        name: 'BULBUL',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000159087': {
        id: '4554333000000159087',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Vanya',
        resort: 'Jungle Star, Valamuru',
        max_adult: 2,
      },
      '4554333000000159121': {
        id: '4554333000000159121',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Jabilli',
        resort: 'Jungle Star, Valamuru',
        max_adult: 3,
      },
      '4554333000000159067': {
        id: '4554333000000159067',
        week_day_bed_charge: 500,
        cottage_type: 'Vihari',
        max_guest: '2',
        week_day_rate: 4000,
        week_end_bed_charge: 700,
        week_end_rate: 4500,
        name: 'PAMULERU',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 3,
      },
      '4554333000000159061': {
        id: '4554333000000159061',
        week_day_bed_charge: 500,
        cottage_type: 'Vihari',
        max_guest: '3',
        week_day_rate: 4000,
        week_end_bed_charge: 700,
        week_end_rate: 4500,
        name: 'SOKULERU',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 3,
      },
      '4554333000000159081': {
        id: '4554333000000159081',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Prana',
        resort: 'Jungle Star, Valamuru',
        max_adult: 3,
      },
      '4554333000000148003': {
        id: '4554333000000148003',
        week_day_bed_charge: 500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'Test Room',
        resort: 'Jungle Star, Valamuru',
        max_adult: 2,
      },
      '4554333000000159109': {
        id: '4554333000000159109',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Ambara',
        resort: 'Jungle Star, Valamuru',
        max_adult: 2,
      },
      '4554333000000110059': {
        id: '4554333000000110059',
        week_day_bed_charge: 500,
        cottage_type: 'Hill Top Guest House',
        max_guest: '',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'Panther',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000159127': {
        id: '4554333000000159127',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Vennela',
        resort: 'Jungle Star, Valamuru',
        max_adult: 2,
      },
      '4554333000000159007': {
        id: '4554333000000159007',
        week_day_bed_charge: 500,
        cottage_type: 'Pre-Fabricated Cottages',
        max_guest: '2',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'CHOUSINGHA',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000159025': {
        id: '4554333000000159025',
        week_day_bed_charge: 500,
        cottage_type: 'Deluxe Rooms',
        max_guest: '5',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'BAHUDA',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000110053': {
        id: '4554333000000110053',
        week_day_bed_charge: 500,
        cottage_type: 'Hill Top Guest House',
        max_guest: '',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'Bonnet',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000159103': {
        id: '4554333000000159103',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Aditya',
        resort: 'Jungle Star, Valamuru',
        max_adult: 2,
      },
      '4554333000000159049': {
        id: '4554333000000159049',
        week_day_bed_charge: 500,
        cottage_type: 'Wooden Cottages',
        max_guest: '2',
        week_day_rate: 4000,
        week_end_bed_charge: 700,
        week_end_rate: 4500,
        name: 'WOODPECKER',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000159031': {
        id: '4554333000000159031',
        week_day_bed_charge: 500,
        cottage_type: 'Deluxe Rooms',
        max_guest: '4',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'TAPATHI',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000159055': {
        id: '4554333000000159055',
        week_day_bed_charge: 500,
        cottage_type: 'Wooden Cottages',
        max_guest: '3',
        week_day_rate: 4000,
        week_end_bed_charge: 700,
        week_end_rate: 4500,
        name: 'KINGFISHER',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000159133': {
        id: '4554333000000159133',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Agathi',
        resort: 'Jungle Star, Valamuru',
        max_adult: 2,
      },
      '4554333000000159093': {
        id: '4554333000000159093',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Prakruti',
        resort: 'Jungle Star, Valamuru',
        max_adult: 2,
      },
      '4554333000000159073': {
        id: '4554333000000159073',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Aranya',
        resort: 'Jungle Star, Valamuru',
        max_adult: 2,
      },
      '4554333000000159019': {
        id: '4554333000000159019',
        week_day_bed_charge: 500,
        cottage_type: 'Deluxe Rooms',
        max_guest: '4',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'NARMADA',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000159013': {
        id: '4554333000000159013',
        week_day_bed_charge: 500,
        cottage_type: 'Pre-Fabricated Cottages',
        max_guest: '3',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'SAMBAR',
        resort: 'Vanavihari, Maredumilli',
        max_adult: 2,
      },
      '4554333000000110065': {
        id: '4554333000000110065',
        week_day_bed_charge: 500,
        cottage_type: 'Pre-Fabricated Cottages',
        max_guest: '',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'Bear',
        resort: 'vanavihari',
        max_adult: 2,
      },
      '4554333000000110141': {
        id: '4554333000000110141',
        week_day_bed_charge: 500,
        cottage_type: 'Pre-Fabricated Cottages',
        max_guest: '',
        week_day_rate: 2500,
        week_end_bed_charge: 700,
        week_end_rate: 3500,
        name: 'Chital',
        resort: 'vanavihari',
        max_adult: 2,
      },
      '4554333000000159037': {
        id: '4554333000000159037',
        week_day_bed_charge: 500,
        cottage_type: 'Wooden Cottages',
        max_guest: '4',
        week_day_rate: 4000,
        week_end_bed_charge: 700,
        week_end_rate: 4500,
        name: 'HORNBILL',
        resort: 'vanavihari',
        max_adult: 2,
      },
      '4554333000000159115': {
        id: '4554333000000159115',
        week_day_bed_charge: 1500,
        cottage_type: 'Jungle Star Cottage 1',
        max_guest: '2',
        week_day_rate: 5000,
        week_end_bed_charge: 1750,
        week_end_rate: 7500,
        name: 'Avani',
        resort: 'jungle-star',
        max_adult: 2,
      },
    };
    const jsonArray = Object.keys(json).map((key) => {
      return json[key];
      // return {
      //   id: key,
      //   ...json[key]
      // };
    });
    this.roomCards = this.mapRoomData(jsonArray, this.roomIds);
    this.roomCards = this.roomCards.filter(room => room.resort.toLowerCase().includes(this.bookingTypeResort));
    // console.log("this.roomCards------",this.roomCards)

    setTimeout(() => {
      this.loadingRooms = false;
    }, 2000);
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

    this.http.get<any[]>('./assets/json/rooms.json').subscribe(data => {
      console.log(data)
      this.roomData = data;
      this.filteredRoomData = this.filterByResort(this.selectedResort);
    });
    
    console.log(this.roomData);
    console.log(this.filteredRoomData);
  }
  checkIfNaN(value:any):boolean{
    return isNaN(value)
  }

  

  isAnyRoomChecked(): boolean {
    // Check if any room has the extra guest checkbox checked
    return this.roomData.some(
      (room: { isExtraGuestChecked: any }) => room.isExtraGuestChecked
    );
  }

  checkExtraGuest(room: any, roomId: any, inputbox: HTMLInputElement) {
    this.isAddedExtraGuest = inputbox.checked;
    let rm = this.roomCards.find((rm) => rm.id === roomId);
    if (this.checkIfNaN(inputbox.value)) {
      if (inputbox.checked) {
        if (rm) rm.noof_guest = 1;
        room.noof_guest = 1;
        room.isExtraGuestChecked = true;
        rm.isExtraGuestChecked = true;
      } else {
        if (rm) rm.noof_guest = 0;
        room.noof_guest = 0;
        const roomCard = this.roomCards.find((r) => r.id === roomId);
        if (roomCard) {
          roomCard.isExtraGuestChecked = false;
        }
        room.isExtraGuestChecked = false;
        rm.isExtraGuestChecked = false;
        this.totalExtraGuestCharges = this.calculateExtraGuestCharges();
      }
    } else {
      room.noof_guest = inputbox.value;
      if (rm) rm.noof_guest = inputbox.value;
      room.isExtraGuestChecked = false;
      rm.isExtraGuestChecked = false;

    }
    // this.calculateExtraGuestCount()
}



// calculateExtraGuestCount() {
//     // Reset count
//     this.extraGuestCount = 0;
//     // Loop through rooms to count extra guests
//     for (const room of this.roomData) {
//         if (room.noof_guest) {
//             this.extraGuestCount += room.noof_guest;
//         }
//     }
//     console.log(this.extraGuestCount)
// }


  

  mapRoomData(data: any[], roomIds: any[]): Room[] {
    return data.map((room) => ({
      id: room.id || 'Unknown',
      week_day_bed_charge: room.week_day_bed_charge || 0,
      cottage_type: room.cottage_type || 'Unknown',
      max_guest: room.max_guest || 0,
      week_day_rate: room.week_day_rate || 'Unknown',
      week_end_bed_charge: room.week_end_bed_charge || 'Unknown',
      week_end_rate: room.week_end_rate || 'Unknown',
      name: room.name || 'Unknown',
      resort: room.resort || 'Unknown',
      max_adult: room.max_adult || 3,
      // max_child: room.max_child || 0,
      noof_adult: room.max_adult,
      // noof_child: room.max_child,
      noof_guest: 0,
      week_day_guest_charge: room.week_day_guest_charge || 'Unknown',
      week_end_guest_charge: room.week_end_guest_charge || 'Unknown',
      is_button_disabled: this.toggleButtonDisabledById(room.id, roomIds),
      image: room.image || 'assets/img/bonnet/BONNET-OUTER-VIEW.jpg', // set a default image if it is not available
    }));
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
    return this.roomData.find((room: { _id: any }) => room._id === id);
  }

  checkIfWeekend(): void {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    this.isWeekend = currentDay === 0 || currentDay === 6; // Check if it's Saturday or Sunday
  }

  addRoom(room: any) {
    console.log(room);
    let foundRoom = this.roomIds.find((singRoom) => singRoom.id === room._id);
    console.log(foundRoom);

    this.roomIds.push(room._id);

    this.showBookingSummary = true;
    room.is_button_disabled = true;
    this.authService.setBookingRooms(this.bookingTypeResort, this.roomIds);
  }

  removeRoom(room: any, roomId: any) {
    const indexToRemove = this.roomIds.indexOf(roomId);

    // If the value is found, remove it from the array
    if (indexToRemove !== -1) {
      this.roomIds.splice(indexToRemove, 1);
    }

    // room.is_button_disabled = false;
    this.authService.setBookingRooms(this.bookingTypeResort, this.roomIds);
    // let rm = this.roomCards.find((rm) => rm.id === roomId);
    // if (rm) {
    //   rm.is_button_disabled = false;
    //   // Update the isChecked property of the corresponding room in roomCards array
    //   const roomCard = this.roomCards.find((r) => r.id === roomId);
    //   if (roomCard) {
    //     roomCard.isExtraGuestChecked = false;
    //   }

    //   // Recalculate the total extra guest charges
    //   this.totalExtraGuestCharges = this.calculateExtraGuestCharges();
    // }
  }

  calculateTotalPrice(): number {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isWeekend = currentDay === 0 || currentDay === 6; // Sunday or Saturday are considered weekend days

    let totalPrice = 0;
    for (const roomId of this.roomIds) {

      if (roomId) {
        totalPrice += roomId.week_day_rate + roomId.noof_guest * roomId.week_day_bed_charge;

      }
    }
    return totalPrice;
  }

  getRoomCharges(): number {
    let roomCharges = 0;
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.

    for (const roomId of this.roomIds) {
      const room = this.roomData.find((r: { _id: any }) => r._id === roomId);
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

    let totalPrice = 0;
    for (const roomId of this.roomIds) {
      if (roomId) {
        totalPrice += roomId.week_day_rate + roomId.noof_guest * roomId.week_day_bed_charge;
      }
    }
    totalPrice = (totalPrice * 12) / 100;

    return totalPrice;
  }

  calculatePayablePrice(): number {
    // console.log(this.checkExtraGuests())
    const totalPrice = this.calculateTotalPrice();
    const gstPercentage = 0.12; // GST @12%
    const gstAmount = totalPrice * gstPercentage;
    const payablePrice = totalPrice + gstAmount;
    return payablePrice;
  }
  goToBooking() {

    this.loadingRooms = true;
    setTimeout(() => {
      this.loadingRooms = false;
      this.router.navigate(['/booking-summary'], {
        queryParams: { bookingTypeResort: this.selectedResort },
      });
    }, 1000);
    

  }
  trackByRoomCard(index: number, card: any): string {
    return card.roomName;
  }

  calculateExtraGuestCharges() {
    const roomsWithExtraGuests = this.roomIds.filter(
      (room) => room.isExtraGuestChecked
    );
    this.totalExtraGuestCharges = 0;
    for (const room of roomsWithExtraGuests) {
      this.totalExtraGuestCharges += room.week_day_bed_charge;
    }

    localStorage.setItem(
      'totalExtraGuestCharges',
      this.totalExtraGuestCharges.toString()
    );
    return this.totalExtraGuestCharges;
    

  }
  settings = {
    counter: false,
    plugins: [lgZoom], // Include the lgZoom plugin
  };
  onBeforeSlide(detail: BeforeSlideDetail): void {
    const { index, prevIndex } = detail;
    // console.log(`Slide changed from ${prevIndex} to ${index}`);
  }
}
