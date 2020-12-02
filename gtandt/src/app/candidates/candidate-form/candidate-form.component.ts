import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { CandidateService } from '../../shared/candidate.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css'],
  encapsulation: ViewEncapsulation.None  
})
export class CandidateFormComponent implements OnInit, OnDestroy {
  
  candidateInfoForm: FormGroup;
  candidateSpec= new FormArray([]);
  editMode: boolean = false;
  candidateSpecGathered: boolean = false;
  id: string;           // index of candidateRecord selected from the list which denotes the candidate that is selected to be edited
  candidateId: string;  // for when in edit mode we need the candidateID
  routeSubscription: Subscription;
  specList: string[] = []; // List of all the specialization
  submitClicked: boolean = false;
  submitButtonText: string;

  //Imp variables for edit. (matches with the names of variables used in the submit function)
  candidateSpecList = [];
  candidateExperienceList =[];

  // values to enter in the form
  first_name: string = '';
  last_name: string = ''; 
  contact_no: string = '';
  email: string = '';
  gender: string = '';
  DOB: string = '';
  address: string = '';
  country: string = 'India';
  state: string = '';
  pincode: number;
  origin: string = 'offline';
  status: string = 'Available';


  constructor(public candidateService: CandidateService, private router: Router, private route: ActivatedRoute) { }

   async ngOnInit() {
    // lets check to see if the route is for candidate edit or new
    this.routeSubscription = this.route.params.subscribe( (params: Params)=>{
      this.id = params['id'];
      this.editMode = params['id'] != null;
    });

    if (this.editMode){
      this.submitButtonText = "UPDATE";
      this.candidateId = this.candidateService.candidateRecords['records'][this.id]['candidate_id'];
      this.candidateService.fetchIndividualSpecialization(this.candidateId).then(
        (recordData: []) => {
          if(recordData['records'].length > 0){
            for(let spec of recordData['records']){
              this.candidateSpecList.push(spec.specialization);
              this.candidateExperienceList.push(spec.experience);
              this.candidateSpec.push(
                new FormGroup(
                  {'specialization': new FormControl(spec.specialization, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]), 
                  'experience': new FormControl(+spec.experience, [Validators.required, Validators.pattern(/^[0-9]+([,.][0-9]+)?$/), Validators.minLength(1), Validators.maxLength(3)])
                })
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
    else{
      this.submitButtonText = "SUBMIT";
    }
    // initializing the form
    this.candidateInfoForm = new FormGroup({
      'first_name': new FormControl(this.first_name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'last_name': new FormControl(this.last_name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'contact_no': new FormControl(this.contact_no, [Validators.required, Validators.minLength(10), Validators.maxLength(20), Validators.pattern(/^(\+91[\-\s]?)?(\91[\-\s]?)?[0]?(91)?[123456789]\d{9}$/)]),
      'email': new FormControl(this.email, [Validators.email, Validators.maxLength(50), Validators.required]),
      'gender': new FormControl(this.gender, [Validators.required]),
      'DOB': new FormControl(this.DOB, [Validators.required]),
      'country': new FormControl(this.country, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      'address': new FormControl(this.address, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      'state': new FormControl(this.state, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'pincode': new FormControl(this.pincode, [Validators.required, Validators.minLength(6),Validators.maxLength(6)]),  // pincode max and min are set to 7
      'origin': new FormControl(this.origin, Validators.required),
      'status': new FormControl(this.status, Validators.required),
      'specializations': this.candidateSpec
    });

    
    if (this.candidateService.specRecords === null){
      await this.gatherAllSpecializations();
      console.log("imma gather specs");
    }
  }

  ngOnDestroy(): void{
    this.routeSubscription.unsubscribe();
  }

  get controls() { // a getter for the Specialization Form Array
    return (<FormArray>this.candidateInfoForm.get('specializations')).controls;
  }

   //gather all the specilizations
  async gatherAllSpecializations(){
    console.log("Gathering all specialization");
    await this.candidateService.fetchAllSpec().then(
      (recordData: []) => {  
        console.log(recordData);
        this.specList = recordData;
      }, 
      (error) => {
        console.error(error);
      }
    );
  }
  // add a new Specialization to the field
  addSpecialization(){
    (<FormArray>this.candidateInfoForm.get('specializations')).push(
      new FormGroup({
        'specialization': new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
        'experience': new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+([,.][0-9]+)?$/), Validators.minLength(1), Validators.maxLength(3)])
      }
    ));
  }

  removeSpecialization(index: number){
    (<FormArray>this.candidateInfoForm.get('specializations')).removeAt(index);
  }

  async onCandidateDetailsSubmit() {
    this.submitClicked = true;
    let candidateSpec = []; // stores specs of candidates
    let candidateSpecExperience = []; // stores experience of each specialization
    
    if(this.editMode){
      this.candidateService.openSubmitDialog("Please Wait While Info is Updated", "edit");
      // two major acctions to perform in edit. The first is to check if there is any change in the candidate info
      // second is to check if there is any change in the specialization records. New Specialization can be added, Specialization can be removed, Existing Specialization can be added.
      let inputFields: string[] = ['first_name', 'last_name','contact_no', 'DOB', 'address', 'email', 'country', 'state', 'pincode', 'gender', 'origin', 'status'];
      let change: boolean = false; /* This boolean variable will determine whether there is any change in the form that needs to be updated*/
      for(let i=0; i<inputFields.length; i++){
        let val1 = this.candidateService.candidateRecords['records'][this.id][inputFields[i]];
        let val2 = this.candidateInfoForm.value[inputFields[i]];
        if(inputFields[i] === 'status')
          val2 = this.candidateInfoForm.value[inputFields[i]] == 'Available'? 'A': 'NA';
        if (val1 != val2){
          change = true;
          break;
        }
      }
      if(change){
        await this.candidateService.updateCandidateInfo(this.candidateInfoForm.value , this.candidateId).then(
          (recordData) => {
            console.log("Candidate Info Update");
          }, 
          (error) => {
            console.log(error);
          }
        );
      }
      // let check specialization. Lets start by adding new specialziation if it exists
      let temp =  await this.addAndGetSpecs();
      candidateSpec = temp[0];
      candidateSpecExperience = temp[1];
      change = false;
      if(candidateSpec.length == this.candidateSpecList.length){
        this.candidateSpecList.sort();
        candidateSpec.sort();
        this.candidateExperienceList.sort();
        candidateSpecExperience.sort();
        for(let i=0; i<candidateSpec.length; i++){
          if ((candidateSpec[i]!=this.candidateSpecList[i] )|| (candidateSpecExperience[i]!=this.candidateExperienceList[i])){
            console.log("Some thing has changed in specialization");
            change = true;
            break;
          }
        }
      }
      else{
        change = true;
      }
      if(change){
        await this.candidateService.deleteCandidateSpecialization(this.candidateId).then(
          (recordData) => {
            console.log(recordData);
          },
          (error) => {
            console.error(error);
          }
        );
        await this.addCandidateSpec(this.candidateId, temp[0], temp[1]); // Using temp because candidateSpec and CandidateSpecExperience is sorted above :(((
      }
       //Reload the Candidate Records Once a new candidate is added
      //  console.log("fetch all candidates called");
      //  await this.candidateService.fetchAllCandidatesForForm().then(
      //    (recordData: []) => {  
      //      console.log(recordData);
      //      this.candidateService.candidateRecords = recordData;
      //    }, 
      //    (error) => {
      //      console.error(error);
      //    }
      //  );

      //instead of recalling this huge ass array, lets just edit the existing array.
      this.candidateService.deleteFromCandidateRecord(this.id);
      this.candidateService.addToCandidateRecord(this.candidateInfoForm.value, this.candidateId);
       this.candidateService.closeSubmitDialog();
       this.router.navigate(['candidates'])
    }
    else{
      this.candidateService.openSubmitDialog("Please Wait While Candidate is Added", "edit");
      //Adding the candidateInfo into the database table now along with the candidate specialization and experience
      let newCandidateId: string; // stores the candidateId of the newest entered candidate
      await this.candidateService.addCandidate(this.candidateInfoForm.value).then(
        (recordData) => {
          newCandidateId = recordData[1]['records'][0]['candidate_id'];
          console.log(newCandidateId);
        }, 
        (error) => {
          console.error(error);
        }
      );
      let temp = await this.addAndGetSpecs();
      console.log(temp);
      candidateSpec = temp[0];
      candidateSpecExperience = temp[1];
      // Add candidate specialization and experience into the candidate_spec_junction
      await this.addCandidateSpec(newCandidateId, candidateSpec, candidateSpecExperience);
      
      //Reload the Candidate Records Once a new candidate is added
      // console.log("fetch all candidates called");
      // await this.candidateService.fetchAllCandidatesForForm().then(
      //   (recordData: []) => {  
      //     console.log(recordData)
      //     this.candidateService.candidateRecords = recordData;
      //   }, 
      //   (error) => {
      //     console.error(error);
      //   }
      // );

      //instead of recalling this huge array, lets just edit the existing array.
      this.candidateService.addToCandidateRecord(this.candidateInfoForm.value, newCandidateId);

      this.candidateService.closeSubmitDialog();
      this.router.navigate(['candidates']);
    }  
  }
  
  async addAndGetSpecs(){
    let newSpecs: string[] = [];  
    let candidateSpec: string[] = []; // stores specs of candidates
    let candidateSpecExperience = []; // stores corresponding experience for each spec
    for(let i=0; i<this.candidateInfoForm.value.specializations.length; i++){
      candidateSpec.push(this.candidateService.letterCapitalize(this.candidateInfoForm.value.specializations[i]['specialization']));
      candidateSpecExperience.push(this.candidateInfoForm.value.specializations[i]['experience']);
      if(! this.specList.includes(candidateSpec[i])){
        console.log(newSpecs);
        newSpecs.push(candidateSpec[i]);
      }
    }
    if (newSpecs.length > 0){
     await this.candidateService.addSpecializations(newSpecs).then(
        (recordData: []) => {  
          // For when data is sent to the table we need to call the gather the all specializations again
          this.gatherAllSpecializations();
        }, 
        (error) => {
          console.error(error);
        }
      );
    }
    return [candidateSpec, candidateSpecExperience];
  }

  async addCandidateSpec(candidateId, candidateSpec, candidateSpecExperience){
    console.log("add Candidate Spec === >"+ candidateSpec);
    let candidateSpecId: [] = [];     // Stores specialization Ids for each specs added by candidate
    if(candidateSpec.length > 0){
      for(let i=0; i<candidateSpec.length; i++){  // If only someone could help me understand a better alternative to using 2 for loops
        for(let j=0; j<this.candidateService.specRecords.length; j++){
          if(candidateSpec[i] === this.candidateService.specRecords[j]['specialization']){
            candidateSpecId.push(this.candidateService.specRecords[j]['spec_id']);
            break;
          }
        }
      }
      await this.candidateService.addCandidateSpecialization(candidateSpecId,candidateSpecExperience, candidateId).then(
        (recordData) => {
          console.log(recordData);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  
}


