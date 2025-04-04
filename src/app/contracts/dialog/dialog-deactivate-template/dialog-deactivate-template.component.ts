import { Component } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-dialog-deactivate-template',
  templateUrl: './dialog-deactivate-template.component.html',
  styleUrl: './dialog-deactivate-template.component.scss',
  standalone: true,
  imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class DialogDeactivateTemplateComponent {
  constructor(public dialogRef: MatDialogRef<DialogDeactivateTemplateComponent>
  ) { }

  closeDialog(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }
}
