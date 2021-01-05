import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from './../shared/global.service';
import { SponsorService } from './../shared/sponsor.service';
@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {

  constructor(private globalService: GlobalService, public sponsorService: SponsorService) { 
    this.globalService.updateCardTitle("Sponsor Entry Portal");
  }

  ngOnInit(){
  }

}
