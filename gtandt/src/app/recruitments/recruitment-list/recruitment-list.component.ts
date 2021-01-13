import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewRecruitmentFormComponent } from '../new-recruitment-form/new-recruitment-form.component';

@Component({
  selector: 'app-recruitment-list',
  templateUrl: './recruitment-list.component.html',
  styleUrls: ['./recruitment-list.component.css']
})
export class RecruitmentListComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addNewRecruitment(){
    return this.dialog.open(NewRecruitmentFormComponent, {
      disableClose: false,
      data:  {damn: "daniel"},
      height: '500px',
      width: '1000px'
    });  
  }
}
