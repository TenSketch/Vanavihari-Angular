import { Component, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from '../../user.service';
import { GalleryService } from '@/app/gallery.service';
import { AuthService } from '@/app/auth.service';
import {  SafeUrl } from '@angular/platform-browser';
import { environment } from '@/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent {
  bookingData: any[] = [];
  successData: any[] = [];
  message: any;
  formattedDate: { day: string; month: string };
  noBookings = false;
  showLoader = false;
  selectedResort: any;
  resortNumber: any;
  // pdfUrl: any;
  showPdfViewer: boolean = false;
  api_url:any
  confirmCancel = false
  pdfUrl: string = 'assets/PDF/Foodmenu.pdf'; // Path to your PDF file in the assets folder
  cancellationReason: string = '';

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private http: HttpClient,
    private userService: UserService,
    private galleryService: GalleryService,
    private router:Router
  ) {
    this.api_url = environment.API_URL
  }

  ngOnInit(): void {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);

   

    this.showLoader = true;
    let params = new HttpParams()
      .set('email', this.userService.getUser())
      .set('token', this.userService.getUserToken());
    this.http
      .get<any>(
        this.api_url+'?api_type=booking_history&' +
          params.toString()
      )
      .subscribe({
        next: (response) => {
          this.bookingData = response.result.details;
          this.showLoader = false;
          this.bookingData.forEach(item => {
            if (item.pay_trans_id) {
                this.successData.push(item);
            }
        });
          if (this.bookingData.length == 0) {
            this.message = 'You have not made any bookings yet';
            this.noBookings = true;
          }

         this.bookingData.sort((a, b) => {
          const dateA = new Date(a.reservation_date);
          const dateB = new Date(b.reservation_date);
          return dateB.getTime() - dateA.getTime();
        });
        },
        error: (err) => {
          this.noBookings = true;
          this.showLoader = false;
          this.message = err;
        },
      });
  }

  

  confirmCancelAction(){
    this.confirmCancel = true
  }

  // initializing cancel request.

  submitCancellationRequest(){
      console.log(this.cancellationReason)
  }

  // Function to download PDF
  downloadPdf() {
    const link = document.createElement('a');
    link.href = 'assets/PDF/Foodmenu.pdf'; // Path to your PDF file in the assets folder
    link.download = 'Foodmenu.pdf'; // Name of the downloaded file
    link.click();
  }

  callSupport(resort:any) {
    this.selectedResort = resort
          if (this.selectedResort == 'Vanavihari, Maredumilli') {
            this.resortNumber = '+919494151623';
          }
          if (this.selectedResort == 'Jungle Star, Valamuru') {
            this.resortNumber = '+9173821 51617';
          }
    window.location.href = 'tel:' + this.resortNumber;
  }

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

  formatDate(dateStr: string): { day: string; month: string; year: string } {
    const date = new Date(dateStr);
    const day = date.getDate().toString();
    const month = this.getMonthName(date.getMonth());
    const year = date.getFullYear().toString();
    return { day, month, year };
  }

  getMonthName(month: number): string {
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
    return months[month];
  }

  fetchRoomList() {
    interface ReservationDetails {
      checkin: string;
      noof_guest: number;
      noof_adult: number;
      noof_child: number;
      checkout: string;
      noof_rooms: number;
      rooms: {
        name: string;
        cottage: string;
        restort: string;
      };
    }

    // // Sample JSON object with the defined type
    const json: { [key: string]: ReservationDetails } = {
      0: {
        rooms: {
          name: 'Bonnet',
          cottage: 'Hill Top Guest House',
          restort: 'Vanavihari, Maredumilli',
        },
        checkin: '2024-03-03',
        noof_guest: 0,
        noof_adult: 2,
        noof_child: 0,
        checkout: '2024-03-19',
        noof_rooms: 1,
      },
      1: {
        rooms: {
          name: 'Bear',
          cottage: 'Pre-Fabricated Cottages',
          restort: 'Vanavihari, Maredumilli',
        },
        checkin: '2024-03-19',
        noof_guest: 0,
        noof_adult: 1,
        noof_child: 0,
        checkout: '2024-03-19',
        noof_rooms: 0,
      },
      2: {
        rooms: {
          name: 'CHOUSINGHA',
          cottage: 'Pre-Fabricated Cottages',
          restort: 'Vanavihari, Maredumilli',
        },
        checkin: '2024-03-13',
        noof_guest: 1,
        noof_adult: 5,
        noof_child: 2,
        checkout: '2024-03-13',
        noof_rooms: 0,
      },
    };
    const jsonArray = Object.keys(json).map((key) => {
      return json[key];
      return {
        id: key,
        ...json[key],
      };
    });

    // this.roomCards = this.mapRoomData(jsonArray, this.roomIds);

    // setTimeout(() => {
    //    this.loadingRooms = false;
    // }, 2000);
  }

  InitiateCancel(item:any){
    localStorage.setItem('current_id',item.booking_id)
    localStorage.setItem('Payment_Transaction_Id',item.pay_trans_id)
    localStorage.setItem('Payment_Transaction_Date',item.pay_trans_date)
    localStorage.setItem('Payment_Transaction_Amt',item.pay_trans_amt)

    this.router.navigateByUrl('cancel-request');
  }
}
