import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(private router: Router, private userService: UserService, private authService: AuthService) {}
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
    this.authService.setSearchData( [{ resort: 'vanavihari', checkin: '', checkout: '' }]);
    this.authService.refreshRoomsComponent();
    this.router.navigate(['/resorts/rooms'],{queryParams: { bookingTypeResort: 'vanavihari' } });
    
  }

  goToJungleStar() {
    this.authService.setSearchData( [{ resort: 'jungle-star', checkin: '', checkout: '' }]);
    this.authService.refreshRoomsComponent();
    this.router.navigate(['/resorts/rooms'],{queryParams: { bookingTypeResort : "jungle" } });
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
