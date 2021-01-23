// Show right set of errors boi


import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { SponsorService } from './../../shared/sponsor.service';
import { RecruitmentService } from './../../shared/recruitment.service';
import { GlobalService } from './../../shared/global.service';
import { CandidateService } from './../../shared/candidate.service';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { stringify } from '@angular/compiler/src/util';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

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

  recruitmentSpecList: string[] = [];
  recruitmentTotalList: number[] = [];

  name: string = '';
  sponsor: string = '';
  

  constructor(@Inject(MAT_DIALOG_DATA) public data, 
    public globalService: GlobalService,
    public dialogRef: MatDialogRef<NewRecruitmentFormComponent>,
    public sponsorService: SponsorService,
    public recruitmentService: RecruitmentService,
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
        'total': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+([,.][0-9]+)?$/), Validators.minLength(1), Validators.maxLength(3)])
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
  }
  
  async onSubmit(){
    this.isLoading = true;
    //firstly lets check for new specializations added to the Form.
    await this.addAndGetSpecs();
    await this.recruitmentService.addNewRecruitment(
      this.getSponsorId(this.recruitmentInfoForm.get('sponsor').value), 
      this.recruitmentInfoForm.get('specializations').value.length, 
      this.recruitmentInfoForm.get('name').value,
      'Active',
    ).then(
      async (recordData) => {
        let newRecruitmentId = recordData[1]['records'][0]['recruitment_id'];
        await this.recruitmentService.addRecruitmentSpecialization(this.getSpecializationId(this.recruitmentSpecList), this.recruitmentTotalList, newRecruitmentId).then(
          (recordData) => {
            this.isLoading = false;
            this.closeDialog();
          }, 
          (error) => {
            this.closeDialog();
            console.error(error);
          }
        );
      }, 
      (error) => {
        this.closeDialog();
        console.error(error);
      }
    );
  }  

  async addAndGetSpecs(){
    // we have all the specs in spec list but we need the recruitment spec.
    
    let newSpecs: string[] = [];
    this.recruitmentInfoForm.get('specializations').value.forEach(element => {
      let spec = this.candidateService.letterCapitalize(element['specialization']);
      this.recruitmentSpecList.push(spec);
      this.recruitmentTotalList.push(element['total']);
      if(!this.specList.includes(spec)){
        newSpecs.push(spec);
      }
    });
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
  }

 
  getSponsorId(sponsorName: string){
    for(let i = 0; i<this.sponsorList.length;i++){
      if(this.sponsorService.sponsorRecords['records'][i]['name'] == sponsorName){
        return this.sponsorService.sponsorRecords['records'][i]['sponsor_id'];
      }
    }
  }

  getSpecializationId(specName: string[]){
    let specIdList: string[] = [];
    for (let i =0; i<specName.length;i++){
      for ( let j=0; j<this.candidateService.specRecords.length; j++){
        if(specName[i]==this.candidateService.specRecords[j]['specialization'])
          specIdList.push(this.candidateService.specRecords[j]['spec_id']);
      }
    }
    return specIdList;
  }
}
