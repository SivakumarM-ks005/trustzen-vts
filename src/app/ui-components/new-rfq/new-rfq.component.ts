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
import { MatCheckbox } from '@angular/material/checkbox';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-rfq',
  standalone: true,
  imports: [MatDialogTitle, UpperCasePipe, OnlyAllowedInputDirective, MatIconButton, MatDialogClose, MatTooltip,  MatInputModule, MatIconModule, MatButtonModule, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, 
    NgClass, MatFormField,MatCheckbox, MatLabel, MatSelect, MatOption, NgFor, NgIf, MatError, MatInput, MatDialogActions, 
    MatIcon, MatButton, TranslatePipe,MatDatepickerModule],
  templateUrl: './new-rfq.component.html',
  styleUrl: './new-rfq.component.scss'
})
export class NewRfqComponent {
  constructor (private dialog:MatDialog, public route: Router){}
  @ViewChild('addSupplier') addSupplier: any;
  addSupplierPopup() {
    this.dialog.open(this.addSupplier, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '65%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
   
  }
 goBack(){
  alert();
  this.route.navigate(['/rfq-list']);

 }
}
