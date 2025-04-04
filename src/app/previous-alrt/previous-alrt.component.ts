import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-previous-alrt',
  standalone: true,
  imports: [NgIf],
  templateUrl: './previous-alrt.component.html',
  styleUrl: './previous-alrt.component.scss'
})
export class PreviousAlrtComponent {

  header: string = '';
  alert: string;

  constructor(public dialogRef: MatDialogRef<PreviousAlrtComponent>, @Inject(MAT_DIALOG_DATA) public data: any,  // Inject the data passed to the dialog
  ) {
    this.dialogRef.disableClose = true;
      this.header = 'Any information entered on the form will be lost';
      this.alert = 'Do you want to Save and Proceed';
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
