import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SponsorService {

  constructor(private http:HttpClient) { 
    
  }
}
