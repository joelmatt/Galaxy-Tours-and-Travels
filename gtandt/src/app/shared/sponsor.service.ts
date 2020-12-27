import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { retryAfterDelay } from './custom.delay';
import { AppConstants } from '../shared/imp-data';

@Injectable({
  providedIn: 'root'
})
export class SponsorService {
  sponsorRecords: any[] = null;
  delayDuration: number = 20000;  //20 seconds of delay

  
  constructor(private http:HttpClient) {}

  fetchAllCandidates(){
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'selectAllSponsors');
    return this.http.get(AppConstants._API_END_URL, {params: queryParams})
      .pipe(
        retryAfterDelay(this.delayDuration),
        catchError(errorResponse => {
          return throwError(errorResponse);
        }
      )
    ).toPromise();
  } 
}
