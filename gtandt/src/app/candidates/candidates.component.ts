import { Component, OnInit, Output } from '@angular/core';
import {CandidateService} from '../shared/candidate.service';
import { EventEmitter } from 'events';
import { GlobalService } from './../shared/global.service';


@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  constructor(private candidateService: CandidateService, private globalServive: GlobalService) { 
    this.globalServive.updateCardTitle("Candidate Entry Portal");
  }

  ngOnInit(): void {
   
  }
  
}
