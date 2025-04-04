import { Component, Inject, inject } from '@angular/core';
import { FormControl, Validators, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonService } from '../../core/services/common.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { LoginService } from '../../core/services/login/login.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    standalone: true,
    imports: [MatFormFieldModule, MatRadioModule, MatCheckboxModule, MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, MatFormField, MatLabel, MatInput, NgIf, MatError, MatDialogActions, MatButton]
})
export class ForgotPasswordComponent {

  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  submitforgotPassword: any;
  userNameormailId: string = '';

  readonly dialogRef = inject(MatDialogRef<ForgotPasswordComponent>);
  readonly mfa = new FormControl('', [Validators.required]);
  userId!: number;
  isResendDisabled: boolean = false;
  resendCountdown: number = 30; // Countdown in seconds
  countdownInterval: any;
  submitLoginData: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { logInDetails: any },
    public loginService: LoginService,
    public commonService: CommonService,
    public route: Router,
  ) { }

  ngOnInit() {
  }

  onCancel() {
    this.userNameormailId = ''; // Clear the input field
    this.dialogRef.close();
  }

  onSubmit(event: any) {
    this.submitLoginData = this.userNameormailId;


    this.loginService.forgotPassword(this.submitLoginData).subscribe((res: any) => {
      if (res) {
        this.dialogRef.close();
        this._snackBar.open('Temporary password has been sent to your registered email ID!', 'ok', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000,
        });
      }
    })
  }

  error(event: any){
    event.target.disabled = false;
  }

  // end
  

}
