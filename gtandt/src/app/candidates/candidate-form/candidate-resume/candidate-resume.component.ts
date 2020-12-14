import { Component, OnDestroy, OnInit } from '@angular/core';
import { CandidateService } from './../../../shared/candidate.service';
import { HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver/dist/FileSaver';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-candidate-resume',
  templateUrl: './candidate-resume.component.html',
  styleUrls: ['./candidate-resume.component.css']
})
export class CandidateResumeComponent implements OnInit, OnDestroy {

  constructor(private candidateService: CandidateService){}

  file: File = null;
  candidateBiodataUrl: string = null;
  header: string = "Upload Candidate Resume PDF";
  subheader: string = "Drag and Drop a File or Click Here";
  biodataPresent: boolean = false;
  fileSpec: boolean = true;
  isLoading: boolean = false;
  uploadBoxBackground = "#F7F8FC";


  uploadFile( event: any) {
    if (event[0].type != "application/pdf" || event.length > 1){
      this.header = "Upload Again. Only PDF Permitted";
      this.fileSpec = true;
      this.uploadBoxBackground = "rgb(200, 35, 51, 0.4)"; //: rgba(red,green,blue,opacity);
    }
    else{
      this.file = event[0];
      this.header = "File Name: "+ event[0].name;
      this.fileSpec = false;
      this.uploadBoxBackground = "rgb(0, 202, 128, 0.4)";
      this.subheader = null;
    }
  }

  ngOnInit(){
    console.log("Candidate Resume component laoded");
    this.candidateBiodataUrl = this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['biodata'];
    if(this.candidateBiodataUrl){
      console.log('There is biodata');
      this.biodataPresent = true;    
    }
    else{
      console.log("there is no Biodata");
      this.biodataPresent = false;
    }
  }

  ngOnDestroy(){
    console.log("destroyed resume component");
  }

  async addResume(){
    this.fileSpec = true;
    this.isLoading = true;

    let signedUrl : string =  null;
    let objectUrl: string = null;
    let fileName: string = this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['candidate_id']
    +"_"+this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['first_name']
    +"_"+this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['last_name'];
    console.log("File Name: " +fileName);
    await this.candidateService.getSignedUrl(fileName).then(
      (response: []) => {
        signedUrl = response['signedUrl'];
        objectUrl = response['objectUrl'];
      }
    );
    
    await this.candidateService.uploadResume(signedUrl, this.file).then
    (async (data) => {
      console.log("File Uploaded to S3");
      let candidateId = this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['candidate_id'];
      await this.candidateService.addCandidateResume(objectUrl, candidateId)
      .then(
        (resp => {
          console.log("Object Url added to Database");
          this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['biodata'] = objectUrl;
          this.candidateBiodataUrl = objectUrl;
          this.isLoading = false;
          this.biodataPresent = true;
          // this.fileSpec = false; // on false because chances user can upload again.
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
    .catch((err: HttpErrorResponse) => {
      this.isLoading = false;
      this.uploadBoxBackground = "rgb(200, 35, 51, 0.4)"; 
      this.header = "Some Error Occoured. Try Again";
      this.subheader = "Drag and Drop a File or Click Here";
      console.log(err);
    }); 
  }

  onDeleteResume() {
    this.candidateService.openDeleteDialog("Are you sure to delete the Resume ?", "delete").afterClosed().subscribe(
      async res => {
        if(res){
          this.candidateService.openSubmitDialog("Please wait while Resume is deleted", "edit");
          let candidateId = this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['candidate_id'];
          await this.candidateService.deleteCandidateResume(candidateId ,this.candidateBiodataUrl).then(
            (response: []) => {
              console.log(response);
              // when file is deleted
              this.candidateService.candidateRecords['records'][this.candidateService.indexOfCandidate]['biodata'] = null;
              this.biodataPresent = false;
            },
            (error) => {
              console.error(error);
            }
          );
          this.candidateService.closeSubmitDialog();
          // this.putCandidateRecords(); not performing this action since the candidate list component is destroyed and will be rebuilt later.
          this.reloadComponentState();
        }
      }
    );
  }

  reloadComponentState(){
    this.candidateBiodataUrl = null;
    this.file = null;
    this.header = "Upload Candidate Resume PDF";
    this.subheader = "Drag and Drop a File or Click Here";
    this.uploadBoxBackground = "#F7F8FC";
    this.isLoading = false;
  }

  downloadResume(){
    let temp = this.candidateBiodataUrl.split('_');
    let fileName: string = temp[1] + temp[2] + "Resume" +".pdf";
    this.candidateService.downloadFileFromS3(this.candidateBiodataUrl).then(
      (resp)=>{
        saveAs(resp, fileName)
    }),err => {
      console.log(error);
    }
  }
}
