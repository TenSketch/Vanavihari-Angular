import { UserService } from '@/app/user.service';
import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cancel-status',
  templateUrl: './cancel-status.component.html',
  styleUrls: ['./cancel-status.component.scss']
})
export class CancelStatusComponent {

  api_url:any
  bookingData:any
  currentId:any
  singleBooking:any

  constructor(private userService:UserService,     private http: HttpClient  ){
    this.api_url = environment.API_URL
    this.currentId = localStorage.getItem("current_id")
  }

  ngOnInit(): void {
  
    let params = new HttpParams()
        .set('email', this.userService.getUser())
        .set('token', this.userService.getUserToken());
      this.http
        .get<any>(
          this.api_url+'?api_type=booking_history&' +
            params.toString()
        ).subscribe({
          next:(response)=>{
            this.bookingData = response.result.details;
            this.singleBooking = this.bookingData.find((booking: any) => booking.booking_id === this.currentId);

          },
          error:(e)=>{

          }
        })
      }
}
