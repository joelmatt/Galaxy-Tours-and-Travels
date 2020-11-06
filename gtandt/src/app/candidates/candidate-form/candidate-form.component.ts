import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class CandidateFormComponent implements OnInit {
  
  editMode: boolean = false;
  candidateInfoForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.candidateInfoForm = new FormGroup({
      'first_name': new FormControl(),
      'last_name': new FormControl(),
      'contact_no': new FormControl(),
      'email': new FormControl(),
      'gender': new FormControl(),
      'DOB': new FormControl(),
      'country': new FormControl(),
      'address': new FormControl(),
      'state': new FormControl(),
      'pincode': new FormControl(),
      'origin': new FormControl(),
      'status': new FormControl(),
      'specializations': new FormControl()
    });
  }

}
