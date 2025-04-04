import { Component } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ClauseLibrary } from '../../../core/models/contract-clause.model';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
    selector: 'app-delete-clause',
    templateUrl: './delete-clause.component.html',
    styleUrl: './delete-clause.component.scss',
    standalone: true,
    imports: [MatIconButton, MatDialogTitle, MatIcon, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, CdkTextareaAutosize, MatDialogActions, MatButton, MatDialogClose]
})
export class DeleteClauseComponent {
    templateData: ClauseLibrary = new ClauseLibrary();
    constructor(
        private dialogRef: MatDialogRef<DeleteClauseComponent>,
    ) { }
    closeYesDlg() {
        this.dialogRef.close(true);
    }
}
