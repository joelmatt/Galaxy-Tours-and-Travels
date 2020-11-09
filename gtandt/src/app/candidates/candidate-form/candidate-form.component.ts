import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { CandidateService } from '../../shared/candidate.service';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class CandidateFormComponent implements OnInit {
  
  candidateInfoForm: FormGroup;
  specList = new FormArray([]);
  editMode: boolean = false;
  candidateInfoLoaded: boolean = false;
  candidateId: string;

  // values to enter in the form
  first_name: string = '';
  last_name: string = ''; 
  contact_no: string = '';
  email: string = '';
  gender: string = '';
  DOB: string = '';
  address: string = '';
  country: string = '';
  state: string = '';
  pincode: number;
  origin: string = '';
  status: string = '';


  constructor(public candidateService: CandidateService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // lets check to see if the route is for candidate edit or new
    this.route.params.subscribe( (params: Params)=>{
      this.candidateId = params['candidateId']
      this.editMode = params['candidateId'] != null;
    });

    //gather all the specilizations
    if (this.candidateService.specRecords === null){
      this.candidateService.fetchAllSpec().subscribe(
        (recordData: []) => {  
          this.candidateService.specRecords = recordData;
        }, 
        (error) => {
          console.error(error);
        }
      );
    }

    if (this.editMode){
      this.candidateService.fetchIndividualCandidate(this.candidateId).subscribe(
        (recordData: []) => {  
          console.log(recordData);
          this.first_name = recordData['records'][0]['first_name'];
          this.contact_no = recordData['records'][0]['contact_no'];
          this.last_name = recordData['records'][0]['last_name'];
          this.DOB = recordData['records'][0]['DOB'];
          this.address = recordData['records'][0]['address'];
          this.email = recordData['records'][0]['email'];
          this.country = recordData['records'][0]['country'];
          this.state = recordData['records'][0]['state'];
          this.pincode = recordData['records'][0]['pincode'];
          this.gender = recordData['records'][0]['gender'];  
          this.origin = recordData['records'][0]['origin'];
          this.status = recordData['records'][0]['status'] == 'A' ? 'Available' : 'Not Available';
          this.candidateInfoLoaded = true;
          this.populateForm();
          this.candidateInfoLoaded = this.editMode ? true: false;
        }, 
      (error) => {
        console.error(error);
      });
    }
    this.populateForm();
    
  }

  onCandidateDetailsSubmit(){}

  populateForm(){
    this.candidateInfoForm = new FormGroup({
      'first_name': new FormControl(this.first_name),
      'last_name': new FormControl(this.last_name),
      'contact_no': new FormControl(this.contact_no),
      'email': new FormControl(this.email),
      'gender': new FormControl(this.gender),
      'DOB': new FormControl(this.DOB),
      'country': new FormControl(this.country),
      'address': new FormControl(this.address),
      'state': new FormControl(this.state),
      'pincode': new FormControl(this.pincode), 
      'origin': new FormControl(this.origin),
      'status': new FormControl(this.status),
      'specializations': new FormControl()
    });
    console.log(this.candidateInfoLoaded, this.editMode);
  }
}
