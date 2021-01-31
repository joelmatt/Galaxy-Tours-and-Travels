import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewRecruitmentFormComponent } from '../new-recruitment-form/new-recruitment-form.component';
import { RecruitmentService } from '../../shared/recruitment.service';
@Component({
  selector: 'app-recruitment-list',
  templateUrl: './recruitment-list.component.html',
  styleUrls: ['./recruitment-list.component.css']
})
export class RecruitmentListComponent implements OnInit {

  constructor(private dialog: MatDialog, private recruitmentService: RecruitmentService) { }
  isLoading = false;
  recruitmentRecords: any = [];

  async ngOnInit() {
    if (this.recruitmentService.recruitmentRecords === null){
      this.isLoading = true;
      await this.recruitmentService.fetchAllRecruitments().then(
        (recordData) => {
          this.recruitmentService.recruitmentRecords = recordData['records'];
          this.recruitmentRecords = recordData['records'];
          console.log(recordData);
        }, 
        (error) => {
          console.error(error);
        }
      );
      this.isLoading = false;
    }
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
