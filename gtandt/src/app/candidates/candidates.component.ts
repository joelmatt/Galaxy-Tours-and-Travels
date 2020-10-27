import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  currentDate: string;
  constructor() { }

  ngOnInit(): void {
    this.currentDate = Date();
    console.log(this.currentDate);
  }
  
}
