import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../shared/global.service';
@Component({
  selector: 'app-recruitments',
  templateUrl: './recruitments.component.html',
  styleUrls: ['./recruitments.component.css']
})
export class RecruitmentsComponent implements OnInit {

  constructor(private globalService: GlobalService) {
    this.globalService.updateCardTitle("Recruitment Portal");
   }

  ngOnInit(): void {
  }

}
