import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss',
    standalone: true,
    imports: [NgIf, MatTooltip, MatDialogClose, MatButton, MatDialogModule]
})
export class ConfirmationDialogComponent {

  header: string = '';
  alert: string;
  ImagePath: string;
  CSSclass: string;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,  // Inject the data passed to the dialog
  ) {
    this.dialogRef.disableClose = true;
    if (this.data.flag == true) {
      this.header = 'Any data entered will be lost.';
      this.alert = 'Do you want to save and proceed?';
      this.ImagePath= '../../assets/images/icons/save.png'
      this.CSSclass='confirm-icon-success'
    } else if (this.data.deleteFlag == true) {
      this.header = 'Are you sure?';
      this.alert = 'You want to delete the details.';
      this.ImagePath= '../../assets/images/icons/delete.png'; 
      this.CSSclass='confirm-icon-delete' 
    } else if(this.data?.checkBtnValue === 'next'){
      this.header = 'Any information entered on the form will be lost.';
      this.alert = 'Do you want to go to the next screen?';
      this.ImagePath= '../../assets/images/icons/exc.png'; 
      this.CSSclass='confirm-icon-warning' 
    } else if(this.data?.checkBtnValue === 'previous'){
      this.header = 'Any information entered on the form will be lost.';
      this.alert = 'Do you want to go to the previous screen?';
      this.ImagePath= '../../assets/images/icons/exc.png'; 
      this.CSSclass='confirm-icon-warning' 
    }
    //Check Reject popup
    else if(this.data?.rejectFlag == true){
      this.header = 'Confirmation';
      this.alert = 'Are you sure, you want to reject?';
      this.ImagePath= '../../assets/images/icons/exc.png'; 
      this.CSSclass='confirm-icon-warning'
    }
    else {
      this.header = 'Any information entered on the form will be lost.';
      this.alert = 'Do you want to cancel?';
      this.ImagePath= '../../assets/images/icons/exc.png'
      this.CSSclass='confirm-icon-warning'
    }
    
  }

  closeDialog(confirm: boolean): void {
    //   if (confirm) {
    //     if (this.data.flag == true) {
    //       this.dialogRef.close(confirm);
    //     } else {
    //       this.data.parentDialogRef.close();  // Close the parent dialog (the form dialog)
    //       this.dialogRef.close(false);  // Close the confirmation dialog
    //     }
    //   } else {
    //     this.dialogRef.close();  // Only close the confirmation dialog if "No" is clicked
    //   }
    this.dialogRef.close(confirm);
  }
}
