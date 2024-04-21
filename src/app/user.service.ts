import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly accessTokenKey = 'access_token';
  private readonly accessUsername = 'username';
  private readonly accessUserFullname = 'userfullname';

  constructor() { }

  getUser(): any {
    return localStorage.getItem(this.accessUsername);
  }
  getFullUser(): any {
    return localStorage.getItem(this.accessUserFullname);
  }
  getUserToken(): any {
    return localStorage.getItem(this.accessTokenKey);
  }

  setUser(user: any): void {
    // const expiration = new Date();
    // expiration.setTime(expiration.getTime() + (expirationMinutes * 60 * 1000));
    localStorage.setItem(this.accessTokenKey, user); //JSON.stringify({user, expiration: expiration.getTime()})
  }
  
  clearUser(): void {
    localStorage.removeItem(this.accessUsername);
    localStorage.removeItem(this.accessUserFullname);
    localStorage.removeItem(this.accessTokenKey);
  }

  isLoggedIn(): boolean {
    return (!!localStorage.getItem(this.accessTokenKey))&&(!!localStorage.getItem(this.accessUsername))&&(!!localStorage.getItem(this.accessUserFullname));
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.accessUsername);
    localStorage.removeItem(this.accessUserFullname);
  }


}
