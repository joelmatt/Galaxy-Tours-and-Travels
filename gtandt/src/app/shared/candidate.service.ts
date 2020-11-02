import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { retryAfterDelay } from './custom.delay';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  constructor(private http:HttpClient) { }

  candidateRecords: [] = null;   // Stores the records of all the candidates from fetch candidates
  delayDuration: number = 20000;  //20 seconds of delay

  fetchAllCandidates(): Observable<Object>{
    return this.http.get('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test')
      .pipe(
       retryAfterDelay(this.delayDuration),
       catchError(errorResponse => {
         return throwError(errorResponse);
       }
      )
      );
  } 

}