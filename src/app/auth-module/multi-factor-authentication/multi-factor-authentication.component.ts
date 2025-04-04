import { Component, Inject, inject } from '@angular/core';
import { FormControl, Validators, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonService } from '../../core/services/common.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { SupplierLoginData } from '../../home-page/home-page.component';
import { AdminService } from '../../core/services/admin/admin.service';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { LoginService } from '../../core/services/login/login.service';

@Component({
    selector: 'app-multi-factor-authentication',
    templateUrl: './multi-factor-authentication.component.html',
    styleUrl: './multi-factor-authentication.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, MatFormField, MatLabel, MatInput, NgIf, MatError, MatButton, MatDialogActions]
})
export class MultiFactorAuthenticationComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  submitLoginData = new submitLoginData();
  mfaCode: string = '';

  readonly dialogRef = inject(MatDialogRef<MultiFactorAuthenticationComponent>);
  readonly mfa = new FormControl('', [Validators.required]);
  userId!: number;
  isResendDisabled: boolean = false;
  resendCountdown: number = 90; // Countdown in seconds
  countdownInterval: any;
  loginData = new SupplierLoginData();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { logInDetails: any },
    public loginService: LoginService,
    public commonService: CommonService,
    public route: Router,
    public adminService: AdminService
  ) { }

  ngOnInit() {
    this.startCountdown();
  }

  onCancelMfa() {
    this.mfaCode = ''; // Clear the input field
    this.dialogRef.close();
  }

  startCountdown() {
    this.isResendDisabled = true;
    this.resendCountdown = 120;
    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  stopCountdown() {
    this.isResendDisabled = false;
    clearInterval(this.countdownInterval);
  }

  resendOtp() {
    this.otpgenerate();
    this.startCountdown();
  }

  otpgenerate() {
    this.loginData = new SupplierLoginData();
    this.loginData.userId = this.data.logInDetails.userId;
    this.loginData.toMailAddress = this.data.logInDetails.emailId;
    this.loginService.getOTPforMFA(this.loginData).subscribe((res: number) => {
      if (res) {
        this.adminService.showMessage('OTP has been re-send to your registred Email ID');
      } else {
        this.adminService.showMessage('OTP has been not generated. Please contact Admin');
      }
    })
  }

  onSubmitMfa() { }

  submitMfa() {
    this.submitLoginData.otpCode = this.mfaCode;
    this.submitLoginData.userId = this.data.logInDetails.userId;
    this.loginService.submitOTPforMFA(this.submitLoginData).subscribe((res: any) => {
      if (res) {
        this.dialogRef.close();
        // this.adminService.showMessage('Multi factor authentication(MFA) verifed');
        if (res.userTypeId == this.commonService.supplierUserType) {
          // this.route.navigate(['/supplier']);
          this.dialogRef.close();
          if (res.supplierCompletedFlag === true) {
            this.route.navigate(['/dashboard'], { skipLocationChange: true, replaceUrl: true });
          }
          else {
            this.route.navigate(['/SupplierUserForm'], { skipLocationChange: true, replaceUrl: true });
          }

          this.dialogRef.close();
        } else if (res.userTypeId == this.commonService.adminUserType) {
          this.route.navigate(['/dashboard'], { skipLocationChange: true, replaceUrl: true });
        }
      } else {
        this.adminService.showMessage('Invalid OTP');
      }
    })
  }
  // end

}
export class submitLoginData {
  otpCode!: string;
  userId!: number;
}
