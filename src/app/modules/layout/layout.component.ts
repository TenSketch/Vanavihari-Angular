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
  userData:any
  resortNumber:any
  resortAddress:any
  resortEmail:any
  selectedResort:any
  private subscription : Subscription
  showLoader = false

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private searchService: SearchService, private http:HttpClient) {
    
    this.subscription = this.authService.buttonClick$.subscribe(() => {
      // Retrieve data when button is clicked
      this.selectedResort = this.authService.getSearchData('resort');
      if(this.selectedResort=='Vanavihari, Maredumilli'){
        this.resortNumber = '+919494151623'
        this.resortAddress = 'Vanavihari Eco-tourism Complex, Maredumilli, Andhra Pradesh 533295'
        this.resortEmail = 'info@vanavihari.com'
      }
      if(this.selectedResort=='Jungle Star, Valamuru'){
        this.resortNumber = '+9173821 51617'
        this.resortAddress = 'Jungle Nature Camp Site Treck Path Valamuru, Andhra Pradesh 533295'
        this.resortEmail = 'junglestarecocamp@gmail.com'
      }
      
    });

    this.selectedResort = this.authService.getSearchData('resort');
    if(this.selectedResort=='Vanavihari, Maredumilli'){
      this.resortNumber = '+919494151623'
      this.resortAddress = 'Vanavihari Eco-tourism Complex, Maredumilli, Andhra Pradesh 533295'
        this.resortEmail = 'info@vanavihari.com'
    }
    if(this.selectedResort=='Jungle Star, Valamuru'){
      this.resortNumber = '+9173821 51617'
      this.resortAddress = 'Jungle Nature Camp Site Treck Path Valamuru, Andhra Pradesh 533295'
        this.resortEmail = 'junglestarecocamp@gmail.com'
    }
  }



  
  ngOnInit(): void {
    this.accountusername = this.userService.getFullUser();
    // this.getUserData()
    
  }


  getUserData(){
    const params = new HttpParams()
      .set('email', this.authService.getAccountUsername()??'')
      .set('token', this.authService.getAccessToken()??'');
    this.http.get<any>('https://vanavihari.com/zoho-connect?api_type=profile_details', {params}).subscribe({
      next: response => {
        if(response.code == 3000 && response.result.status == 'success') {
          this.userData = response.result
        } else if (response.code == 3000) {
          this.userService.clearUser();
          // alert('Login Error!');
          // this.router.navigate(['/home']);
        } else {
          this.userService.clearUser();
          // alert('Login Error!');
          // this.router.navigate(['/home']);
        }
      },
      error: err => {
        console.error('Error:', err);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  logout(): void {
    this.showLoader = true
    setTimeout(()=>{
      this.showLoader = false
      this.userService.logout();
      this.router.navigate(['/home']);
    },1000)
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
    
    this.authService.setSearchData([{ resort: 'Vanavihari, Maredumilli', checkin: '', checkout: '' }]);
    this.searchService.setSearchCriteria('Vanavihari, Maredumilli');
    this.authService.buttonClick$.next();
    this.authService.removeRooms()
    // Update query parameters without reloading the page
    this.router.navigate(['/resorts/rooms'], {
      queryParams: { bookingTypeResort: 'vanvihari' },
      queryParamsHandling: 'merge' // Merge new query params with existing ones
    });
    // setTimeout(()=>{
    //   window.location.reload()
    // },500)



  }

  goToJungleStar() {
    this.authService.setSearchData( [{ resort:'Jungle Star, Valamuru', checkin: '', checkout: '' }]);
    
    this.searchService.setSearchCriteria('Jungle Star, Valamuru')
    this.authService.buttonClick$.next();
    this.authService.removeRooms()

    this.router.navigate(['/resorts/rooms'], {
      queryParams: { bookingTypeResort: 'junglestar' },
      queryParamsHandling: 'merge' // Merge new query params with existing ones
    });  
    // setTimeout(()=>{
    //   window.location.reload()
    // },500)
  }
  goToTourist()
  {
    this.router.navigate(['/tourist-destination']);
  }
  goToTribalPg() {
    this.router.navigate(['/tribal-community']);
  } 
  goToPrivacy()
  {
    this.router.navigate(['/privacy-policy']);
  }
  goToPaymentPolicy()
  {
    this.router.navigate(['/payment-policy']);
  }
  goToAwards()
  {
    this.router.navigate(['/awards-and-publications']);
  }
  goToTerms() {
    this.router.navigate(['/terms-and-conditions']);
  } 
}
