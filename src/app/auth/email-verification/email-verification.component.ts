import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailVerifyService } from '../../email-verify.service';
import { AuthService } from '../../auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {

  api_url:any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private emailVerifyService: EmailVerifyService
  ) {
    this.api_url = environment.API_URL
  }

  ngOnInit(): void {
    const verificationUserId = this.route.snapshot.paramMap.get('userid');
    const verificationToken = this.route.snapshot.paramMap.get('token');
    if (verificationToken) {
      this.http.get<any>(this.api_url+'?api_type=email_verification&guest_id='+verificationUserId+'&token='+verificationToken).subscribe({
        next: response => {
          if(response.code == 3000 && response.result.status == "success") {
            this.router.navigate(['/sign-in'], { queryParams: { message: response.result.msg } });
          } else if(response.code == 3000) {
            this.router.navigate(['/sign-in'], { queryParams: { message: response.result.msg } });
          } else {
            this.router.navigate(['/sign-in'], { queryParams: { message: 'Somthing Error for Email Verification!' } });
          }
        },
        error: err => {
          console.error('Email verification failed:', err);
          alert('Email verification failed. Please try again.');
          // this.router.navigate(['/sign-in']);
        }
      });

    } else {
      this.router.navigate(['/sign-in']);
    }
  }
}