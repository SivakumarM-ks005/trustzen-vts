import { Component, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { LanguageService } from '../core/services/language/language.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CommonService } from '../core/services/common.service';
import { AdminService } from '../core/services/admin/admin.service';
import { MatIconButton, MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { LoginService } from '../core/services/login/login.service';
import { SupplierUserFormService } from '../core/services/supplier-management/supplier.user.form.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { UppercaseOnlyDirective } from '../core/directives/uppercase-only.directive';
import { environment } from '../../environments/environment';
import { OnlyAllowedInputDirective, OnlyAllowedSymbolInputDirective } from '@app/core/directives/only-allowed-input.directive';

interface PhoneCode {
  countryId: number;
  country: string;
  countryCode: string;
}
@Component({
  selector: 'app-supplier-registration',
  templateUrl: './supplier-registration.component.html',
  styleUrl: './supplier-registration.component.scss',
  standalone: true,
  imports: [MatDialogTitle, UpperCasePipe, OnlyAllowedInputDirective, OnlyAllowedSymbolInputDirective, MatIconButton, MatDialogClose, MatTooltip, MatInputModule, MatIconModule, MatButtonModule, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule,
    NgClass, MatFormField, MatLabel, MatSelect, MatOption, NgFor, NgIf, MatError, MatInput, MatDialogActions,
    MatIcon, MatButton, TranslatePipe, UppercaseOnlyDirective]
})
export class SupplierRegistrationComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  supplierForm!: FormGroup;
  phoneCodeList: PhoneCode[] = [
    { countryId: 1, country: "Afghanistan", countryCode: "+93" },
    { countryId: 2, country: "Albania", countryCode: "+355" },
    { countryId: 3, country: "Algeria", countryCode: "+213" },
    { countryId: 4, country: "India", countryCode: "+91" },
    { countryId: 5, country: "USA", countryCode: "+1" },
    { countryId: 6, country: "UK", countryCode: "+44" },
    { countryId: 7, country: "Germany", countryCode: "+49" },
    // Add more countries as needed
  ];
  filterCodeList: PhoneCode[] = [];
  isRtl: boolean = false;
  userList = [];
  supplierClassificationList: any = [];
  salutationList: any = [];
  roleList: any = [];
  supplierPhoneCode: countryPhcode[] = [];
  multisitesuppliersetup: boolean = false;
  multilanguageenable: any;
  isPasswordVisible: boolean = true;  // Flag to control password visibility
  isConformPasswordVisible: boolean = true;

  supplierOtpValidationForm!: FormGroup;
  //MFA variables
  showMFA: boolean = false;
  mfaCode: string = '';
  userId!: number;
  isResendDisabled: boolean = false;
  resendCountdown: number = 90; // Countdown in seconds
  countdownInterval: any;
  enableAfterFieldsValid: boolean = false;
  getOTPBtn: boolean = false;
  isSubmitted = false;
  managementDetails: any;

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<SupplierRegistrationComponent>,
    public loginService: LoginService,
    public dialog: MatDialog,
    public commonService: CommonService,
    public adminService: AdminService,
    public SupplierUserForm: SupplierUserFormService
  ) {
  }

  ngOnInit(): void {
    this.checkOTPEnable();
    this.languageService.currentLanguage$.subscribe(language => {
      this.translate.use(language);
      this.isRtl = language === 'ar';
    });
    this.initForm();
    // this.getUser();
    this.getSupplierClassification();
    this.getSalutation();
    this.getRole();
    this.DropDowncountryCode();
    this.GetSupplierManagement();
    this.GetSysParameterGeneral();
    this.supplierForm.statusChanges.subscribe((status) => {
      if (status === "INVALID") {
        this.enableAfterFieldsValid = false;
      } else {
        this.enableAfterFieldsValid = true;
      }
    })
  }

  checkOTPEnable() {
    this.loginService.getScurity().subscribe((resData: any) => {
      if (!resData?.enableOTPFlag) {
        this.getOTPBtn = false;
      } else {
        this.getOTPBtn = true;
      }
    })
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;  // Toggle visibility
  }

  toggleConformPasswordVisibility() {
    this.isConformPasswordVisible = !this.isConformPasswordVisible;
  }

  GetSupplierManagement() {
    this.SupplierUserForm.GetSupplierManagement().subscribe(res => {
      if (res) {
        this.managementDetails = res;
        this.multisitesuppliersetup = res.general.enableMultiSiteSupplierSetup;
        if (this.multisitesuppliersetup) {
          this.supplierForm.get('siteCode')?.addValidators([Validators.required]);
          this.supplierForm.get('siteName')?.addValidators([Validators.required]);
        } else {
          this.supplierForm.get('siteCode')?.clearValidators();
          this.supplierForm.get('siteName')?.clearValidators();
        }
      }
    })
  }
  GetSysParameterGeneral() {
    this.SupplierUserForm.GetSysParameterGeneral().subscribe(res => {
      if (res) {
        this.multilanguageenable = res.multiLanguage;
      }
    })
  }
  getSupplierClassification() {
    this.supplierClassificationList = [];
    this.commonService.getSupplierClassification().subscribe((result: any) => {
      if (result) {
        this.supplierClassificationList = result;
      }
    })
  }
  getSalutation() {
    this.salutationList = [];
    this.commonService.getSalutation().subscribe((result: any) => {
      if (result) {
        this.salutationList = result;
      }
    })
  }
  getRole() {
    this.roleList = [];
    this.commonService.getRole().subscribe((result: any) => {
      if (result) {
        this.roleList = result;
      }
    })
  }
  // getUser() {
  //   this.userList = [];
  //   this.commonService.getUser().subscribe((result: any) => {
  //     if (result) {
  //       this.userList = result;
  //     }
  //   })
  // }
  DropDowncountryCode(): void {
    this.loginService.getCountry().subscribe(data => {
      if (data) {
        this.supplierPhoneCode = data;
      }
    });
  }
  onCountryCodeChange(selectedCode: string, contactForm: FormGroup): void {
    const selectedCountry = this.supplierPhoneCode.find(
      (country) => country.landNumberCode === selectedCode
    );
    if (selectedCountry) {
      contactForm.get('landlineCountryId')?.setValue(selectedCountry.countryId);
    }
  }
  onCountryMobilePhoneChange(selectedCode: string, contactForm: FormGroup) {
    const selectedCountry = this.supplierPhoneCode.find(
      (country) => country.mobileCode === selectedCode
    );
    if (selectedCountry) {
      contactForm.get('mobileCountryId')?.setValue(selectedCountry.countryId);
    }
  }
  validateUserName() {
    // const existingUser = this.userList.some((ele: any) =>
    //   this.supplierForm.get('userName')?.value === ele.userName
    // );

    if (this.supplierOtpValidationForm.get('userName')?.value) {
      let obj = {
        userName: this.supplierOtpValidationForm.get('userName')?.value
      }
      if (obj?.userName) {
        this.loginService.checkUserNameExist(obj).subscribe((res) => {
          if (res?.success) {
            this.supplierOtpValidationForm.get('userName')?.setErrors(null);
          } else {
            this.adminService.showMessage(res.message)
            this.supplierOtpValidationForm.get('userName')?.setErrors({ usernameExists: true });
          }
        })
      }
    } else {
      if (!this.supplierOtpValidationForm.get('userName')?.value) {
        console.log('sddd', this.supplierOtpValidationForm.get('userName')?.value);

        this.supplierOtpValidationForm.get('userName')?.setErrors({ required: true });
      } else {
        this.supplierOtpValidationForm.get('userName')?.setErrors(null);
      }
    }
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
      // confirmPassword: ['', [
      //   Validators.required,
      //   Validators.minLength(8),
      //   Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      // ]],
      confirmPassword: [null],
      //companyEmail: ['', [Validators.email]],
      companyEmail: ['', Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)],
      taxRegistration: ['', Validators.required],
      // contactDetails: this.fb.group({
      salutation: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      designation: ['', Validators.required],
      contactRoleId: ['', Validators.required],
      // status: ['success'],
      // supplierDto: ['supplier'],
      // emailId: ['', [Validators.required, Validators.email]],
      emailId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      mobileCountryId: ['', Validators.required],
      mobileCode: [''],
      mobileNumber: ['', Validators.required],
      landlineNumber: [''],
      landlineCode: [''],
      landlineCountryId: [null],
      status: ['Draft']
      // })
    });
    this.supplierOtpValidationForm = this.fb.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
      confirmpasswordMatchValidator()]),
      confirmPassword: new FormControl('', [Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
      passwordMatchValidator()]),
    })
  }




  onSubmit() {

    if (this.supplierForm.valid && this.supplierOtpValidationForm.valid) {
      if (this.supplierForm.value.supplierClassificationId === 0 || this.supplierForm.value.salutationId === 0 || this.supplierForm.value.contactRoleId === 0 || this.supplierForm.value.mobileCountryId === 0) {
        this.adminService.showMessage('Please enter dropdown fields');
        this.supplierForm.markAllAsTouched();
        return;
      }
      this.supplierForm.patchValue({
        userName: this.supplierOtpValidationForm.get('userName')?.value,
        password: this.supplierOtpValidationForm.get('password')?.value,
        confirmPassword: this.supplierOtpValidationForm.get('confirmPassword')?.value,
      })
      const registrationData = this.supplierForm.value;
      registrationData.userType = 2;

      this.loginService.saveSupplierRegistration(registrationData).subscribe((result: any) => {
        if (result.success) {
          this.adminService.showMessage('Supplier Account created Successfully');

          const registorToken = {
            "username": this.supplierForm.get('userName')?.value,
            "email": this.supplierForm.get('emailId')?.value,
            "password": this.supplierForm.get('password')?.value,
            "userType": JSON.stringify(this.supplierForm.get('contactRoleId')?.value),
            "isActive": true
          }
          this.loginService.registorToken(registorToken).subscribe((result: any) => {
            if (result) {
              localStorage.setItem('userId', result?.userId)
            }
          })
          this.supplierForm.reset();
          this.supplierOtpValidationForm.reset();
          this.dialogRef.close();
        }
        else {
          this.adminService.showMessage(result.message);
        }
      });
    }
    else {
      let obj = {
        userName: this.supplierOtpValidationForm.get('userName')?.value
      }
      this.loginService.checkUserNameExist(obj).subscribe((res) => {
        if (res?.success) {
          // this.adminService.showMessage('Filled all mandatory fields');
          this.supplierForm.markAllAsTouched();
          this.supplierOtpValidationForm.markAllAsTouched();
          this.isSubmitted = true;
        } else {
          this.adminService.showMessage(res.message)
          this.supplierOtpValidationForm.get('userName')?.setErrors({ usernameExists: true });
        }
      })
      // Mark all controls as touched to display errors
      return;
    }
  }

  onCancel(): void {
    const hasFilledFields = Object.entries(this.supplierForm.controls)
      .filter(([key]) => key !== 'status') // Exclude the 'status' field
      .some(([, control]) => control.value);;

    if (hasFilledFields) {
      this.openCancelDialog();
    } else {
      this.supplierForm.reset();
      this.supplierOtpValidationForm.markAllAsTouched();
      this.dialogRef.close();
    }
  }

  openCancelDialog(): void {
    const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: true,
      width: '35%',
      height: '40%',
      position: {
        top: 'calc(10vw + 20px)',
      },
      panelClass: 'confirmdialog',
      data: {
        parentDialogRef: this.dialogRef,  // Passing the parent dialog reference
      },
    });

    // Handle dialog close result
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If user clicked "Yes", close both dialogs
        this.supplierForm.reset();
        this.supplierOtpValidationForm.markAllAsTouched();
        this.dialogRef.close();
      }
      // "No" is handled by simply closing the cancel dialog, no additional action needed
    });
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numeric keys (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  //OTP Generation Function
  otpgenerate() {
    let loginData: any = new SupplierLoginData();
    loginData.userId = loginData.userId || 0;
    loginData.toMailAddress = this.supplierForm.get('emailId')?.value;
    // let res = 1;
    this.loginService.getOTPforMFA(loginData).subscribe((res: number) => {
      if (res) {
        this.showMFA = true;
        this.adminService.showMessage('OTP has been send to your entered Email ID');
        // this.openMFAPopUp();        
        this.startCountdown();
      } else {
        this.adminService.showMessage('OTP has been not generated. Please contact Admin');
      }
    })
  }

  //start countdown
  startCountdown() {
    this.isResendDisabled = true;
    this.resendCountdown = 90;
    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  //Stop countdown
  stopCountdown() {
    this.isResendDisabled = false;
    clearInterval(this.countdownInterval);
  }

  ngDestroy() {
    this.stopCountdown();
  }

  submitMFA() {
    if (this.supplierOtpValidationForm.get('password')!.value && this.supplierOtpValidationForm.get('confirmPassword')!.value) {
      if (this.supplierOtpValidationForm.get('password')!.value !== this.supplierOtpValidationForm.get('confirmPassword')!.value) {
        this.adminService.showMessage("Password doesn't match!")
        return;
      }
    }
    if (environment.OtpKey === 0) {
      this.onSubmit();
    } else {
      if (this.mfaCode === "") {
        this.adminService.showMessage("Please enter OTP!");
        return;
      }
      // this.supplierForm.markAllAsTouched();
      let submitMFA: any = {
        otpCode: this.mfaCode,
        email: this.supplierForm.value.emailId
      };
      this.loginService.submitOTPforMFACreateUser(submitMFA).subscribe((res: any) => {
        if (res && res.userOTPVerificationId !== 0) {
          this.onSubmit();
        } else {
          this.adminService.showMessage('Invalid OTP');
        }
      })
    }
  }

  //Check Password match
  checkPasswordMatch() {
    if (this.supplierOtpValidationForm.get('password')!.value && this.supplierOtpValidationForm.get('confirmPassword')!.value) {
      if (this.supplierOtpValidationForm.get('password')!.value !== this.supplierOtpValidationForm.get('confirmPassword')!.value) {
        this.adminService.showMessage("Password doesn't match!")
        return;
      }
    }
  }


}
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control?.parent?.get('password')?.value;
    const confirmPassword = control?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  };
}

export function confirmpasswordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const confirmPassword = control?.parent?.get('confirmPassword')?.value;
    const password = control?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { confrmpasswordMismatch: true }
      : null;
  };
}

interface countryPhcode {
  countryId: number;
  countryName: string;
  landNumberCode: string;
  mobileCode: string;
  countryCode: string
}

export class SupplierLoginData {
  userId!: number;
  toMailAddress!: string;
}