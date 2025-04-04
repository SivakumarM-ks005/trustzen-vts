import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MultiFactorAuthenticationComponent } from '../multi-factor-authentication/multi-factor-authentication.component';
import { CommonService } from '../../core/services/common.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { MatIconButton, MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LoginService } from '../../core/services/login/login.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
    standalone: true,
    imports: [MatSuffix, MatIcon, MatIconModule, MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, NgIf, MatError, MatDialogActions, MatButtonModule, TranslatePipe, MatDialogModule]
                   
})
export class ResetPasswordComponent {  
  temporaryPassword: any;
  newPassword: any;
  confirmPassword: any;
  resetPswdForm!: FormGroup;
  userData: any;
  submitLoginData = new SupplierSubmitLoginData();
  readonly dialogRef = inject(MatDialogRef<ResetPasswordComponent>);
  readonly mfa = new FormControl('', [Validators.required]);  
  constructor(private fb: FormBuilder, private LoginService: LoginService, private commonService: CommonService,public adminService: AdminService,) {
    this.resetPswdForm = this.fb.group({
      temporaryPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],     
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
        passwordMatchValidator() // Add the custom validator
        
      ]],
    });
  }
  ngOnInit(): void {
    const storedData: any = localStorage.getItem('loginDetails');
    this.userData = JSON.parse(storedData);        
  }
  onSubmit(event: any) {
    // Mark all fields as touched to trigger validation messages
    this.resetPswdForm.markAllAsTouched();
    this.submitLoginData.userId = this.userData.userId;
    if (this.resetPswdForm.valid) {
      // Prepare the data for submission
      this.submitLoginData.newPassword = this.resetPswdForm.value.newPassword;
      this.submitLoginData.confirmPassword = this.resetPswdForm.value.confirmPassword;
      
  
      // Call the resetPassword service
      this.LoginService.resetPassword(this.submitLoginData).subscribe((res: any) => {
        if (res.success) {
          this.dialogRef.close();
          this.adminService.showMessage(res.message); // Success message
        } else {
          this.adminService.showMessage(res.message); // Error message
        }
      });
    } else {      
      this.adminService.showMessage('Please fill in all required fields correctly.');
    }
  }
  
  onCancel() {
    this.temporaryPassword = ''; // Clear the input field
    this.newPassword = ''; // Clear the input field
    this.confirmPassword = ''; // Clear the input field
    this.dialogRef.close();
  }
}

export function passwordMatchValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control?.parent?.get('newPassword')?.value;
    const confirmPassword = control?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  };
}
export class SupplierSubmitLoginData {
  newPassword!: string;
  confirmPassword: string;
  userId!: Number;
}
