import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZohoAuthServiceService {
  private clientId = '1000.GW70XWAC3O04CJ67TUTEAYEOVP7RIM';
  private clientSecret = '532929ef83d5a2b57ceb5f5ddb3f94e0ebb30b7ebc';
  private redirectUri = 'https://tensketch.vanavihari.com/register.html';
  private authUrl = 'https://accounts.zoho.com/oauth/v2/auth';
  private tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';

  constructor(private http: HttpClient) { }

  authorize() {
    console.log('test');
    
    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('redirect_uri', this.redirectUri)
      .set('scope', 'ZohoCreator.form.CREATE')
      .set('response_type', 'code');

    window.location.href = `${this.authUrl}?${params.toString()}`;
  }

  exchangeCodeForToken(code: string) {
    const body = new HttpParams()
      .set('code', code)
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('redirect_uri', this.redirectUri)
      .set('grant_type', 'authorization_code');

    return this.http.post<any>(this.tokenUrl, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }
}
