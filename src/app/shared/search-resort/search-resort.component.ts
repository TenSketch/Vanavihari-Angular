import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SearchService } from 'src/app/search.service';
import * as e from 'cors';

@Component({
  selector: 'app-search-resort',
  templateUrl: './search-resort.component.html',
  styleUrls: ['./search-resort.component.scss'],
  providers: [DatePipe],
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
  selectionChanged = false;

  @ViewChild('confirmationModal') confirmationModal: ElementRef;

  constructor(
    private searchService: SearchService,
    private router: Router,
   private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    // Set the minimum to the next date from the present date.
    const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 1); // Increment current date by 1 day
    this.minDate = currentDate;
    this.searchForm = this.formBuilder.group({
      selectedResort: [],
      checkinDate: [],
      checkoutDate: [],
    });

    this.selectedResort = this.authService.getSearchData('resort');
    this.checkinDate = this.authService.getSearchData('checkin');
    this.checkoutDate = this.authService.getSearchData('checkout');

  

    this.RoomValues = 'Adult-' + 2 + ' Children- ' + 0 + ' Rooms-' + 1;

   
    this.currentDate = new Date();
    this.checkinDate = this.authService.getSearchData('checkin');
    this.checkoutDate = this.authService.getSearchData('checkout');

    this.firstResort = '';
    this.previousResort = this.authService.getSearchData('resort');
  }
  ngOnInit(): void {}

  isModalVisible: boolean = false;

  triggerModal() {
    this.isModalVisible = true;
    this.selectionChanged = false;
  }

  onCancel() {
    this.isModalVisible = false;
  }

  onConfirm() {
    this.isModalVisible = false;
    this.authService.setSearchData([
      {
        resort: this.selectedResort,
        checkin: this.checkinDate,
        checkout: this.checkoutDate,
      },
    ]);
    this.searchService.setSearchCriteria(this.selectedResort);
    this.authService.refreshRoomsComponent();

    this.authService.buttonClick$.next();
    localStorage.setItem('booking_rooms', JSON.stringify([]));
    window.location.reload();
    this.router.navigate(['resorts/rooms']);
  }

  setMinCheckoutDate() {
    if (this.checkinDate) {
      const minDate = new Date(this.checkinDate);
      minDate.setDate(minDate.getDate() + 1); // Add one day to the checkinDate
      return minDate;
    }
    return null;
  }

 
  
  submitSearch() {
    let bookingRooms = JSON.stringify(localStorage.getItem('booking_rooms'));
    let array = JSON.parse(bookingRooms);

    const dateString = this.checkinDate;
    const date = new Date(dateString);
    const date2 = new Date(this.checkoutDate);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    date2.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const checkinDateString = date.toISOString();
    const checkoutDateString = date2.toISOString();

    if (array == null) {
      this.authService.setSearchData([
        {
          resort: this.selectedResort,
          checkin: checkinDateString,
          checkout: checkoutDateString,
        },
      ]);
      this.searchService.setSearchCriteria(this.selectedResort);
      this.authService.refreshRoomsComponent();

      this.authService.buttonClick$.next();
      this.router.navigate(['resorts/rooms']);
    } else {
      if (this.selectionChanged && array.length !== 2) {
        this.triggerModal();
      } else {
        this.authService.setSearchData([
          {
            resort: this.selectedResort,
            checkin: checkinDateString,
            checkout: checkoutDateString,
          },
        ]);
        this.searchService.setSearchCriteria(this.selectedResort);
        this.authService.refreshRoomsComponent();

        this.authService.buttonClick$.next();
        this.router.navigate(['resorts/rooms']);
      }
    }
  }
}
