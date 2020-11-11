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
  candidateSpec= new FormArray([]);
  editMode: boolean = false;
  candidateSpecGathered: boolean = false;
  id: string;           // index of candidateRecord selected from the list which denotes the candidate that is selected to be edited
  candidateId: string;  // for when in edit mode we need the candidateID

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
      this.id = params['id']
      this.editMode = params['id'] != null;
    });

    if (this.editMode){
      this.candidateId = this.candidateService.candidateRecords['records'][this.id]['candidate_id'];
      this.candidateService.fetchIndividualSpecialization(this.candidateId).subscribe(
        (recordData: []) => {
          console.log(recordData['records']);
          if(recordData['records'].length > 0){
            for(let spec of recordData['records']){
              this.candidateSpec.push(
                new FormGroup({'specialization': new FormControl(spec.specialization), 'experience': new FormControl(+spec.experience)})
              );
            }
          }
          this.candidateSpecGathered = true;
        }
      );
      this.first_name = this.candidateService.candidateRecords['records'][this.id]['first_name'];
      this.contact_no = this.candidateService.candidateRecords['records'][this.id]['contact_no'];
      this.last_name = this.candidateService.candidateRecords['records'][this.id]['last_name'];
      this.DOB = this.candidateService.candidateRecords['records'][this.id]['DOB'];
      this.address = this.candidateService.candidateRecords['records'][this.id]['address'];
      this.email = this.candidateService.candidateRecords['records'][this.id]['email'];
      this.country = this.candidateService.candidateRecords['records'][this.id]['country'];
      this.state = this.candidateService.candidateRecords['records'][this.id]['state'];
      this.pincode = this.candidateService.candidateRecords['records'][this.id]['pincode'];
      this.gender = this.candidateService.candidateRecords['records'][this.id]['gender'];  
      this.origin = this.candidateService.candidateRecords['records'][this.id]['origin'];
      this.status = this.candidateService.candidateRecords['records'][this.id]['status'] == 'A' ? 'Available' : 'Not Available';
    }
    // initializing the form
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
      'specializations': this.candidateSpec
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
  }

  onCandidateDetailsSubmit(){}

  get controls() { // a getter for the Specialization Form Array
    return (<FormArray>this.candidateInfoForm.get('specializations')).controls;
  }

  addSpecialization(){
    (<FormArray>this.candidateInfoForm.get('specializations')).push(
      new FormGroup({
        'specialization': new FormControl(),
        'experience': new FormControl()
      }
    ));
  }
  removeSpecialization(index: number){
    (<FormArray>this.candidateInfoForm.get('specializations')).removeAt(index);
  }
}


