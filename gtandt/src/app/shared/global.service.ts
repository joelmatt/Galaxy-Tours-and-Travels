import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  cardTitle: string = "";
  constructor() { }

  updateCardTitle(title: string){
    this.cardTitle = title;
  }
}
