import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA,  MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatAccordion, MatExpansionPanel,MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { NgFor, NgIf, DecimalPipe, TitleCasePipe, DatePipe, NgClass } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-material-issue-notes',
  standalone: true,
 imports: [NgClass, MatCheckbox, MatTooltip, FormsModule,
    ReactiveFormsModule, MatFormField, MatLabel, MatSelect,  MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions,
    MatOption, MatInput, MatAccordion, MatExpansionPanel,
    MatDatepickerModule,
    MatExpansionPanelHeader, MatExpansionPanelTitle],
  templateUrl: './material-issue-notes.component.html',
  styleUrl: './material-issue-notes.component.scss'
})
export class MaterialIssueNotesComponent {

}
