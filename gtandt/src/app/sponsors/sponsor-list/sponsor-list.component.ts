import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from './../../shared/global.service';
import { SponsorService } from './../../shared/sponsor.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sponsor-list',
  templateUrl: './sponsor-list.component.html',
  styleUrls: ['./sponsor-list.component.css']
}) 
export class SponsorListComponent implements OnInit {

  dropdownColumns: string[] = ['Name', 'Email', 'State', 'Country', 'Contact'];
  displayColumns: string[] = ['name', 'email', 'state', 'country', 'contact', 'actions'];
  searchKey: string;
  searchByValue: string = "Search By"
  val: number = -1;

  // candidateRecordsCallSub: Subscription;
  tableData: MatTableDataSource<any>;
  sponsorRecordsAvailable: boolean = false;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  noData: boolean = false;

  constructor(private globalService: GlobalService, public sponsorService: SponsorService, private router: Router, private route: ActivatedRoute) { 
    this.globalService.updateCardTitle("Sponsor Entry Portal");
    console.log(this.globalService.cardTitle);
  }

  async ngOnInit(){
    await this.fetchAllSponsors();
  }

  async fetchAllSponsors(){
    if(this.sponsorService.sponsorRecords == null){
      this.sponsorService.fetchAllSponsors().then(
        ((response:[]) => {
          console.log(response);
          this.sponsorService.sponsorRecords = response;
          this.putCandidateRecords();
        })
      )
    }
    else{
      this.putCandidateRecords();
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

  addSponsor(){
    console.log(this.route);
    this.router.navigate(['newSponsor'], {relativeTo: this.route});
  }

  edit(id: any){//id is any because not sure to put number or string
    this.router.navigate([id, 'editSponsor'], {relativeTo: this.route}); 
  } 
}
