import { Component, OnInit } from '@angular/core';
import {ServiceService} from '../shared/service.service';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  currentDate: string;
  constructor(private candidateFetchService: ServiceService) { }

  ngOnInit(): void {
    this.currentDate = Date();
    console.log(this.currentDate);
    this.candidateFetchService.fetchAllCandidates();
  }
  
}
