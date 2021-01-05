import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OnSubmitPopupComponent } from '../../on-submit-popup/on-submit-popup.component';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  cardTitle: string = "";
  constructor(private dialog: MatDialog) { }

  updateCardTitle(title: string){
    this.cardTitle = title;
  }

  openSubmitDialog(msg: string, mode){
    this.dialog.open(OnSubmitPopupComponent, {
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'confirm-dialog-container',
      data: {message:  msg, mode: mode}
    });  
  }

  openDeleteDialog(msg: string, mode){
    return this.dialog.open(OnSubmitPopupComponent, {
      disableClose: true,
      panelClass: 'confirm-dialog-container',
      data: {message:  msg, mode: mode}
    });  
  }

  closeSubmitDialog(){
    this.dialog.closeAll();
  }
}
