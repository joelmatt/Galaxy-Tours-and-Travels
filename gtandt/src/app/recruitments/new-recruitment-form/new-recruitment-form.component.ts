import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';

@Component({
  selector: 'app-new-recruitment-form',
  templateUrl: './new-recruitment-form.component.html',
  styleUrls: ['./new-recruitment-form.component.css']
})
export class NewRecruitmentFormComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<NewRecruitmentFormComponent>) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
