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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogIncotermsComponent } from '../dialogs/dialog-incoterms/dialog-incoterms.component'
import { ApprovalSummaryComponent } from '../dialogs/approval-summary/approval-summary.component'
import { CompareSupplierCqaComponent } from '../dialogs/compare-supplier-cqa/compare-supplier-cqa.component'
@Component({
  selector: 'app-cqa',
  standalone: true,
  imports: [MatDialogTitle, UpperCasePipe, OnlyAllowedInputDirective, MatIconButton, MatDialogClose, MatTooltip, MatInputModule, MatIconModule, MatButtonModule, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule,
    NgClass, MatFormField, MatLabel, MatSelect, MatOption, NgFor, NgIf, MatError, MatInput, MatDialogActions,
    MatIcon, MatButton, MatCheckboxModule, TranslatePipe, MatDatepickerModule],
  templateUrl: './cqa.component.html',
  styleUrl: './cqa.component.scss'
})
export class CqaComponent {
  constructor(private dialog: MatDialog) {

  }
  incoTerms() {
    this.dialog.open(DialogIncotermsComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '90%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }

  approvalSummary() {
    this.dialog.open(ApprovalSummaryComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '90%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }

  compareCQA() {
    this.dialog.open(CompareSupplierCqaComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '90%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }
}
