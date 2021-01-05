import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { SponsorService } from './../../shared/sponsor.service';
import { GlobalService } from './../../shared/global.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sponsor-form',
  templateUrl: './sponsor-form.component.html',
  styleUrls: ['./sponsor-form.component.css']
})
export class SponsorFormComponent implements OnInit {

  //values to enter in the form
  name: string = '';
  contact_no: string = '';
  email: string = '';
  address: string = '';
  country: string = '';
  state: string = '';

  routeSubscription: Subscription;
  editMode: boolean = false;
  id: string;  
  submitButtonText: string;
  sponsorInfoForm: FormGroup;
  submitClicked: boolean = false;

  constructor(private globalService: GlobalService, public sponsorService: SponsorService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe( (params: Params)=>{
      this.id = params['id'];
      this.editMode = params['id'] != null;
      console.log("Edit Mode: "+this.editMode);
    });

    if (this.editMode){

    }
    else{
      this.submitButtonText = "SUBMIT";
    }

    this.sponsorInfoForm = new FormGroup({
      'name': new FormControl(this.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'contact_no': new FormControl(this.contact_no, [Validators.required, Validators.minLength(10), Validators.maxLength(20)]), // no regex pattern like the candidate information
      'email': new FormControl(this.email, [Validators.email, Validators.maxLength(50), Validators.required]),
      'country': new FormControl(this.country, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      'address': new FormControl(this.address, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      'state': new FormControl(this.state, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    });
  }

  async onSponsorDetailsSubmit(){
    if(this.editMode){

    }
    else{
      //wait code insert here
      let newSponsorId:string;
      this.globalService.openSubmitDialog("Please Wait While Sponsor is Added", "edit");
      await this.sponsorService.addSponsor(this.sponsorInfoForm.value).then(
        (recordData) => {
          newSponsorId = recordData[1]['records'][0]['sponsor_id'];
          console.log(newSponsorId);
        }, 
        (error) => {
          console.error(error);
        }
      );
      this.sponsorService.addToSponsorRecord(this.sponsorInfoForm.value, newSponsorId);
      this.globalService.closeSubmitDialog();
    }
    this.router.navigate(['main/sponsors']);
  }
}
