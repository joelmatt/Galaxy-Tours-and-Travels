import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CandidateService} from '../../shared/candidate.service';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {

    //Variables for the component
  candidateRecordAvailabe: boolean = false;
  tableData: MatTableDataSource<any>;
  noData: boolean = false;
  searchKey: string;
  val: number = -1;
  searchByValue: string = "Search By"
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  
  // ALSO CHANGE THIS BELOW ORDER OF ARRAY TO CHANGE THE ORDER OF TABLE
  displayColumns: string[] = ['first_name', 'state', 'contact_no', 'email', 'gender', 'pincode', 'status', 'actions'];
  // here first_name includes both the first_name and the last_name
  dropdownColumns: string[] = ['Name', 'State', 'Contact', 'email', 'Gender', 'Pincode', 'Status'];

  /* order of both the above two arrays MUST BE the same */

  constructor(public candidateService: CandidateService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {
    this.fetchCandidateRecords();
  }  

  /* fetch candidates from the candidates service and retrying till aws aurora server starts */
  fetchCandidateRecords(){
    //check if candidate list already exists in the candidate.service
    if(this.candidateService.candidateRecords == null) {
       this.candidateService.fetchAllCandidates().subscribe(
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
    this.tableData = new MatTableDataSource(this.candidateService.candidateRecords['records']);
    this.candidateRecordAvailabe = true;
    this.tableData.sort = this.sort;
    if (this.candidateService.candidateRecords['records'].length === 0){
      this.noData = true;
    }
  }

  onSearchClear(){
    this.searchKey = "";
    this.applySearchFilter();
  }
  
  applySearchFilter(){
    this.tableData.filter = this.searchKey.trim().toLowerCase();
  }

  filterColumnValue(val: any){
    this.val = val;
    console.log(this.displayColumns[val]);
    this.searchByValue = this.dropdownColumns[val];
   
  }

  // not using setup filter when there is searchby value is again set to default i.e. no column value is selected
  setupFilter(){
    if (this.val != -1){ //default value of val is -1
      this.tableData.filterPredicate = (d, filter: string) => { //d:TableDataSourceType
        const textToSearch = d[this.displayColumns[this.val]] && d[this.displayColumns[this.val]].trim().toLowerCase() || '';
        return textToSearch.indexOf(filter) !== -1;
      };
    }
  }

  addCandidate(){
    this.router.navigate(['../newCandidate'], {relativeTo: this.route});
  }

  editOrDelete(id: number, candidateId: string){  //id=1 => Edit; id=0 => Delete 
    if (id){//edit
      this.router.navigate(['../', candidateId, 'editCandidate'], {relativeTo: this.route})      
    }
    else{//delete
      console.log("Delete Candidate" + candidateId);
    }
  }
}