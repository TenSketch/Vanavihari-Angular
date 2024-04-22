import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailVerifyService {
  constructor(private http: HttpClient) {}

  verifyEmail(verificationToken: string): Observable<any> {
    return this.http.get<any>('https://www.zohoapis.in/creator/custom/venkatechnical/Email_Verification?publickey=BeeXF54WvSpqT886FYR476qfh', {
      params: {
        token: verificationToken
      }
    });
  }
}