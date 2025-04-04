import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-pre-qualification-process',
  standalone: true,
  imports: [NgIf, MatTooltip, MatDialogClose, MatButton, MatDialogModule],
  templateUrl: './pre-qualification-process.component.html',
  styleUrl: './pre-qualification-process.component.scss'
})
export class PreQualificationProcessComponent {

 header: string = '';
  alert: string;
  ImagePath: string;
  CSSclass: string;

  constructor(public dialogRef: MatDialogRef<PreQualificationProcessComponent>, @Inject(MAT_DIALOG_DATA) public data: any,  // Inject the data passed to the dialog
  ) {
    this.dialogRef.disableClose = true;
    console.log('this.datda',this.data);
    
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
