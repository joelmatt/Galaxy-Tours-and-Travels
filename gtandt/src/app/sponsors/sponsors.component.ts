import { Component, OnInit, Output } from '@angular/core';
import { GlobalService } from './../shared/global.service';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {

  constructor(private globalService: GlobalService) { 
    this.globalService.updateCardTitle("Sponsor Entry Portal");
    console.log(this.globalService.cardTitle);
  }

  ngOnInit(): void {
   
  }

}
