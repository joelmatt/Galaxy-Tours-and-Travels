import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class SponsorFormComponent implements OnInit, OnDestroy{

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
  sponsorId: string;
  submitButtonText: string;
  sponsorInfoForm: FormGroup;
  submitClicked: boolean = false;

  constructor(private globalService: GlobalService, public sponsorService: SponsorService, private router: Router, private route: ActivatedRoute) { }

  ngOnDestroy(): void{
    this.routeSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe( (params: Params)=>{
      this.id = params['id'];
      this.editMode = params['id'] != null;
      console.log("Edit Mode: "+this.editMode);
    });

    if (this.editMode){
      this.submitButtonText = "UPDATE";
      this.sponsorId = this.sponsorService.sponsorRecords['records'][this.id]['sponsor_id'];
      this.name = this.sponsorService.sponsorRecords['records'][this.id]['name'];
      this.address = this.sponsorService.sponsorRecords['records'][this.id]['address'];
      this.contact_no = this.sponsorService.sponsorRecords['records'][this.id]['contact'];
      this.country = this.sponsorService.sponsorRecords['records'][this.id]['country'];
      this.email = this.sponsorService.sponsorRecords['records'][this.id]['email'];
      this.state = this.sponsorService.sponsorRecords['records'][this.id]['state'];
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

  async onSponsorDetailsSubmit(){ // should have had made contact_no as contact.. But now i cant stop and do it.
    if(this.editMode){
      this.globalService.openSubmitDialog("Please Wait While Sponsor Detail is Updated", "edit");
      let inputFields: string[] = ['name','contact_no', 'address', 'email', 'country', 'state'];
      let change: boolean = false;
      for(let i=0; i<inputFields.length; i++){
        let val1;
        let val2 = this.sponsorInfoForm.value[inputFields[i]];
        if(inputFields[i] === 'contact_no')
          val1 = this.sponsorService.sponsorRecords['records'][this.id]['contact'];
        else
          val1 = this.sponsorService.sponsorRecords['records'][this.id][inputFields[i]];
        if (val1 != val2){
          change = true;
          break;
        }
      }
      if(change){
        await this.sponsorService.updateSponsorInfo(this.sponsorInfoForm.value , this.sponsorId).then(
          (recordData) => {
            console.log("Sponsor Info Updated");
          }, 
          (error) => {
            console.log(error);
          }
        );
      }
      this.sponsorService.deleteFromSponsorRecord(this.id);
      this.sponsorService.addToSponsorRecord(this.sponsorInfoForm.value, this.sponsorId);
      this.globalService.closeSubmitDialog();
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
