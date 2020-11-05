import { Component, OnInit } from '@angular/core';
import {CandidateService} from '../shared/candidate.service';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  currentDate: string;
  cardTitle: string = "Candidate Entry Portal";
  constructor(private candidateService: CandidateService) { }

  ngOnInit(): void {
    this.currentDate = Date();
  }
  
}
