import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { retryAfterDelay } from './custom.delay';
import { MatDialog } from '@angular/material/dialog';
import { OnSubmitPopupComponent } from '../../on-submit-popup/on-submit-popup.component';
import { AppConstants } from '../shared/imp-data';
@Injectable({
  providedIn: 'root'
})
export class RecruitmentService {

  constructor(private http:HttpClient, private dialog: MatDialog) {}

  delayDuration: number = 20000; 

  recruitmentRecords: any[] = null; 

  addNewRecruitment(sponsorId: string, totalCat: number, name: string, status: string){
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'addNewRecruitment')
    .set('sponsor_id', sponsorId).set('total_cat', totalCat.toString()).set('name', name).set('status', status);
    return this.http.put(AppConstants._API_END_URL, {}, {params: queryParams})
    .pipe(
      retryAfterDelay(this.delayDuration),
      catchError(errorResponse => {
        return throwError(errorResponse);
      })
    ).toPromise();
  }
  
  addRecruitmentSpecialization( specList: string[], totalList: number[], recruitmentId: string){
    let specIdListToString: string = specList.join(', ');
    let totalListToString: string = totalList.join(', ');
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'addRecruitmentSpecialization').set('specIds', specIdListToString).set('total', totalListToString).set('recruitmentId', recruitmentId);
    return this.http.put(AppConstants._API_END_URL, {}, {params: queryParams})
    .pipe(
      retryAfterDelay(this.delayDuration),
      catchError(errorResponse => {
        return throwError(errorResponse);
      })
    ).toPromise();
  }

  fetchAllRecruitments(){
    let queryParams = new HttpParams();
    queryParams = queryParams.set('funcName', 'selectAllRecruitments');
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
