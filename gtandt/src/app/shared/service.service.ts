import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http:HttpClient) { }

  fetchAllCandidates(){
    // will add required data to the query Params later
    this.http.get('https://uvcnd6vene.execute-api.ap-south-1.amazonaws.com/testt/test').subscribe(
      responseData=>{
        console.log(responseData)
      }
    )
  }
}
