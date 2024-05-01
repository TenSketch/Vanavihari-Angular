import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import lgZoom from 'lightgallery/plugins/zoom';
// import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
import { SearchService } from 'src/app/search.service';

import {
  Gallery,
  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
} from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //user
  currentUser: string;
  // Define an array to hold the image filenames
  imageFilenames: string[] = [];
  imageFilenames1: string[] = [];
  currentImage: string | null = null;
  items: GalleryItem[] = [];
  resortTypeId:String
  localLightBox : any
  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private authService: AuthService,
    private searchService: SearchService
  ) {

    for (let i = 2; i <= 16; i++) {
      this.imageFilenames.push(
        `assets/img/home-gallery/vanavihari-home-gallery-${i}.jpg`
      );
      this.imageFilenames1.push(
        `assets/img/home-gallery-junglestar/junglestar-home-gallery-${i}.jpg`
      );
    }
  }

  ngOnInit(): void {
    localStorage.setItem('booking_rooms', JSON.stringify([]));
    const lightboxRef = this.gallery.ref('lightbox');
    if (this.resortTypeId === 'vanavihari') {
      this.items = this.imageFilenames.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    } else {
      this.items = this.imageFilenames1.map(
        (item) => new ImageItem({ src: item, thumb: item })
      );
    }

    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Right,
    });
    lightboxRef.load(this.items);

    // Retrieve the logged-in user's data using the UserService
    const user = this.userService.getFullUser();
    this.currentUser = user ? user : '';
    //alert('Registration successful!');
  }

  // timer starts
  date: any;
  now: any;
  targetDate: any = new Date(2024, 4, 3); // May is 4th month (0-based index)
  targetTime: any = this.targetDate.getTime();
  difference: number;
  months: Array<string> = [
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
  currentTime: any = `${
    this.months[this.targetDate.getMonth()]
  } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;

  @ViewChild('days', { static: true }) days: ElementRef;
  @ViewChild('hours', { static: true }) hours: ElementRef;
  @ViewChild('minutes', { static: true }) minutes: ElementRef;
  @ViewChild('seconds', { static: true }) seconds: ElementRef;
  ngAfterViewInit() {
    setInterval(() => {
      this.tickTock();
      this.difference = this.targetTime - this.now;
      this.difference = this.difference / (1000 * 60 * 60 * 24);

      !isNaN(this.days.nativeElement.innerText)
        ? (this.days.nativeElement.innerText = Math.floor(this.difference))
        : (this.days.nativeElement.innerHTML = `<img src="https://i.gifer.com/VAyR.gif" />`);
    }, 1000);
  }
  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days.nativeElement.innerText = Math.floor(this.difference);
    this.hours.nativeElement.innerText = 23 - this.date.getHours();
    this.minutes.nativeElement.innerText = 60 - this.date.getMinutes();
    this.seconds.nativeElement.innerText = 60 - this.date.getSeconds();
  }
  // timer ends

  // settings = {
  //   counter: false,
  //   plugins: [lgZoom], // Include the lgZoom plugin
  // };

  // onBeforeSlide(detail: BeforeSlideDetail): void {
  //   const { index, prevIndex } = detail;
  // }
  openLightbox(index: number, id: string) {
    this.resortTypeId = id;
    this.ngOnInit()
    this.lightbox.setConfig({closeIcon: `<img src="assets/images/close.jpg">`});
    this.lightbox.open(index);
  }
  
  goToVanavihari() {
    this.authService.setSearchData( [{ resort:'Vanavihari, Maredumilli', checkin: '', checkout: '' }]);
    this.searchService.setSearchCriteria('Vanavihari, Maredumilli')
    this.authService.buttonClick$.next();
    this.router.navigate(['/resorts/rooms'],{queryParams: { bookingTypeResort: 'vanvihari' } });
  }
  goToJungleStar() {
    this.authService.setSearchData( [{ resort:'Jungle Star, Valamuru', checkin: '', checkout: '' }]);
    this.searchService.setSearchCriteria('Jungle Star, Valamuru')
    this.authService.buttonClick$.next();
    this.router.navigate(['/resorts/rooms'],{queryParams: { bookingTypeResort : "junglestar" } });
  }
}