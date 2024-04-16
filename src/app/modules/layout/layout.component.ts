import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
import { SearchService } from 'src/app/search.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(private router: Router, private userService: UserService, private authService: AuthService, private searchService: SearchService) {}
  accountusername: string = 'John Doe';
  isSidebarOpen: boolean = false;

  ngOnInit(): void {
    this.accountusername = this.userService.getFullUser();
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  logout(): void {
    this.userService.logout(); // Implement this method in UserService to clear authentication state

    this.router.navigate(['/home']);
    alert('Logout Successfully');
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
