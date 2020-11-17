import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { retryAfterDelay } from './custom.delay';
import { MatDialog } from '@angular/material/dialog';
import { OnSubmitPopupComponent } from '../candidates/on-submit-popup/on-submit-popup.component';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  constructor(private http:HttpClient, private dialog: MatDialog) { }

  candidateRecords: [] = null;   // Stores the records of all the candidates from fetch candidates
  specRecords: [] = null;  // Stores the records of all the specializations present in the database
  delayDuration: number = 20000;  //20 seconds of delay

    // the below function accepts a string and capitalize the first letter of every word in the string
  letterCapitalize(str) {
    var splitStr = str.split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
  }

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
  fetchAllSpec(){
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'selectAllSpec');
    return this.http.get('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test', {params: queryParams})
      .pipe(
        map( (response) =>{
           let temp: any[] = []
           let recordLen = response['records'].length;
           this.specRecords = response['records'];
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
    ).toPromise();
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
    ).toPromise();
  }

  addCandidate(parameters){
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'addNewCandidate')
    .set('first_name', parameters.first_name).set('last_name', parameters.last_name)
      .set('contact_no', parameters.contact_no).set('gender', parameters.gender).set('address', parameters.address)
      .set('state', parameters.state).set('country', parameters.country).set('pincode', parameters.pincode)
      .set('email', parameters.email).set('origin', parameters.origin).set('DOB', this.changeDateFormat(parameters.DOB))
      .set('status', parameters.status === 'Available'?'A':'NA');
    return this.http.put('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test', {}, {params: queryParams})
    .pipe(
      retryAfterDelay(this.delayDuration),
      catchError(errorResponse => {
        return throwError(errorResponse);
      })
    ).toPromise();
  }
  
  addSpecializations(specs: string[]){
    let specListToString: string = specs.join(', ');
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'addNewSpecializations').set('specs', specListToString);
    return this.http.put('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test', {}, {params: queryParams})
    .pipe(
      retryAfterDelay(this.delayDuration),
      catchError(errorResponse => {
        return throwError(errorResponse);
      })
    ).toPromise();    
  }

  addCandidateSpecialization(specsId, exp, candidateId){
    let specIdListToString: string = specsId.join(', ');
    let expListToString: string = exp.join(', ');
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'addCandidateSpecialization').set('specIds', specIdListToString).set('exp', expListToString).set('candidateId', candidateId);
    return this.http.put('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test', {}, {params: queryParams})
    .pipe(
      retryAfterDelay(this.delayDuration),
      catchError(errorResponse => {
        return throwError(errorResponse);
      })
    ).toPromise();
  }

  // This function just make the date string from the input into the right format for mysql
  changeDateFormat(val: string){
    let val1 = new Date(val);
    return val1.getFullYear()+"/"+(val1.getMonth()+1)+"/"+val1.getDate(); // YYYY/MM/DD
  }

  openSubmitDialog(){
    this.dialog.open(OnSubmitPopupComponent, {
      disableClose: true,
      hasBackdrop: true,
    })  
  }
  
  closeSubmitDialog(){
    this.dialog.closeAll();
  }

}