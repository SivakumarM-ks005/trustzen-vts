import { Component } from '@angular/core';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
    selector: 'app-add-contact-dialog',
    templateUrl: './add-contact-dialog.component.html',
    styleUrl: './add-contact-dialog.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatCheckbox, MatDialogActions, MatButton]
})
export class AddContactDialogComponent {

}
