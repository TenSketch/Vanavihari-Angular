import { AuthService } from '@/app/auth.service';
import { GalleryService } from '@/app/gallery.service';
import { UserService } from '@/app/user.service';
import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { HmacSHA256 } from 'crypto-js';

@Component({
  selector: 'app-test-bookings',
  templateUrl: './test-bookings.component.html',
  styleUrls: ['./test-bookings.component.scss']
})
export class TestBookingsComponent {
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
  pdfUrl: string = 'assets/PDF/Foodmenu.pdf'; // Path to your PDF file in the assets folder

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private http: HttpClient,
    private userService: UserService,
    private galleryService: GalleryService,
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




  refundTest() {
    
    

    
    const bookingId = 'BVV2406127';
    const MerchantId = 'VANAVIHARI';
    const CurrencyType = 'INR';
    const SecurityId = 'vanavihari';
    const txtCustomerID = 'BK986239234';
    const secretKey = 'rmvlozE7R4v9';
    const amount = '10.00';
    const rU = this.api_url + '?api_type=get_payment_response';

    const str = '0400'+
    '|'+
    MerchantId+
    '|'+
    'ZHD52065322042'+
    '|'+
    '20240612'+
    '|'+
    txtCustomerID+
    '|'+
    '12.00'+
    '|'+
    '12.00'+
    '|'+
    '20240612141615'+
    '|'+
    '12121212'+
    '|'+
    'NA|NA|NA';

    const hmac = HmacSHA256(str, secretKey);
    const checksum = hmac.toString().toUpperCase();
    const msg = `${str}|${checksum}`;
    alert(msg);
    
    let pg_params = new HttpParams()
      .set('MerchantId', MerchantId)
      .set('CurrencyType', CurrencyType)
      .set('SecurityId', SecurityId)
      .set('txtCustomerID', txtCustomerID)
      .set('txtTxnAmount', amount)
      .set('txtAdditionalInfo1', 'MMILLI') // Sub Biller id
      .set('txtAdditionalInfo2', bookingId)
      .set('txtAdditionalInfo3', "Venkat")
      .set('txtAdditionalInfo4', '918056562076')
      .set('RU', rU)
      .set('CheckSumKey', secretKey)
      .set('CheckSum', checksum)
      .set('msg', msg);

    const form = document.createElement('form');
    form.method = 'post';
    form.action = 'https://pgi.billdesk.com/pgidsk/PGIRefundController';
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
}