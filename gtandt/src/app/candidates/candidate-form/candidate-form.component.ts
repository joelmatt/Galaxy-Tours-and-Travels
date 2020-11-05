import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class CandidateFormComponent implements OnInit {
  
  editMode: boolean = false;
  constructor() { }
  
  ngOnInit(): void {
  }

}
