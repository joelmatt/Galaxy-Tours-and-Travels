import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { retryAfterDelay } from './custom.delay';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  constructor(private http:HttpClient) { }

  candidateRecords: [] = null;   // Stores the records of all the candidates from fetch candidates
  specRecords: [] = null;  // Stores the records of all the specializations present in the database
  delayDuration: number = 20000;  //20 seconds of delay

  
  fetchAllCandidates(): Observable<Object>{
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'selectAllCandidates');
    return this.http.get('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test', {params: queryParams})
      .pipe(
        retryAfterDelay(this.delayDuration),
        catchError(errorResponse => {
          return throwError(errorResponse);
        }
      )
    );
  } 
  // get all the specializations from the spec_list table
  fetchAllSpec(): Observable<Object>{
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'selectAllSpec');
    return this.http.get('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test', {params: queryParams})
      .pipe(
        map( (response) =>{
            let temp: any[] = []
           let recordLen = response['records'].length;
           console.log(recordLen);
           // there should be a better way to do this without a for loop! Teach me masters of opensource and TS
           for(let i=0; i<recordLen; i++){
            temp.push(response['records'][i]['specialization']);
           }
           return temp;
        }), 
        retryAfterDelay(this.delayDuration),
        catchError(errorResponse => {
          return throwError(errorResponse);
        }
      )
    );
  }
  // get individual candidate details
  fetchIndividualCandidate(candidateId: string){
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'selectIndividualCandidate').set('candidateId', candidateId);
    return this.http.get('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test', {params: queryParams})
      .pipe(
        retryAfterDelay(this.delayDuration),
        catchError(errorResponse => {
          return throwError(errorResponse);
        }
      )
    );
  }
  fetchIndividualSpecialization(candidateId: string){
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'selectIndividualSpec').set('candidateId', candidateId);
    return this.http.get('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test', {params: queryParams})
      .pipe(
        retryAfterDelay(this.delayDuration),
        catchError(errorResponse => {
          return throwError(errorResponse);
        }
      )
    );
  }

}