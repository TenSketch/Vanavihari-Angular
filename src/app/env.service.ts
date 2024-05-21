import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  private envApiUrl = '/api/get-env'; // Adjust this path if needed

  constructor(private http: HttpClient) { }

  getZohoApiUrl(): Observable<string> {
    return this.http.get<{ zohoApiUrl: string }>(this.envApiUrl).pipe(
      map(response => response.zohoApiUrl),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
