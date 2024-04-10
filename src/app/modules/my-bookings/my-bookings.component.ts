import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent {

  constructor(private http: HttpClient, private userService: UserService) {}
  ngOnInit(): void {
    let params = new HttpParams()
    .set('email', this.userService.getUser())
    .set('token', this.userService.getUserToken());
    this.http
      .get<any>(
        'https://vanavihari.com/zoho-connect?api_type=booking_history&'+params.toString()
      )
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.error('Error:', err);
        },
    });
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
                name: "Bonnet",
                cottage: "Hill Top Guest House",
                restort: "Vanavihari, Maredumilli"
            },
            checkin: "2024-03-03",
            noof_guest: 0,
            noof_adult: 2,
            noof_child: 0,
            checkout: "2024-03-19",
            noof_rooms: 1
        },
        1: {
            rooms: {
                name: "Bear",
                cottage: "Pre-Fabricated Cottages",
                restort: "Vanavihari, Maredumilli"
            },
            checkin: "2024-03-19",
            noof_guest: 0,
            noof_adult: 1,
            noof_child: 0,
            checkout: "2024-03-19",
            noof_rooms: 0
        },
        2: {
            rooms: {
                name: "CHOUSINGHA",
                cottage: "Pre-Fabricated Cottages",
                restort: "Vanavihari, Maredumilli"
            },
            checkin: "2024-03-13",
            noof_guest: 1,
            noof_adult: 5,
            noof_child: 2,
            checkout: "2024-03-13",
            noof_rooms: 0
      }
    };
    const jsonArray = Object.keys(json).map(key => {
        return json[key];
        return {
          id: key,
          ...json[key]
        };
    });
    console.log(jsonArray);
    
    // this.roomCards = this.mapRoomData(jsonArray, this.roomIds);

    // setTimeout(() => {
    //    this.loadingRooms = false;
    // }, 2000);
  }
}
