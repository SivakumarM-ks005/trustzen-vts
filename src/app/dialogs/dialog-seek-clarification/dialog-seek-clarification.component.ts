import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatLabel, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';

@Component({
    selector: 'app-dialog-seek-clarification',
    templateUrl: './dialog-seek-clarification.component.html',
    styleUrl: './dialog-seek-clarification.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatLabel, MatFormField, MatInput, MatDialogActions, MatButton]
})
export class DialogSeekClarificationComponent implements OnInit {

  seekClariForm: FormGroup;

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogSeekClarificationComponent>,
    private supplierAttact: SupplierAttachmentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.seekClariForm = this.fb.group({
      toEmail: [this.data?.supplier?.email],
      ccEmails: [''],
      subject: ['Request for Additional Information'],
      details: ['']
    })
  }

  ngOnInit(): void {

  }

  submit() {
    const data = {
      "clarificationID": parseInt(this.data?.supplierId),
      "toEmail": this.seekClariForm.get('toEmail')?.value,
      "subject": this.seekClariForm.get('subject')?.value,
      "ccEmails": this.seekClariForm.get('ccEmails')?.value,
      "supplierId": parseInt(this.data?.supplierId),
      "details": this.seekClariForm.get('details')?.value,
      "requestedBy": JSON.parse(localStorage.getItem('loginDetails')!).userName,
      "requestedById": JSON.parse(localStorage.getItem('loginDetails')!).userId,
      "requestedDate": new Date().toISOString(),
      "loggedIn": JSON.parse(localStorage.getItem('loginDetails')!).userId
    }

    this.supplierAttact.SaveSeekClarification(data).subscribe(res => {
      if (res?.success) {
        this.dialogRef.close(true);
      }
    })
  }

}
