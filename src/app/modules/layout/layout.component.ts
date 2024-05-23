import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
import { SearchService } from 'src/app/search.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  accountusername: string = 'John Doe';
  isSidebarOpen: boolean = false;
  userData: any;
  resortNumber: any;
  resortAddress: any;
  resortEmail: any;
  selectedResort: any;
  private subscription: Subscription;
  showLoader = false;
  isMobileOrTablet: boolean = false;
  isModalVisible = false

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private searchService: SearchService,
    private http: HttpClient
  ) {
    const screenWidth = window.innerWidth;
    // Define your breakpoint for mobile and tablet devices
    const mobileBreakpoint = 768; // Example: below 768px is considered mobile
    const tabletBreakpoint = 1024; // Example: between 768px and 1024px is considered tablet

    this.isMobileOrTablet = screenWidth < mobileBreakpoint || screenWidth < tabletBreakpoint;
    
    this.subscription = this.authService.buttonClick$.subscribe(() => {
      // Retrieve data when button is clicked
      this.selectedResort = this.authService.getSearchData('resort');
      if (this.selectedResort == 'Vanavihari, Maredumilli') {
        this.resortNumber = '+919494151617';
        this.resortAddress =
          'Vanavihari Eco-tourism Complex, Maredumilli, Andhra Pradesh 533295';
        this.resortEmail = 'info@vanavihari.com';
      }
      if (this.selectedResort == 'Jungle Star, Valamuru') {
        this.resortNumber = '+917382151617';
        this.resortAddress =
          'Jungle Nature Camp Site Treck Path Valamuru, Andhra Pradesh 533295';
        this.resortEmail = 'junglestarecocamp@gmail.com';
      }
    });

    this.selectedResort = this.authService.getSearchData('resort');
    if (this.selectedResort == 'Vanavihari, Maredumilli') {
      this.resortNumber = '+919494151617';
      this.resortAddress =
        'Vanavihari Eco-tourism Complex, Maredumilli, Andhra Pradesh 533295';
      this.resortEmail = 'info@vanavihari.com';
    }
    if (this.selectedResort == 'Jungle Star, Valamuru') {
      this.resortNumber = '+917382151617';
      this.resortAddress =
        'Jungle Nature Camp Site Treck Path Valamuru, Andhra Pradesh 533295';
      this.resortEmail = 'junglestarecocamp@gmail.com';
    }
  }

  ngOnInit(): void {
    this.accountusername = this.userService.getFullUser();
    // this.getUserData()
  }

  // getUserData() {
  //   const params = new HttpParams()
  //     .set('email', this.authService.getAccountUsername() ?? '')
  //     .set('token', this.authService.getAccessToken() ?? '');
  //   this.http
  //     .get<any>(
  //       'https://vanavihari.com/zoho-connect?api_type=profile_details',
  //       { params }
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         if (response.code == 3000 && response.result.status == 'success') {
  //           this.userData = response.result;
  //         } else if (response.code == 3000) {
  //           this.userService.clearUser();
            
  //         } else {
  //           this.userService.clearUser();
           
  //         }
  //       },
  //       error: (err) => {
  //       },
  //     });
  // }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  logout(): void {
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.userService.logout();
      this.router.navigate(['/home']);
    }, 1000);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('#sidebar') &&
      !targetElement.closest('.navbar-toggler')
    ) {
      this.closeSidebar();
    }
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToSignin() {
    this.router.navigate(['/sign-in']);
  }

  goToAboutUs() {
    this.router.navigate(['/about-vanavihari']);
  }

  goToMyAccSettings() {
    this.router.navigate(['/my-account/settings']);
  }

  goToMyBookings() {
    this.router.navigate(['/my-account/my-bookings']);
  }

  goToVanavihari() {
    this.authService.setSearchData([
      { resort: 'Vanavihari, Maredumilli', checkin: '', checkout: '' },
    ]);
    this.searchService.setSearchCriteria('Vanavihari, Maredumilli');
    this.authService.buttonClick$.next();
    this.authService.removeRooms();
    this.router.navigate(['/resorts/rooms'], {
      queryParams: { bookingTypeResort: this.selectedResort },
      queryParamsHandling: 'merge',
    });
    let status = localStorage.getItem('isSummary')
    if(status=='no'){
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    }
  }

  triggerModal(){
    this.isModalVisible = true
  }

  onCancel() {
    this.isModalVisible = false;
  }
  
  onConfirm(){
    this.isModalVisible = false;
    this.logout()
  }

  goToJungleStar() {
    this.authService.setSearchData([
      { resort: 'Jungle Star, Valamuru', checkin: '', checkout: '' },
    ]);

    this.searchService.setSearchCriteria('Jungle Star, Valamuru');
    this.authService.buttonClick$.next();
    this.authService.removeRooms();

    this.router.navigate(['/resorts/rooms'], {
      queryParams: { bookingTypeResort: 'junglestar' },
      queryParamsHandling: 'merge',
    });
    let status = localStorage.getItem('isSummary')
    if(status=='no'){
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    }
  }

  // vanavihariRoute(){
  //   this.router.navigate(['/resorts/vanavihari-maredumilli'])
  // }
  // jungleStarRoute(){
  //   this.router.navigate(['/resorts/junglestar-valamuru'])

  // }

  goToTourist() {
    this.router.navigate(['/tourist-destination']);
  }

  goToTribalPg() {
    this.router.navigate(['/tribal-community']);
  }

  goToBiodiversity() {
    this.router.navigate(['/biodiversity-zone']);
  }

  goToPrivacy() {
    this.router.navigate(['/privacy-policy']);
  }

  goToPaymentPolicy() {
    this.router.navigate(['/payment-policy']);
  }

  goToAwards() {
    this.router.navigate(['/awards-and-publications']);
  }

  goToTerms() {
    this.router.navigate(['/terms-and-conditions']);
  }
  goToContact() {
    this.router.navigate(['/contact-us']);
  }
  
}
