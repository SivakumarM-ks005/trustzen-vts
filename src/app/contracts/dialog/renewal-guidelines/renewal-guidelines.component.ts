import { Component } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatLabel, MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-renewal-guidelines',
    templateUrl: './renewal-guidelines.component.html',
    styleUrl: './renewal-guidelines.component.scss',
    standalone: true,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatLabel, MatFormField, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatRadioGroup, MatRadioButton, MatCheckbox, MatDialogActions, MatButton, MatDialogClose, TranslatePipe]
})
export class RenewalGuidelinesComponent {

}
