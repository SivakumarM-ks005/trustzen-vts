import { Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { SupplierUserFormService } from '../core/services/supplier-management/supplier.user.form.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-supplier-registration',
  templateUrl: './supplier-registration.component.html',
  styleUrl: './supplier-registration.component.scss',
  standalone: true,
  imports: [MatDialogTitle, UpperCasePipe,MatIconButton, MatDialogClose, MatTooltip, MatInputModule, MatIconModule, MatButtonModule, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule,
    NgClass, MatFormField, MatLabel, MatSelect, MatOption, NgFor, NgIf, MatError, MatInput, MatDialogActions,
    MatIcon, MatButton, TranslatePipe]
})
export class SupplierRegistrationComponent {
  isRtl: boolean = false;
  isPasswordVisible: boolean = true;  // Flag to control password visibility
  isConformPasswordVisible: boolean = true;
  showMFA: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<SupplierRegistrationComponent>,
    public dialog: MatDialog,
    public SupplierUserForm: SupplierUserFormService
  ) {
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;  // Toggle visibility
  }
  toggleConformPasswordVisibility() {
    this.isConformPasswordVisible = !this.isConformPasswordVisible;
  }





















}




interface countryPhcode {
  countryId: number;
  countryName: string;
  landNumberCode: string;
  mobileCode: string;
  countryCode: string
}

