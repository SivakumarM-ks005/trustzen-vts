import { Component } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
    selector: 'app-compliance',
    templateUrl: './compliance.component.html',
    styleUrl: './compliance.component.scss',
    standalone: true,
    imports: [MatFormField, MatLabel, MatSelect, MatTooltip, MatOption, MatInput, MatCheckbox]
})
export class ComplianceComponent {

}
