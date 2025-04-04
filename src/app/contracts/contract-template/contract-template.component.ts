import { BootstrapOptions, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { DialogDeactivateTemplateComponent } from '../dialog/dialog-deactivate-template/dialog-deactivate-template.component';
import { DialogFreezeTemplateComponent } from '../dialog/dialog-freeze-template/dialog-freeze-template.component';
import { DialogAssignCategoryEntityComponent } from '../dialog/dialog-assign-category-entity/dialog-assign-category-entity.component';
import { AssignCategoryEntityComponent } from '../dialog/assign-category-entity/assign-category-entity.component';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatButton } from '@angular/material/button';
import { ContractTemplate, ContractTypeMas } from '../../core/models/contract-template.model';
import { ClauseClassificationMas } from '../../core/models/contract-clause.model';
import { ContractService } from '../../core/services/contract-service';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import moment from 'moment';
import { DialogContractInitiateApprovalComponent } from '../dialog/dialog-initiate-approval/dialog-initiate-approval.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { DatePipe, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { SaveWorkFlow } from '../../core/models/workflow.model';
import { DialogApproveTemplateComponent } from '../dialog/dialog-approve-template/dialog-approve-template.component';

@Component({
  selector: 'app-contract-template',
  templateUrl: './contract-template.component.html',
  styleUrl: './contract-template.component.scss',
  standalone: true,
  imports: [MatHint, MatFormField, MatLabel, MatInput, FormsModule, MatTooltip,
    ReactiveFormsModule, MatDatepickerInput, MatDatepickerToggle, MatSuffix,
    MatDatepicker, MatSelect, MatOption, MatAccordion, MatExpansionPanel,
    MatExpansionPanelHeader, MatExpansionPanelTitle, AngularEditorModule, MatButton,
    CdkTextareaAutosize, MatCheckbox, DatePipe, NgFor]
})
export class ContractTemplateComponent implements OnInit {
  @Input() dataValue: ContractTemplate = new ContractTemplate();
  @Input() templateData: ContractTemplate[] = new Array<ContractTemplate>();
  @Input() isEditMode: boolean = false;
  @Input() isApproverViewMode: boolean = false;
  @Input() isViewModeOnly: boolean = false;

  name = 'Angular 6';
  htmlContent = '';
  isDisabled: boolean = true;

  @Output() backEvent = new EventEmitter();
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '8rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  classificationData: ClauseClassificationMas[] = new Array<ClauseClassificationMas>();
  contractTypeData: ContractTypeMas[] = new Array<ContractTypeMas>();
  saveTemplateVm: ContractTemplate = new ContractTemplate();
  @ViewChild('contractTemplateForm', { static: false }) contractTemplateForm: NgForm;
  userId: number = 0;
  disableSave: boolean = false;
  supplierId: number = 0;
  workFlowHistory: any;
  // workflowComments: string;
  // workFlowStatus: string;
  // workFlowStatusList: any[] = [];
  staConditions: boolean = true;
  approvalExpand: boolean = false;

  constructor(public dialog: MatDialog,
    private contractService: ContractService,
    private adminService: AdminService,
    public commonService: CommonService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
    this.userId = loggedUserDetails.userId;
    this.supplierId = loggedUserDetails.supplierId;
    this.saveTemplateVm = this.dataValue;
    this.saveTemplateVm.createDate = this.saveTemplateVm.createDate ? new Date(this.saveTemplateVm.createDate) : null;
    this.saveTemplateVm.createDate = this.saveTemplateVm.amendDate ? new Date(this.saveTemplateVm.amendDate) : null;
    if (this.saveTemplateVm.status === 'Request for Information' && this.isEditMode) {
      this.staConditions = false;
      this.approvalExpand = true;
    }
    this.getDropDownData();
  }
  getDropDownData() {
    this.contractService.getTemplateDropDownList()
      .subscribe({
        next: res => {
          this.classificationData = res.classificationData;
          this.contractTypeData = res.contractTypeData;
        }, error: error => this.adminService.showMessage(error),
        complete: () => {
          if (this.saveTemplateVm.contractTemplateId > 0) {
            if (this.isApproverViewMode || this.isViewModeOnly) {
              this.config.editable = false;
              // this.workFlowStatusList = [
              //   { statusId: 1, statusName: 'Request for Information' },
              //   { statusId: 2, statusName: 'Workflow Approved' },
              //   { statusId: 3, statusName: 'Rejected' }
              // ]
            }
            this.getWFHistory();
          }
        }
      });
  }

  getWFHistory() {
    this.contractService.getTemplateWorkFlowHistory(this.saveTemplateVm.contractTemplateId, 0).subscribe({
      next: (data) => {
        this.workFlowHistory = data;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  deactivateTemplate() {
    const cancelDialogRef = this.dialog.open(DialogDeactivateTemplateComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '40%',
      height: '30%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contractService.deActivateClauseTemplate(this.saveTemplateVm.contractTemplateId).subscribe(res => {
          if (res) {
            this.adminService.showMessage(this.saveTemplateVm.templateId + ' DeActivated sucessfully');
            this.goToBack();
          }
        });
      } else {
        this.dialog.closeAll();
      }
    });
  }

  freezeTemplate() {
    const freezeTemp = this.dialog.open(DialogFreezeTemplateComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '40%',
      height: '30%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
    freezeTemp.afterClosed().subscribe(result => {
      if (result) {
        this.contractService.updateTemplateStatus(this.saveTemplateVm.contractTemplateId, 'Active').subscribe(res => {
          if (res) {
            this.adminService.showMessage(this.saveTemplateVm.templateId + '  Activated sucessfully.');
            this.goToBack();
          }
        });
      }
    });
  }
  assignCategory() {
    const initCategory = this.dialog.open(DialogAssignCategoryEntityComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
    initCategory.componentInstance.templateData = this.saveTemplateVm;
    initCategory.componentInstance.userId = this.userId;
    initCategory.afterClosed().subscribe(result => {
      if (result) {
        this.saveTemplateVm.isAssignCategory = true;
      }
    });
  }

  initiateWorkFlow() {
    if (!this.saveTemplateVm.isAssignCategory) {
      this.adminService.showMessage('Please Add Assign Category.');
      return;
    }
    if (!this.saveTemplateVm.isEntity) {
      this.adminService.showMessage('Please Add Assign Entity.');
      return;
    }
    const initWorkFlow = this.dialog.open(DialogContractInitiateApprovalComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        supplierId: this.supplierId,
        wfName: 'TemplateWorkFlow',
        templateId: this.saveTemplateVm.contractTemplateId
      },
      panelClass: 'popUpMiddle',
    });
    if (this.saveTemplateVm.status === 'Request for Information') {
      initWorkFlow.componentInstance.workFlowId = this.workFlowHistory[0].workflowId;
      initWorkFlow.componentInstance.assignedUserd = this.workFlowHistory[0].userId;
    }
    initWorkFlow.afterClosed().subscribe(result => {
      if (result) {
        this.contractService.updateTemplateStatus(this.saveTemplateVm.contractTemplateId, 'Review In Progress').subscribe(res => {
          if (res) {
            this.adminService.showMessage(this.saveTemplateVm.templateId + '  workflow initiated sucessfully');
            this.goToBack();
          }
        });
      }
    });
  }

  assignEntity() {
    const assignEntity = this.dialog.open(AssignCategoryEntityComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '75%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
    assignEntity.componentInstance.templateData = this.saveTemplateVm;
    assignEntity.componentInstance.userId = this.userId;
    assignEntity.afterClosed().subscribe(result => {
      if (result) {
        this.saveTemplateVm.isEntity = true;
      }
    });
  }

  goToBack() {
    this.backEvent.emit();
  }
  saveContratTemplate() {
    if (this.contractTemplateForm.valid) {
      this.disableSave = true;
      this.saveTemplateVm.version = this.saveTemplateVm.version.replace(/\s/g, '');
      let checkClassificationValid, checkVersion;
      if (this.isEditMode) {
        checkClassificationValid = this.templateData.filter(x => x.contractClassificationId === this.saveTemplateVm.contractClassificationId
          && x.contractTypeId === this.saveTemplateVm.contractTypeId && x.contractTemplateId !== this.saveTemplateVm.contractTemplateId);
        checkVersion = this.templateData.filter(x => x.version.toLowerCase()
          === this.saveTemplateVm.version.toLowerCase() && x.contractTemplateId !== this.saveTemplateVm.contractTemplateId);
      } else {
        checkClassificationValid = this.templateData.filter(x => x.contractClassificationId === this.saveTemplateVm.contractClassificationId
          && x.contractTypeId === this.saveTemplateVm.contractTypeId);
        checkVersion = this.templateData.filter(x => x.version.toLowerCase() === this.saveTemplateVm.version.toLowerCase());
      }

      if (checkClassificationValid.length > 0) {
        this.adminService.showMessage('Active Template with same Contract Type and Classification already exists.');
        this.disableSave = false;
        return;
      }
      if (checkVersion.length > 0) {
        this.adminService.showMessage('Version '+ this.saveTemplateVm.version +' already exists.');
        this.disableSave = false;
        return;
      }
      this.saveTemplateVm.userId = this.userId;
      if (!this.saveTemplateVm.status) {
        this.saveTemplateVm.status = 'Draft';
      }
      this.saveTemplateVm.createDate = this.saveTemplateVm.createDate ? moment(this.saveTemplateVm.createDate).format('YYYY-MM-DDThh:mm:ssZ') : null;
      this.saveTemplateVm.amendDate = this.saveTemplateVm.amendDate ? moment(this.saveTemplateVm.amendDate).format('YYYY-MM-DDThh:mm:ssZ') : null;
      this.contractService.saveClauseTemplate(this.saveTemplateVm).subscribe(res => {
        if (res) {
          this.adminService.showMessage('Data on the form has been successfully '
            + (this.saveTemplateVm.contractTemplateId > 0 ? 'updated.' : 'saved.'));
          this.disableSave = false;
          // this.goToBack();
          this.saveTemplateVm = res;
          this.isEditMode = true
        }
      });
    } else {
      for (let i in this.contractTemplateForm.controls) {
        this.contractTemplateForm.controls[i].markAsTouched();
      };
      this.adminService.showMessage('Please fill in all mandatory fields before save!.');
    }
  }
  approvalOpen() {
    const approvalTemplate = this.dialog.open(DialogApproveTemplateComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
    approvalTemplate.componentInstance.templateData = this.saveTemplateVm;
    approvalTemplate.componentInstance.userId = this.userId;
    approvalTemplate.afterClosed().subscribe(result => {
      if (result) {
        this.backToWorkFlow();
      }
    });
    // if (this.workFlowStatus) {
    //   let saveWf = new SaveWorkFlow();
    //   saveWf.workFlowId = this.commonService.wfSavedId;
    //   saveWf.primaryKeyId = this.commonService.wfPrimaryKeyId;
    //   saveWf.workFlowName = 'Template Management'
    //   saveWf.comments = this.workflowComments;
    //   saveWf.actionTaken = this.workFlowStatus;
    //   saveWf.userId = this.userId;
    //   this.commonService.updateWorkFlowStatus(saveWf).subscribe(res => {
    //     if (res) {
    //       this.adminService.showMessage('Workflow Template Management ' + this.workFlowStatus + ' successfully.');
    //       this.backToWorkFlow();
    //     }
    //   });
    // } else {
    //   this.adminService.showMessage('Please select a status');
    // }
  }
  backToWorkFlow() {
    this.router.navigate([`/krya/workFlowList`], { skipLocationChange: true, replaceUrl: true });
  }
}
