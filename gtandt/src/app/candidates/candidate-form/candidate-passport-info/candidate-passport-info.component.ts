import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CandidateService } from 'src/app/shared/candidate.service';
import { GlobalService } from 'src/app/shared/global.service';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver/dist/FileSaver';
import { error } from '@angular/compiler/src/util';



@Component({
  selector: 'app-candidate-passport-info',
  templateUrl: './candidate-passport-info.component.html',
  styleUrls: ['./candidate-passport-info.component.css'],
})
export class CandidatePassportInfoComponent implements OnInit {

  //file input variables
  file: File = null;
  candidatePassportCopyUrl: string = null;
  header: string = "Upload Candidate Passport Copy PDF";
  subheader: string = "Drag and Drop a File or Click Here";
  passportCopyPresent: boolean = false;
  uploadBoxBackground = "#F7F8FC";

  public loadedPdf: PDFDocumentProxy;
  
  editMode: boolean = false;
  isLoading: boolean = false;
  candidateId: string = null;
  deleteFile: boolean = false;
  updateFile: boolean = false;

  //values to enter in the form
  candidatePassportInfoForm: FormGroup;
  passport_no: string = ''; // For now the passport size should be 9, 1 alphabet and 8 numbers
  placeOfIssue: string = '';
  DOI: string = '';
  DOE: string = '';
  passportCopyUrl: string = '';
  submitButtonText: string = "SUBMIT";

  constructor(private candidateService: CandidateService, private globalService: GlobalService) { }

  async ngOnInit() {
    this.candidateId = this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['candidate_id'];
    this.isLoading = true;
    await this.candidateService.getCandidatePassportInfo(this.candidateId).then(
      (response => {
        if(response['records'].length > 0){
          this.editMode = true; 
          this.submitButtonText = "UPDATE";
          this.passport_no = response['records'][0]['passport_no'];
          this.placeOfIssue = response['records'][0]['POI'];
          this.DOI = response['records'][0]['DOI'];
          this.DOE = response['records'][0]['DOE'];
          this.passportCopyUrl = response['records'][0]['passport_copy'];
          this.isLoading = false;
          if(this.passportCopyUrl){
            this.passportCopyPresent = true;
            this.candidatePassportCopyUrl = this.passportCopyUrl;
          }
        }
        else{
          this.isLoading = false;
        }
      })
    );
    this.candidatePassportInfoForm = new FormGroup({
      'passport_no': new FormControl(this.passport_no, [Validators.required, Validators.minLength(3), Validators.maxLength(9), Validators.pattern(/^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/)]),
      'place_of_issue': new FormControl(this.placeOfIssue, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'DOI': new FormControl(this.DOI, [Validators.required]),
      'DOE': new FormControl(this.DOE, [Validators.required]),
    });
  }

  async onCandidatePassportInfoSubmit(){
    let formValues = this.candidatePassportInfoForm.value;
    if(!this.editMode){ // For new passport info
      this.globalService.openSubmitDialog('Please Wait while Passport Info is Added', 'edit');
      await this.candidateService.addCandidatePassportInfo(this.candidateId, formValues.passport_no, formValues.place_of_issue, formValues.DOI, formValues.DOE)
      .then(
        (async (response) => {
          console.log(response);
          await this.fileHandling();
          this.globalService.closeSubmitDialog();
        }),
        (error =>{
          console.log("Some Error Boi");
          this.globalService.closeSubmitDialog();
        })
      ) 
    }
    else{
      
      let passportDetailUploaded: boolean = false; // variable used because only when updated details are stored in the can we the move to add the file to the db and s3
      this.globalService.openSubmitDialog('Please Wait while Info is Updated', 'edit');
      if(formValues.passport_no !== this.passport_no || formValues.place_of_issue !== this.placeOfIssue || formValues.DOI !== this.DOI || formValues.DOE !== this.DOE){
        // If form is updated
        await this.candidateService.updateCandidatePassportInfo(this.candidateId, formValues.passport_no, formValues.place_of_issue, formValues.DOI, formValues.DOE)
        .then(
          (response => {
            passportDetailUploaded = true;
          })
        )
        this.globalService.closeSubmitDialog();  
      }
      else{
        // If the form details is not updated
        passportDetailUploaded = true;
      }
      // now if changes is made w.r.t the file then we below code works
      if(passportDetailUploaded){
        if(this.deleteFile){
          await this.candidateService.deleteCandidatePassportCopy(this.candidateId, this.candidatePassportCopyUrl).then(
            (async (response) => {
              await this.fileHandling();
            })  
          );
        }
        else{
          if(this.file){
            await this.fileHandling();
          }
        }
      }

    }
    this.globalService.closeSubmitDialog();
  }

  uploadFile( event: any) {
    if (event[0].type != "application/pdf" || event.length > 1){
      this.header = "Upload Again. Only PDF Permitted";
      this.uploadBoxBackground = "rgb(200, 35, 51, 0.4)"; //: rgba(red,green,blue,opacity);
    }
    else{
      this.file = event[0];
      this.header = "File Name: "+ event[0].name;
      this.uploadBoxBackground = "rgb(0, 202, 128, 0.4)";
      this.subheader = null;
    }
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.loadedPdf = pdf;
  } 

  reloadComponentState(){
    this.candidatePassportCopyUrl = null;
    this.file = null;
    this.header = "Upload Candidate Passport Copy PDF";
    this.subheader = "Drag and Drop a File or Click Here";
    this.uploadBoxBackground = "#F7F8FC";
    this.isLoading = false;
    this.loadedPdf.destroy();
  }

  async fileHandling(){
    if(this.file){
      console.log("file is present");
      let signedUrl: string = null;
      let objectUrl: string = null;
      // firstly, we get the signed url
      let firstName: string = this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['first_name'];
      let fileName: string = this.candidateId+'_'+firstName+'_passport_copy';
      await this.candidateService.getSignedUrl(fileName, "Passport").then(
        (response => {
          signedUrl = response['signedUrl'];
          objectUrl = response['objectUrl'];
        }),
      );
      await this.candidateService.uploadFile(signedUrl, this.file).then(
        (async (response)=>{
          console.log("Passport Copy Updated");
          await this.candidateService.addCandidatePassportCopy(objectUrl, this.candidateId).then(
            (response => {
              console.log("Object Url added to Database");
              this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['biodata'] = objectUrl;
              this.candidatePassportCopyUrl = objectUrl;
              this.isLoading = false;
              this.deleteFile = false;
              this.passportCopyPresent = true;  
            })
          )
          .catch((err: HttpErrorResponse) => {
          this.isLoading = false;
          this.uploadBoxBackground = "rgb(200, 35, 51, 0.4)"; 
          this.header = "Some Error Occoured. Try Again";
          this.subheader = "Drag and Drop a File or Click Here";
          console.log(err);
        });
        })
      ).catch((err: HttpErrorResponse) => {
        this.isLoading = false;
        this.uploadBoxBackground = "rgb(200, 35, 51, 0.4)"; 
        this.header = "Some Error Occoured. Try Again";
        this.subheader = "Drag and Drop a File or Click Here";
        console.log(err);
      }); 
    }
  }

  onDeletePassportCopy(){
    this.deleteFile = true;
    this.passportCopyPresent = false;
    this.reloadComponentState();
  }

  downloadPassportCopy(){
    let temp = this.candidatePassportCopyUrl.split('_');
    let fileName: string = temp[1] +  "passport_copy" +".pdf";
    this.candidateService.downloadFileFromS3(this.candidatePassportCopyUrl).then(
      (resp)=>{
        saveAs(resp, fileName)
    }),err => {
      console.log(error);
    }
  }
}
