import { Component, Inject, inject } from '@angular/core';
import { FormControl, Validators, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonService } from '../../core/services/common.service';
import { Router } from '@angular/router';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatCheckboxModule, MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, MatFormField, MatLabel, MatInput, MatError, MatDialogActions, MatButton]
})
export class ForgotPasswordComponent {
  userNameormailId: string = '';
  readonly dialogRef = inject(MatDialogRef<ForgotPasswordComponent>);


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { logInDetails: any },
    public commonService: CommonService,
    public route: Router,
  ) { }

  ngOnInit() {
  }
  onCancel() {
    this.userNameormailId = ''; // Clear the input field
    this.dialogRef.close();
  }
}
