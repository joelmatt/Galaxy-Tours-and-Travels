import { Component, OnInit } from '@angular/core';
import {CandidateService} from '../shared/candidate.service';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  currentDate: string;
  cardTitle: string = "Candidate Entry Portal";
  constructor(private candidateService: CandidateService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentDate = Date();
    this.router.navigate(['candidateList'], {relativeTo: this.route});
  }
  
}
