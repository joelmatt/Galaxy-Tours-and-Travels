import { Component, OnInit } from '@angular/core';
import { CandidateService} from '../../shared/candidate.service';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {

  candidateRecordAvailabe: boolean = false;
  tableData: MatTableDataSource<any>;
  
  // ALSO CHANGE THIS BELOW ORDER OF ARRAY TO CHANGE THE ORDER OF TABLE
  displayColumns: string[] = ['first_name', 'state', 'contact_no', 'email', 'gender', 'pincode', 'status', 'actions'];
  // here first_name includes both the first_name and the last_name

  constructor(private candidateService: CandidateService) { }

  //Variables for the component


  ngOnInit() {
    this.fetchCandidateRecords();
  }  

  /* fetch candidates from the candidates service and retrying till aws aurora server starts */
   async fetchCandidateRecords(){
    //check if candidate list already exists in the candidate.service
    if(this.candidateService.candidateRecords == null) {
      await this.candidateService.fetchAllCandidates().subscribe(
        (recordData: []) => {  
          console.log(recordData)
          this.candidateService.candidateRecords = recordData;
          this.putCandidateRecords();
        }, 
        (error) => {
          console.error(error);
        }
      );
    }
    else {
      this.putCandidateRecords();
    }
  }

  putCandidateRecords(){
    console.log(this.candidateService.candidateRecords);
    this.tableData = new MatTableDataSource(this.candidateService.candidateRecords['records']);
    this.candidateRecordAvailabe = true;

  }

}
