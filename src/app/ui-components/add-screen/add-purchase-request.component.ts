import { Component, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatIconButton, MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { OnlyAllowedInputDirective } from '@app/core/directives/only-allowed-input.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-add-purchase-request',
  standalone: true,
   imports: [MatDialogTitle, UpperCasePipe, OnlyAllowedInputDirective, MatIconButton, MatDialogClose, MatTooltip,  MatInputModule, MatIconModule, MatButtonModule, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, 
      NgClass, MatFormField, MatLabel, MatSelect, MatOption, NgFor, NgIf, MatError, MatInput, MatDialogActions, 
      MatIcon, MatButton, TranslatePipe,MatDatepickerModule],
  templateUrl: './add-purchase-request.component.html',
  styleUrl: './add-purchase-request.component.scss'
})
export class AddPurchaseRequestComponent {

}
