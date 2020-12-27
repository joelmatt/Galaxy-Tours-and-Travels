import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from './../shared/global.service';
import { SponsorService } from './../shared/sponsor.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {

  dropdownColumns: string[] = ['Name', 'Country', 'Email', 'Contact', 'State'];
  displayColumns: string[] = ['name', 'email', 'state', 'country', 'contact'];
  searchKey: string;
  searchByValue: string = "Search By"
  val: number = -1;

  candidateRecordsCallSub: Subscription;
  tableData: MatTableDataSource<any>;
  sponsorRecordsAvailable: boolean = false;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  noData: boolean = false;

  constructor(private globalService: GlobalService, private sponsorService: SponsorService) { 
    this.globalService.updateCardTitle("Sponsor Entry Portal");
    console.log(this.globalService.cardTitle);
  }

  async ngOnInit(){
    await this.fetchAllSponsors();
  }

  async fetchAllSponsors(){
    if(this.sponsorService.sponsorRecords == null){
      this.sponsorService.fetchAllCandidates().then(
        ((response:[]) => {
          console.log(response);
          this.sponsorService.sponsorRecords = response;
          this.putCandidateRecords();
        })
      )
    }
  }

  putCandidateRecords(){
    this.tableData = new MatTableDataSource(this.sponsorService.sponsorRecords['records']);
    this.sponsorRecordsAvailable = true;
    this.tableData.sort = this.sort;
    if (this.sponsorService.sponsorRecords['records'].length === 0){
      this.noData = true;
    }
  }

  // Searching functions below
  onSearchClear(){
    this.searchKey = "";
    this.applySearchFilter();
  }
  applySearchFilter(){
    this.tableData.filter = this.searchKey.trim().toLowerCase();
  }
  setupFilter(){
    if (this.val != -1){ //default value of val is -1
      this.tableData.filterPredicate = (d, filter: string) => { //d:TableDataSourceType
        const textToSearch = d[this.displayColumns[this.val]] && d[this.displayColumns[this.val]].trim().toLowerCase() || '';
        return textToSearch.indexOf(filter) !== -1;
      };
    }
  }
  filterColumnValue(val: any){
    this.val = val;
    console.log(this.displayColumns[val]);
    this.searchByValue = this.dropdownColumns[val];
   
  }

  addSponsor(){}
}
