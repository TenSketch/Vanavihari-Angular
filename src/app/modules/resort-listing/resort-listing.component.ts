import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-resort-listing',
  templateUrl: './resort-listing.component.html',
  styleUrls: ['./resort-listing.component.scss']
})
export class ResortListingComponent {
  constructor(private router: Router, private userService: UserService) {}

  isSidebarOpen: boolean =false;
  showBookingSummary: boolean =false;
  toggleSidebar(){
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebar()
  {
    this.isSidebarOpen = false;
  }
  addRoom()
  {
    this.showBookingSummary=true;
  }
  goToBooking()
  {
    this.router.navigate(['/booking-summary']);
  }
}
