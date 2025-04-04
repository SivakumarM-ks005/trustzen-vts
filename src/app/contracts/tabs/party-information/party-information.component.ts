import { Component } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
    selector: 'app-party-information',
    templateUrl: './party-information.component.html',
    styleUrl: './party-information.component.scss',
    standalone: true,
    imports: [MatSelect, MatTooltip, MatOption, MatFormField, MatLabel, MatInput]
})
export class PartyInformationComponent {

}
