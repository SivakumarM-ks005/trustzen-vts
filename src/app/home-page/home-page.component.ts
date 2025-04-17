import { Component} from '@angular/core';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatDialog, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { SupplierRegistrationComponent } from '../supplier-registration/supplier-registration.component';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../core/services/admin/admin.service';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../auth-module/forgot-password/forgot-password.component';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { LoginService } from '../core/services/login/login.service';
// import { LoginService } from '@app/login/service/login.service';
import { SupplierUserFormService } from '../core/services/supplier-management/supplier.user.form.service';
import { DateTimeService } from '../core/date-time/date-time.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  standalone: true,
  imports: [
    NgClass, MatFormField, MatLabel, MatToolbarModule, MatTooltip, MatSelect, MatOption, MatCheckbox,
    FormsModule, ReactiveFormsModule, MatInput, MatError, MatIcon, MatSuffix, NgIf, MatButton, MatDialogTitle,
    MatIconButton, MatDialogClose, CdkScrollable, MatDialogContent, NgFor, MatDialogActions, MatTabGroup, MatTab
  ]
})

export class HomePageComponent {

  SupplierlogInForm!: FormGroup;
  selectedLanguage = 'en';
  isRtl: boolean = false;
  submitLoginData = new SupplierSubmitLoginData();
  loginData = new SupplierLoginData();
  logInDetails: any;
  dialogRef: any;
  mfaCode: string = '';
  userId!: number;
  isResendDisabled: boolean = false;
  countdownInterval: any;
  showMFA: boolean = false;
  isPasswordVisible: boolean = false;  // Flag to control password visibility
  getImplementationConfigDataRes: any;

  isVisible: boolean = false;
  issupplierformVisible: boolean = false;

  constructor(private fb: FormBuilder,
    public loginService: LoginService,
    public dialog: MatDialog,
    public route: Router,
    public loginservice: LoginService,
    public admin: AdminService,
    public supplierUser: SupplierUserFormService,
    public adminService: AdminService,
    private dateTimeService: DateTimeService,
  ) {
    this.initSupplierForm();
    // this.getUser();
  }


  initSupplierForm() {
    this.SupplierlogInForm = this.fb.group({
      userName: ['', [Validators.required]],
      mfaCode: ['', []],
      passWord: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_-])[A-Za-z\\d@$!%*?&#_-]{8,}$')
        ],
      ],
    });
  }



  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  // login_custom() {
  //   this.loginservice.toggleLoginCustom();
  // }

  // login() {
  //   this.loginservice.toggleSupplierForm();
  // }

  login_custom() {
    this.route.navigate(["/krya/dashboard-menu"]);
    this.loginservice.toggleLoginMenu();

    // this.loginservice.toggleLoginCustom();
  }

  //     .supplier-top-header {
  //     display: none;
  // }
  // .supply-manage-top {
  //     display: none;
  // }
  login() {

    this.loginservice.toggleLoginCustomMenu();

    // this.loginservice.toggleSupplierForm();
    this.SupplierlogInForm.get('mfaCode')?.clearValidators();
    this.SupplierlogInForm.get('mfaCode')?.updateValueAndValidity();
    if (this.SupplierlogInForm.valid) {
      this.logInDetails = [];
      const logInInfo = this.SupplierlogInForm.value;
      this.loginService.logIn(logInInfo).subscribe((res: any) => {
        if (res.success == true) {
          localStorage.setItem('loginDetails', JSON.stringify(res));
          this.logInDetails = res;
          this.dateTimeService._format = 'dd:MM;YY'
          this.dateTimeService.setDateFormat();
          this.loginService.getScurity().subscribe((resData: any) => {
            if (!resData?.enableOTPFlag) {
              if (res?.userType === 1) {
                this.route.navigate(['/krya/dashboard-menu'], { queryParams: { ImplementConfig: JSON.stringify(this.getImplementationConfigDataRes) }, skipLocationChange: true, replaceUrl: true });
              }
              // else if (res.supplierCompletedFlag === true) {
              //   this.route.navigate(['/krya/dashboard'], { queryParams: { ImplementConfig: JSON.stringify(this.getImplementationConfigDataRes) }, skipLocationChange: true, replaceUrl: true })
              // }
              else if (res?.userType === 2) {
                this.route.navigate(['/SupplierUserForm'], { skipLocationChange: true, replaceUrl: true });
              } else if (res?.userType === 3) {
                this.route.navigate(['/trustzen']);
              }
            }
          })
        }
      })
    }
  }

  registrationPopUp() {
    this.dialog.open(SupplierRegistrationComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: true,
      width: "85%",
      height: "85%",
      position: { top: "calc(1vw + 20px)" },
      panelClass: "popUpMiddle"
    });

  }

  ForgotPasswordPopUp() {
    this.dialog.open(ForgotPasswordComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: true,
      width: "30%",
      height: "50%",
      position: { top: "calc(7vw + 50px)" },
      panelClass: "forgot-popup"
    });
  }

  onForgotPswdSubmit() {
    this.ForgotPasswordPopUp();
  }

}

export class SupplierLoginData {
  userId!: number;
  toMailAddress!: string;
}

export class SupplierSubmitLoginData {
  otpCode!: string;
  userId!: number;
}