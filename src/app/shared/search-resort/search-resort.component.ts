import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from 'src/app/search.service';
import * as e from 'cors';
import { thumbnailsSettings } from 'lightgallery/plugins/thumbnail/lg-thumbnail-settings';

@Component({
  selector: 'app-search-resort',
  templateUrl: './search-resort.component.html',
  styleUrls: ['./search-resort.component.scss'],
  providers: [DatePipe]
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
  currentDate: any;
  minDate: Date;
  firstResort: string;
  previousResort: string;
  @ViewChild('confirmationModal') confirmationModal: ElementRef;

  constructor(private searchService:SearchService,private router: Router,private snackBar: MatSnackBar, private route: ActivatedRoute, private authService: AuthService, private formBuilder: FormBuilder, private sharedService: SharedService, private datePipe: DatePipe) {
    
     // Set the minimum to the next date from the present date.
     const currentDate = new Date();
     currentDate.setDate(currentDate.getDate() + 1); // Increment current date by 1 day
     this.minDate = currentDate;
    this.searchForm = this.formBuilder.group({
      selectedResort: [],
      checkinDate: [],
      checkoutDate: []
    });
   
    this.updateAgeDropdowns();
    this.RoomValues = 'Adult-' + 2 + ' Children- ' + 0 + ' Rooms-' + 1;
    
    if(this.authService.getSearchData("resort")) this.selectedResort = this.authService.getSearchData("resort");
    if(this.authService.getSearchData("checkin")) this.checkinDate = this.formatDateForMatDatepicker(this.authService.getSearchData("checkin"));
    if(this.authService.getSearchData("checkout")) this.checkoutDate = this.formatDateForMatDatepicker(this.authService.getSearchData("checkout"));
    this.currentDate = new Date();
    this.checkinDate = this.authService.getSearchData('checkin')
    this.checkoutDate = this.authService.getSearchData('checkout')

    this.firstResort= '';
     this.previousResort='';
  }
  ngOnInit(): void {
  }

  isModalVisible: boolean = false;

  triggerModal() {
    this.isModalVisible = true;
  }

  onCancel() {
    this.isModalVisible = false;
    window.location.reload(); // Reload the page
  }

  onConfirm() {
    this.isModalVisible = false;
 }
 
  setMinCheckoutDate(){
    if (this.checkinDate) {
      const minDate = new Date(this.checkinDate);
      minDate.setDate(minDate.getDate() + 1); // Add one day to the checkinDate
      return minDate;
    }
    return null;
  }

  formatDateForMatDatepicker(date: string): string {
    let parts = date.split("/");
    let y = parseInt(parts[2], 10);
    let m = parseInt(parts[0], 10) - 1;
    let d = parseInt(parts[1], 10);
    let desiredDate = new Date(y, m, d);
    let day = desiredDate.getDate();
    let month = desiredDate.getMonth() + 1;
    let year = desiredDate.getFullYear();
    return `${year}-${this.pad(month)}-${this.pad(day)}`;
  }
  pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
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
  }
  
 
  bookingTypeResort: string;

  onSelectResortOpen(event: any): void {
    // const result = confirm(`you have added rooms from "${this.selectedResort}", now you are about to switch to another resort. Added rooms will be deleted. Switch anyway?`);
    // if (result) {
       
        
    // } else {
     
    // }
    this.triggerModal()
  }

  confirmResortChange(newValue:string){
    this.authService.clearBookingRooms(this.bookingTypeResort)
    this.submitSearch()
    window.location.reload(); // Reload the page

  }

  submitSearch() {
    console.log(this.selectedResort)
    this.authService.setSearchData( [{ resort: this.selectedResort, checkin: this.checkinDate, checkout: this.checkoutDate }]);
    console.log(this.selectedResort)
    this.searchService.setSearchCriteria(this.selectedResort)
    this.authService.refreshRoomsComponent()

    this.authService.buttonClick$.next();
    this.router.navigate(['resorts/rooms']);
  }
 

  onDateChange(type: string, event: any): void {
    let formattedDate: string;
    if (event && event instanceof Date) {
      let year = event.getFullYear();
      let month = ('0' + (event.getMonth() + 1)).slice(-2);
      let day = ('0' + event.getDate()).slice(-2);
      formattedDate = `${month}/${day}/${year}`;
    } else {
      formattedDate = '';
    }
    if (type === 'checkin') {
      this.checkinDate = formattedDate;
    } else if (type === 'checkout') {
      this.checkoutDate = formattedDate;
    }    
  }
  getCurrentDate() {
    return this.formatDate(this.currentDate);
  }
  checkIfCheckinDateIsCurrentDate() {
    console.log("this.getCurrentDate()",this.getCurrentDate())
      if (this.checkinDate === this.getCurrentDate()) {
        this.snackBar.open('Check-in cannot be processed for the current date.', 'Close', {
          duration: 5000,
          horizontalPosition:'right'
        });
      }
    }
    formatDate(date: Date): string {
      const monthNames = [
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
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const formattedDate = `${day}-${monthNames[monthIndex]}-${year}`;
      console.log('date===', formattedDate);
      return formattedDate;
    }
}
