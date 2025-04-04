import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';

@Component({
    selector: 'app-milestone',
    templateUrl: './milestone.component.html',
    styleUrl: './milestone.component.scss',
    standalone: true,
    imports: [MatIcon, MatTooltip, MatFormField, MatSelect, MatOption, MatInput, MatCheckbox, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker]
})
export class MilestoneComponent {

}
