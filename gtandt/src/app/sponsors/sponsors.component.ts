import { Component, OnInit, Output } from '@angular/core';
import { GlobalService } from './../shared/global.service';

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

  constructor(private globalService: GlobalService) { 
    this.globalService.updateCardTitle("Sponsor Entry Portal");
    console.log(this.globalService.cardTitle);
  }

  ngOnInit(): void {
   
  }

  // Searching functions below
  onSearchClear(){
    this.searchKey = "";
    this.applySearchFilter();
  }
  applySearchFilter(){
    // this.tableData.filter = this.searchKey.trim().toLowerCase();
  }
  setupFilter(){
    // if (this.val != -1){ //default value of val is -1
    //   this.tableData.filterPredicate = (d, filter: string) => { //d:TableDataSourceType
    //     const textToSearch = d[this.displayColumns[this.val]] && d[this.displayColumns[this.val]].trim().toLowerCase() || '';
    //     return textToSearch.indexOf(filter) !== -1;
    //   };
    // }
  }
  filterColumnValue(val: any){
    this.val = val;
    console.log(this.displayColumns[val]);
    this.searchByValue = this.dropdownColumns[val];
   
  }


}
