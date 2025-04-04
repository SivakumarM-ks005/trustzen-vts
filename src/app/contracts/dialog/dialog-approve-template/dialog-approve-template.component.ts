import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatePipe, NgFor } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { ContractTemplate } from '../../../models/contract-template.model';
import { CommonService } from '../../../core/services/common.service';
import { AdminService } from '../../../core/services/admin/admin.service';
import { ContractService } from '../../../services/contract-service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { SaveWorkFlow } from '../../../core/models/workflow.model';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-dialog-approve-template',
  standalone: true,
  templateUrl: './dialog-approve-template.component.html',
  styleUrl: './dialog-approve-template.component.scss',
  imports: [MatHint, MatFormField, MatLabel, MatInput, FormsModule, MatTooltip,
    ReactiveFormsModule, MatSelect, MatOption, MatButton,
    CdkTextareaAutosize, DatePipe, TranslatePipe, MatDialogContent, MatDialogActions
    , MatDialogTitle, MatError,MatIconButton, MatDialogClose, MatTooltip,]
})
export class DialogApproveTemplateComponent implements OnInit {
  templateData: ContractTemplate = new ContractTemplate();
  @ViewChild('templateApproveForm', { static: false }) templateApproveForm: NgForm;
  disableSave: boolean = false;
  userId: number = 0;
  workFlowStatusList: any[] = [];
  workflowComments: string;
  workFlowStatus: string;
  userComment: string;
  constructor(public commonService: CommonService,
    private adminService: AdminService,
    private contractService: ContractService,
    private dialogRef: MatDialogRef<DialogApproveTemplateComponent>,
  ) { }

  ngOnInit(): void {
    this.userComment = this.commonService.userComment;
    this.workFlowStatusList = [
      { statusId: 1, statusName: 'Request for Information' },
      { statusId: 2, statusName: 'Workflow Approved' },
      { statusId: 3, statusName: 'Rejected' }
    ]
  }

  approvalSubmit() {
    if (this.templateApproveForm.valid) {
      this.disableSave = true;
      let saveWf = new SaveWorkFlow();
      saveWf.workFlowId = this.commonService.wfSavedId;
      saveWf.primaryKeyId = this.commonService.wfPrimaryKeyId;
      saveWf.workFlowName = 'Template Management'
      saveWf.comments = this.workflowComments;
      saveWf.actionTaken = this.workFlowStatus;
      saveWf.userId = this.userId;
      this.commonService.updateWorkFlowStatus(saveWf).subscribe(res => {
        if (res) {
          this.adminService.showMessage('Workflow Template Management ' + this.workFlowStatus + ' successfully.');
          this.dialogRef.close(true);
          this.disableSave = false;
        }
      });
    } else {
      for (let i in this.templateApproveForm.controls) {
        this.templateApproveForm.controls[i].markAsTouched();
      };
      this.adminService.showMessage('Please fill in all mandatory fields before save!.');
    }
  }
}
