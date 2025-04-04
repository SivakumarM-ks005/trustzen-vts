import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { templateWorkflowDto } from '../../../core/models/contract-template.model';
import { ContractService } from '../../../core/services/contract-service';
import { CommonService } from '../../../core/services/common.service';
import { SupplierAttachmentService } from '../../../core/services/supplier-management/supplier-attachment.service';
import { AdminService } from '../../../core/services/admin/admin.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NgFor, TitleCasePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-dialog-initiate-approval',
  templateUrl: './dialog-initiate-approval.component.html',
  styleUrl: './dialog-initiate-approval.component.scss',
  standalone: true,
  imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatSelect, NgFor, MatOption, MatInput, MatPaginator, MatDialogActions, MatButton, TitleCasePipe, TranslatePipe]
})
export class DialogContractInitiateApprovalComponent implements OnInit {
  workFlowId: number = 0;
  assignedUserd: number = 0;
  users = new FormControl();
  selectedUsers: [] = [];
  usersList: any;
  supplier: any;
  initalApprovel: FormGroup;
  supplierId: any;
  roleList: never[];
  saveData: templateWorkflowDto = new templateWorkflowDto();
  constructor(private contractService: ContractService,
    private commonService: CommonService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogContractInitiateApprovalComponent>,
    public activateRouter: ActivatedRoute,
    private supplierAttact: SupplierAttachmentService,
    private adminService: AdminService
  ) {
    this.initalApprovel = this.fb.group({
      wfLevel: [''],
      wfRole: [''],
      participantType: [''],
      assignedUser: [''],
      comments: ['']
    })
  }
  ngOnInit(): void {
    this.getAllUser();
    this.getSupplier();
    this.getRole();
    if (this.assignedUserd > 0) {
      this.initalApprovel.get('assignedUser')?.setValue(this.assignedUserd);
      this.initalApprovel.get('assignedUser')?.disable();
    }
  }
  getRole() {
    this.roleList = [];
    this.commonService.getRole().subscribe((result: any) => {
      if (result) {
        this.roleList = result;
      }
    })
  }

  getAllUser() {
    this.supplierAttact.GetAllUserDetails().subscribe((res: any) => {
      if (res) {
        this.usersList = res.filter((data: { userType: number; }) => data.userType === 4);
        // this.usersList = res;
      }
    })
  }

  getSupplier() {
    this.commonService.getSupplier(this.data?.supplierId).subscribe({
      next: (data) => {
        this.supplier = data;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }
  submit() {
    if (this.initalApprovel.get('assignedUser')?.value > 0) {
      if (this.assignedUserd > 0 && !this.initalApprovel.get('comments')?.value) {
        this.adminService.showMessage('Please enter comments to update workflow.');
        return;
      }
      let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
      this.saveData = {
        "templateId": this.data?.templateId,
        "workflowHistory": [
          {
            "workflowId": this.workFlowId,
            "wfLevel": 1,
            "wfRole": this.supplier?.typeOfOwnershipId,
            "participantType": this.supplier?.typeOfOwnership,
            "assignedUserId": this.initalApprovel.get('assignedUser')?.value,
            "assignedUser": loggedUserDetails?.userName,
            "actionDate": new Date().toISOString(),
            "actionTaken": "Review In Progress",
            "comments": this.initalApprovel.get('comments')?.value,
            "estimatedDateOfCompletion": new Date().toISOString(),
            "createdUserId": loggedUserDetails?.userId,
          }
        ]
      }
      this.contractService.saveTemplateWorkFlow(this.saveData).subscribe(res => {
        if (res) {
          this.dialogRef.close(true);
        }
      });
    } else {
      this.adminService.showMessage('Please Select a User.');
    }
  }
}
