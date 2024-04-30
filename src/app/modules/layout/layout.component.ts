import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
import { SearchService } from 'src/app/search.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(private router: Router, private userService: UserService, private authService: AuthService, private searchService: SearchService, private http:HttpClient) {}
  accountusername: string = 'John Doe';
  isSidebarOpen: boolean = false;
  userData:any

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
    this.userService.logout(); // Implement this method in UserService to clear authentication state

    this.router.navigate(['/home']);
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
    
    // Update query parameters without reloading the page
    this.router.navigate(['/resorts/rooms'], {
      queryParams: { bookingTypeResort: 'vanvihari' },
      queryParamsHandling: 'merge' // Merge new query params with existing ones
    });
    
    window.location.reload()

  }

  goToJungleStar() {
    this.authService.setSearchData( [{ resort:'Jungle Star, Valamuru', checkin: '', checkout: '' }]);
    
    this.searchService.setSearchCriteria('Jungle Star, Valamuru')
    this.authService.buttonClick$.next();
    this.router.navigate(['/resorts/rooms'], {
      queryParams: { bookingTypeResort: 'junglestar' },
      queryParamsHandling: 'merge' // Merge new query params with existing ones
    });  
    window.location.reload()

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
