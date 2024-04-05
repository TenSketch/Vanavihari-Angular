import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-search-resort',
  templateUrl: './search-resort.component.html',
  styleUrls: ['./search-resort.component.scss'],
})
export class SearchResortComponent implements OnInit {
  searchForm: FormGroup;
  @ViewChild('modal') modal: ElementRef;
  adultsCount: number = 1;
  childrenCount: number = 0;
  isMaxReached: boolean = false;
  maxChildren: number = 10;
  roomsCount: number = 1;
  selectedAges: string[] = [];
  ageDropdowns: number[];
  RoomValues: any;
  //selectedResort: string = "vanavihari";
  selectedResort: string;
  checkinDate: string;
  checkoutDate: string;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private formBuilder: FormBuilder, private sharedService: SharedService) {
    this.searchForm = this.formBuilder.group({
      selectedResort: [],
      checkinDate: [],
      checkoutDate: []
    });
    this.updateAgeDropdowns();
    this.RoomValues = 'Adult-' + 2 + ' Children- ' + 0 + ' Rooms-' + 1;
  }
  ngOnInit(): void {
    if(this.authService.getSearchData("resort")) this.selectedResort = this.authService.getSearchData("resort");
    if(this.authService.getSearchData("checkin")) this.checkinDate = this.convertDateFormat(this.authService.getSearchData("checkin"));
    if(this.authService.getSearchData("checkout")) this.checkoutDate = this.convertDateFormat(this.authService.getSearchData("checkout"));
  }
  convertDateFormat(dateString: string): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const [day, monthAbbr, year] = dateString.split('-');
    const monthIndex = months.findIndex(m => m === monthAbbr) + 1;
    const month = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }
  decrementAdults() {
    if (this.adultsCount > 1) {
      this.adultsCount--;
    }
  }

  incrementAdults() {
    this.adultsCount++;
  }

  incrementChildren() {
    if (this.childrenCount < this.maxChildren) {
      this.childrenCount++;
      this.selectedAges = Array(this.childrenCount).fill('');
      this.isMaxReached = false;
    } else {
      this.isMaxReached = true;
    }
  }

  decrementChildren() {
    if (this.childrenCount > 0) {
      this.childrenCount--;
      this.selectedAges.pop();
      this.isMaxReached = false;
    }
  }
  getChildrenCountArray() {
    return Array(this.childrenCount)
      .fill(0)
      .map((x, i) => i);
  }

  decrementRooms() {
    if (this.roomsCount > 1) {
      this.roomsCount--;
    }
  }

  incrementRooms() {
    this.roomsCount++;
  }

  updateAgeDropdowns() {
    this.ageDropdowns = [];
    for (let i = 0; i < this.childrenCount; i++) {
      this.ageDropdowns.push(i);
    }
    while (this.selectedAges.length < this.childrenCount) {
      this.selectedAges.push('');
    }
  }

  getvalues(roomsCount: any, adultsCount: any) {
    this.RoomValues =
      'Adult-' +
      this.adultsCount +
      ' Children- ' +
      this.childrenCount +
      ' Rooms-' +
      this.roomsCount;
    console.log(this.roomsCount, this.adultsCount);
  }
  
  // onResortChange(): void {
  //   switch (this.selectedResort) {
  //     case 'vanavihari':
  //       this.goToVanavihari();
  //       break;
  //     case 'jungle-star':
  //       this.goToJungleStar();
  //       break;
  //     default:
  //       // Handle default case if needed
  //       break;
  //   }
  // }

  goToVanavihari() {
    this.authService.setSearchData( [{ resort: this.selectedResort, checkin: this.checkinDate, checkout: this.checkoutDate }]);
    //this.router.navigate(['/resorts/vanavihari-maredumilli']);
    this.router.navigate(['/resorts/rooms']);
    // this.router.navigate(['/resorts/rooms']).then(() => {
    //   window.location.reload(); // Reload the page
    // });
    this.sharedService.triggerFetchRoomList();
    this.authService.refreshRoomsComponent();
  }
  // goToJungleStar() {
  //   this.authService.setSearchData( [{ resort: this.selectedResort, checkin: this.checkinDate, checkout: this.checkoutDate }]);
  //   //this.router.navigate(['resorts/jungleStar,Valamuru']);
  //   this.router.navigate(['/resorts/rooms']);
  //   this.sharedService.triggerFetchRoomList();
  // }
  // goToRooms(){
  //   this.router.navigate(['/resorts/rooms' ]);
  // }

  onDateChange(type: string, event: any): void {
    let formattedDate: string;

    if (event && event instanceof Date) {
      const year = event.getFullYear();
      const month = ('0' + (event.getMonth() + 1)).slice(-2);
      const day = ('0' + event.getDate()).slice(-2);
      formattedDate = `${year}-${month}-${day}`;
    } else {
      formattedDate = '';
    }

    if (type === 'checkin') {
      this.checkinDate = formattedDate;
    } else if (type === 'checkout') {
      this.checkoutDate = formattedDate;
    }
  }

  formatDate(date: Date): string {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const formattedDate = `${day}-${monthNames[monthIndex]}-${year}`;
    return formattedDate;
  }

}
