import { Component } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatePipe, Location, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { OnlyAllowedInputDirective } from '@app/core/directives/only-allowed-input.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router } from '@angular/router'

@Component({
  selector: 'app-rfx-insights',
  standalone: true,
  imports: [
    UpperCasePipe,
    OnlyAllowedInputDirective,
    MatTooltip,
    MatInputModule,
    MatIconModule,
    CdkScrollable,
    NgClass,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatCheckbox,
    NgFor,
    NgIf,
    MatError,
    MatInput,
    MatIcon,
    MatDatepickerModule,
    DatePipe,
  ],
  templateUrl: './rfx-insights.component.html',
  styleUrl: './rfx-insights.component.scss'
})
export class RfxInsightsComponent {
  constructor( public router : Router){}
  goBack(){
    this.router.navigate(['/krya/rfq-list'])
  }
}
