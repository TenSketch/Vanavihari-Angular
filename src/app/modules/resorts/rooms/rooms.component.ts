import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnDestroy{
  searchResortData: any;
  resorts: any = {
    'vanavihari': {
      title: 'Vanavihari',
      about: 'About Vanavihari'
    },
    'jungle-star': {
      title: 'Jungle Star',
      about: 'About Jungle Star'
    }
  };
  selectedResortInfo: any = {};
  private subscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getSelectedResortInfo();
    this.searchResortData = this.authService.getSearchData(null);
    console.log('Search resort data:', this.searchResortData);
    this.getSelectedResortInfo();
    this.subscription = this.authService.refreshRoomsComponent$.subscribe(() => {
      this.getSelectedResortInfo();
    });
    // const selectedResort = this.searchResortData.resort;
    // console.log(selectedResort);
    
    // if (selectedResort) {
    //   this.selectedResortInfo = this.resorts[selectedResort];
    //   console.log(this.selectedResortInfo); 
    // }
    // const checkinDate = this.searchResortData.checkin;
    // const checkoutDate = this.searchResortData.checkout;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getSelectedResortInfo(): void {
    const selectedResort = this.authService.getSearchData('resort');
    console.log(selectedResort);
    
    if (selectedResort) {
      this.selectedResortInfo = this.resorts[selectedResort];
    }
  }

  // refreshPage(): void {
  //   window.location.reload(); // Reload the page
  // }

}
