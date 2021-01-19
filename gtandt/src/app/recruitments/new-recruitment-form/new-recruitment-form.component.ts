import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { SponsorService } from './../../shared/sponsor.service';
import { CandidateService } from './../../shared/candidate.service';
import { GlobalService } from './../../shared/global.service';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-recruitment-form',
  templateUrl: './new-recruitment-form.component.html',
  styleUrls: ['./new-recruitment-form.component.css']
})

export class NewRecruitmentFormComponent implements OnInit {

  recruitmentInfoForm: FormGroup;
  categorySpec = new FormArray([]);
  isLoading: boolean = false;
  editMode: boolean = false;
  submitButtonText: string = "SUBMIT";
  specList: string[] = [];
  sponsorList: string[] = [];
  recruitmentSpecLength: number = 0; // Remember to change this while editing

  name: string = '';
  sponsor: string = '';
  

  constructor(@Inject(MAT_DIALOG_DATA) public data, 
    public dialogRef: MatDialogRef<NewRecruitmentFormComponent>,
    public sponsorService: SponsorService,
    public candidateService: CandidateService
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    if(!this.sponsorService.sponsorRecords){
      await this.fetchAllSponsors();
    }
    this.extractSponsorNames();
    if (!this.candidateService.specRecords){
      await this.gatherAllSpecializations();
      console.log(this.candidateService.specRecords);
    }
    else{
      for(let i=0;i<this.candidateService.specRecords.length;i++){
        this.specList.push(this.candidateService.specRecords[i]['specialization']);
      }
    }
    if(this.editMode){

    }
    else{
      this.isLoading = false;
    }
    this.recruitmentInfoForm = new FormGroup({
      'name': new FormControl(this.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'sponsor': new FormControl(this.sponsor, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      'specializations': this.categorySpec
    });

    if(!this.editMode){
      //reminding the user that recruitment needs atleast one category.
      this.addSpecialization();
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  get controls() { // a getter for the Specialization Form Array
    return (<FormArray>this.recruitmentInfoForm.get('specializations')).controls;
  }

  addSpecialization(){
    this.recruitmentSpecLength++;
    (<FormArray>this.recruitmentInfoForm.get('specializations')).push(
      new FormGroup({
        'specialization': new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
        'total': new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+([,.][0-9]+)?$/), Validators.minLength(1), Validators.maxLength(3)])
      }
    ));
  }

  removeSpecialization(index: number){
    this.recruitmentSpecLength--;
    (<FormArray>this.recruitmentInfoForm.get('specializations')).removeAt(index);
  }

  async fetchAllSponsors(){
    if(this.sponsorService.sponsorRecords == null){
      await this.sponsorService.fetchAllSponsors().then(
        ((response:[]) => {
          console.log(response);
          this.sponsorService.sponsorRecords = response;
        })
      )
    }
  }
  async gatherAllSpecializations(){
    console.log("Gathering all specialization");
    await this.candidateService.fetchAllSpec().then(
      (recordData: []) => {  
        console.log(recordData);
        this.specList = recordData;
        console.log(this.candidateService.specRecords);
      }, 
      (error) => {
        console.error(error);
      }
    );
  }

  extractSponsorNames(){
    for (let i=0; i<this.sponsorService.sponsorRecords['records'].length; i++){
      this.sponsorList.push(this.sponsorService.sponsorRecords['records'][i]['name']);
    }
    console.log(this.sponsorList);
  }
  
}
