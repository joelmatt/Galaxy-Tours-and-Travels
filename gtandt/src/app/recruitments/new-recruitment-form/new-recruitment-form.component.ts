import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { SponsorService } from './../../shared/sponsor.service';
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
  submitButtonText: string = "SUBMIT";
  catList: string[] = [];

  name: string = '';
  sponsor: string = '';
  

  constructor(@Inject(MAT_DIALOG_DATA) public data, 
    public dialogRef: MatDialogRef<NewRecruitmentFormComponent>,
    private globalService: GlobalService, 
    public sponsorService: SponsorService
  ) { }

  ngOnInit(): void {
    console.log(this.sponsorService.sponsorRecords);
    this.recruitmentInfoForm = new FormGroup({
      'name': new FormControl(this.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'sponsor': new FormControl(this.sponsor, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'specializations': this.categorySpec
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  get controls() { // a getter for the Specialization Form Array
    return (<FormArray>this.recruitmentInfoForm.get('specializations')).controls;
  }

  addSpecialization(){
    (<FormArray>this.recruitmentInfoForm.get('specializations')).push(
      new FormGroup({
        'specialization': new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
        'total': new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+([,.][0-9]+)?$/), Validators.minLength(1), Validators.maxLength(3)])
      }
    ));
  }
  removeSpecialization(index: number){
    (<FormArray>this.recruitmentInfoForm.get('specializations')).removeAt(index);
  }
}
