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

  addSponsor(parameters){
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'addNewSponsor')
    .set('name', parameters.name)
      .set('contact_no', parameters.contact_no).set('address', parameters.address)
      .set('state', parameters.state).set('country', parameters.country)
      .set('email', parameters.email);
    return this.http.put(AppConstants._API_END_URL, {}, {params: queryParams})
    .pipe(
      retryAfterDelay(this.delayDuration),
      catchError(errorResponse => {
        return throwError(errorResponse);
      })
    ).toPromise();
  }

  addToSponsorRecord(params: any, sponsor_id: string){
    this.sponsorRecords['records'].push({
      sponsor_id: sponsor_id,
      name: params.name,
      email: params.email,
      contact: params.contact_no,
      state: params.state,
      country: params.country,
      address: params.address
    });
  }

  updateSponsorInfo(parameters, sponsorId: string){
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'updateSponsor')
    .set('name', parameters.name)
    .set('contact_no', parameters.contact_no).set('address', parameters.address)
    .set('state', parameters.state).set('country', parameters.country)
    .set('email', parameters.email)
    .set('sponsorId', sponsorId);
    return this.http.delete(AppConstants._API_END_URL, {params: queryParams})
    .pipe(
      retryAfterDelay(this.delayDuration),
      catchError(errorResponse => {
        return throwError(errorResponse);
      })
    ).toPromise();
  }

  deleteFromSponsorRecord(id){
    this.sponsorRecords['records'].splice(id, 1);
  }
}
