import { Component } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-dialog-freeze-template',
    templateUrl: './dialog-freeze-template.component.html',
    styleUrl: './dialog-freeze-template.component.scss',
    standalone: true,
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class DialogFreezeTemplateComponent {
    constructor(public dialogRef: MatDialogRef<DialogFreezeTemplateComponent>
      ) { }
    closeDialog(confirm: boolean): void {
        this.dialogRef.close(confirm);
      }
}
