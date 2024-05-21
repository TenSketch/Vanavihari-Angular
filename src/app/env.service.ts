import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
interface EnvResponse {
  billdeskkey: string;
  billdesksecurityid: string;
  billdeskmerchantid: string;
}

@Injectable({
  providedIn: 'root'
})


export class EnvService {
  private envApiUrl = '/api/get-env'; // Adjust this path if needed

  constructor(private http: HttpClient) { }

  getEnvVars(): Observable<EnvResponse> {
    return this.http.get<EnvResponse>(this.envApiUrl).pipe(
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
