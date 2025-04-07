import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonService } from '../core/services/common.service';
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
  imports: [
    MatDialogTitle, UpperCasePipe, MatIconButton, MatDialogClose, MatTooltip, MatInputModule, 
    MatIconModule, MatButtonModule, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule,
    NgClass, MatFormField, MatLabel, MatSelect, MatOption, NgFor, NgIf, MatError, MatInput, 
    MatDialogActions, MatIcon, MatButton, TranslatePipe
  ]
})
export class SupplierRegistrationComponent {
  supplierForm!: FormGroup;
  isRtl: boolean = false;
  isPasswordVisible: boolean = true;
  isConformPasswordVisible: boolean = true;
  supplierOtpValidationForm!: FormGroup;
  showMFA: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SupplierRegistrationComponent>,
    public dialog: MatDialog,
    public commonService: CommonService,
    public SupplierUserForm: SupplierUserFormService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConformPasswordVisibility() {
    this.isConformPasswordVisible = !this.isConformPasswordVisible;
  }

  initForm() {
    this.supplierForm = this.fb.group({
      supplierClassificationId: ['', Validators.required],
      supplierName: ['', Validators.required],
      supplierNameNativeLang: [''],
      tradeLicense: ['', Validators.required],
      siteCode: [''],
      siteName: [''],
      userName: [null],
      password: [null],
      confirmPassword: [null],
      companyEmail: ['', Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)],
      taxRegistration: ['', Validators.required],
      salutation: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      designation: ['', Validators.required],
      contactRoleId: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      mobileCountryId: ['', Validators.required],
      mobileCode: [''],
      mobileNumber: ['', Validators.required],
      landlineNumber: [''],
      landlineCode: [''],
      landlineCountryId: [null],
      status: ['Draft']
    });
    this.supplierOtpValidationForm = this.fb.group({
      userName: new FormControl('', [Validators.required]),
    });
  }
}
