import { Component, inject, Inject, input, Input, OnInit, output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { NgFor, TitleCasePipe } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonService } from '../../core/services/common.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';
import { WfRelatedService } from '../../core/services/workflow/wf-related.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { ActivityScreenConstants, WorkFlowStatusForLevelWise } from '../../core/models/constants/work-flow.constant';
@Component({
    selector: 'app-dialog-initiate-approval',
    templateUrl: './dialog-initiate-approval.component.html',
    styleUrl: './dialog-initiate-approval.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose,MatCheckbox, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatSelect, NgFor, MatOption, MatInput, MatIcon, MatPaginator, MatDialogActions, MatButton, TitleCasePipe, TranslatePipe]
})
export class DialogInitiateApprovalComponent implements OnInit {
  users = new FormControl();

  // usersList = ['Rajesh', 'Mohan', 'Sivakumar', 'James'];
  selectedUsers: [] = [];
  usersList: any;
  initalApprovel: FormGroup;
  supplierId: any;

  //API Injection
  wfService = inject(WfRelatedService);
  adminService = inject(AdminService);

  getSupplierWfList: any;
  participantData: any;
  actionDepData: any;
  roleDataAll: any[]=[];
  roleData: any[]=[];
  rolesOptions: any[]=[];

  //get userDetails
  loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
  isInsideDialog = input<boolean>(false);
  SupDetails = input<{}>();
  screenId = input();
  submitCheck = output<boolean>();
  constructor(private supplierAttact: SupplierAttachmentService,
    private commonService: CommonService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogInitiateApprovalComponent>,
    public activateRouter: ActivatedRoute
  ) {
    this.initalApprovel = this.fb.group({
      supplierWF :  this.fb.array([]),
    })
  }

  //supplier WF
  get supplierWF(): FormArray {
    return this.initalApprovel.get('supplierWF') as FormArray;
  }

  ngOnInit(): void {
    if(this.isInsideDialog()){
      this.data.supplierDet = this.SupDetails();
      this.data.screenId = this.screenId();
    }
    this.getAllUser();
    // this.getSupplier();
    // this.getRole();
    this.getPermissionDropDownData();
  }
  
  getAllUser() {
    this.supplierAttact.GetAllUserDetails().subscribe((res: any) => {
      if (res) {
        this.usersList = res.filter((data: { userType: number; }) => data.userType === 4);
        this.usersList = res;
      }
    })
  }

  getSupplierWorkflowApproval(){
    this.wfService.getSupplierWorkflowApprovalApi(this.data?.screenId, this.loggedUserDetails?.initiatorRoleId,this.data?.supplierDet?.entityId).subscribe((res)=>{
      this.getSupplierWfList = res;
      res?.wfConfigRules[0]?.wfConfigRulePermission.forEach((element:any) => {
        this.createWFFormGroup(element);
      });
    })
  }

  submit() {
    if(this.supplierWF?.valid){
      if(this.supplierWF?.getRawValue()?.length > 0){
        //Check user is selected
        let checkUserNameSeleted= this.supplierWF?.getRawValue()?.some((e:any)=> !e.assignedToUserId);
        if(checkUserNameSeleted){
          this.adminService.showMessage("Please select user!");
          return;
        }
  
        //Check permission field is checked
        let permissionElement = this.supplierWF?.getRawValue()?.some((e:any)=> !e.checkedAll && !e.onlyApprove && !e.onlyReqInfo && !e.onlyReject);
        if(permissionElement){
          this.adminService.showMessage("At least select one permisson for each WF");
          return;
        }
  
        //check last row is selected all checkbox
        let lastElement = this.supplierWF?.getRawValue()[this.supplierWF?.getRawValue()?.length - 1];
        if(!lastElement?.checkedAll){
          this.adminService.showMessage("Select All the permission for the last WF Level");
          return;
        }
  
        //Remove userlist from formArray
        const finalReq = this.supplierWF.getRawValue().map(({ assignedUserList, ...r }) => r);
        //Order By and showWflevel
        finalReq.forEach((element, index) => {
          element.orderBy = index + 1;
        });
        if(finalReq.length > 0){
        for(let i =0; i < finalReq.length; i++){
          if(i === 0){
            finalReq[i].showWfLevel = true;
          }else{
            finalReq[i].showWfLevel = false;
          }
        }  
        }
        debugger
        if(this.data?.checkWFObject?.checkStausRFI){
          let obj = {
            supId : this.data?.supplierDet?.supplierId,
            screenName: this.data?.checkWFObject?.activity
          }
          this.wfService.clearWfStatus(obj).subscribe((res:any)=>{
            if(res){
              this.wfService.SaveSupplierWorkflowApprovalApi(finalReq).subscribe((res)=>{
                if (res) {
                  this.dialogRef.close(true);
                  if(this.isInsideDialog()){
                    this.submitCheck.emit(true)
                  }
                }
              })
            }
          })
        }else{
          this.wfService.SaveSupplierWorkflowApprovalApi(finalReq).subscribe((res)=>{
            if (res) {
              this.dialogRef.close(true);
              if(this.isInsideDialog()){
                this.submitCheck.emit(true)
              }
            }
          })
        }
  
        
      }
    }else{
      this.adminService.showMessage("Please fill all fields")
    }
  }

  //Set Supplier WF from Get API
  createWFFormGroup(data?: any): void {
    let checkDisable : boolean = false;
    if(data !== undefined){
      checkDisable = true;
    }
    const wfData=  this.fb.group({
      workflowTransId: [0],
      workflowConfigId: [data?.wfConfigRulesId || 0],

      ActivityType: [this.getSupplierWfList?.activityScreen || ""],
      keyValueId: this.data?.supplierDet?.supplierId,
      keyValue: this.data?.supplierDet?.supplierRefNo,
      screenName: [this.getSupplierWfList?.activityScreen || ""],
      wfLevel: [data?.levelId || 'L' + (this.supplierWF.length + 1)],
      wfRole: [{value : data?.workFlowRole || null, disabled: checkDisable}, Validators.required],
      participantType: [{value : data?.participationType || null, disabled : checkDisable}, Validators.required],
      assignedUserId: [this.loggedUserDetails?.userId],
      assignedToUserId: [""],
      actionTaken: [WorkFlowStatusForLevelWise.LEVELPENDING],
      comments: [''],
      checkedAll: [{value : (data?.onlyApprove && data?.onlyReqInfo && data?.onlyReject) || false, disabled : checkDisable}],
      onlyApprove: [{value : data?.onlyApprove ? true : false, disabled : checkDisable}],
      onlyReqInfo: [{value : data?.onlyReqInfo || false, disabled: checkDisable}],
      onlyReject: [{value : data?.onlyReject || false, disabled: checkDisable}],
      createdUserId: [this.loggedUserDetails?.userId],
      assignedUserList: [data === undefined ? [] : data?.wfUserList || []], //get List for wfUser

      // participationTypeId: [{value : data?.participationTypeId || null, disabled : checkDisable}, Validators.required],
      // workFlowRoleId: [{value : data?.workFlowRoleId || null, disabled: checkDisable}, Validators.required],
      // allChecked: [{value : (data?.onlyApprove && data?.onlyReqInfo && data?.onlyReject) || false, disabled : checkDisable}],
      // onlyApprove: [{value : data?.onlyApprove || false, disabled : checkDisable}],
      // onlyReqInfo: [{value : data?.onlyReqInfo || false, disabled: checkDisable}],
      // onlyReject: [{value : data?.onlyReject || false, disabled: checkDisable}],
      // timeNum: [data?.timeNum || null],
      // timeToComplete: [data?.timeToComplete || ''],
      // actionDependencyId: [data?.actionDependencyId || null],
      // // createdUserId: [this.userId]
      // assignedUserList: [data === undefined ? this.usersList : data?.wfUserList || []],
      // assignedUser: [data?.userList || []]
    });
    // if(data === undefined){
    //   wfData.value.assignedUserList = this.usersList;
    // }
    if (this.supplierWF?.length === 0) {
      this.supplierWF.push(wfData);
    } else {
      if (this.initalApprovel.valid) {
        this.supplierWF.push(wfData);
      } else {
        this.initalApprovel.markAllAsTouched();
        // this.adminService.showMessage('Please fill in all mandatory fields before add permission');
      }
    }
  }

  //get Participation type
  getPermissionDropDownData() {
    this.wfService.getWfPermissionDropDownData()
      .subscribe({
        next: res => {
          this.participantData = res.roleTypeData ? res.roleTypeData : [];
          this.roleDataAll = Object.assign([], res.rolesData ? res.rolesData : [])
          this.actionDepData = res.actionDependencyData ? res.actionDependencyData : [];
        }, error: (error: any) => this.adminService.showMessage(error),
        complete: () => {
          this.getSupplierWorkflowApproval();
          // if (this.isEditMode) {
          //   const rulesArray = this.taxForm.get('supplierWF') as FormArray;
          //   rulesArray.value.forEach((x: any, i: number) => {
          //     this.endDateValidate(i);
          //   });
          // }
        }
      });
  }

  endDateValidate(i: number) {
    const projectDetailsArray = this.initalApprovel.get('supplierWF') as FormArray;
    const group = projectDetailsArray.at(i) as FormGroup;
    const participantType = group.get('participantType')?.value;
    group.get('wfRole')?.setValue("");
    const getParticipantId = this.participantData.find((el:any)=> el.wfRoleType === participantType).wfRoleTypeId
    // if (!this.isEditMode) {
    //   group.get('workFlowRoleId')?.setValue(null);
    // }
    this.roleData = this.roleDataAll.filter((r:any) => r.roleTypeId === getParticipantId);
    this.rolesOptions[i] = this.roleDataAll.filter((r:any) => r.roleTypeId === getParticipantId);
  }
  checkAll(i: number) {
    const rulesArray = this.initalApprovel.get('supplierWF') as FormArray;
    const rule = rulesArray.at(i) as FormGroup;
    const checkedAll = rule.get('checkedAll')?.value;
    rule.get('onlyApprove')?.setValue(checkedAll);
    rule.get('onlyReqInfo')?.setValue(checkedAll);
    rule.get('onlyReject')?.setValue(checkedAll);
  }

  checkAllSelected(i: number) {
    const rulesArray = this.initalApprovel.get('supplierWF') as FormArray;
    const rule = rulesArray.at(i) as FormGroup;
    const onlyApprove = rule.get('onlyApprove')?.value;
    const onlyReqInfo = rule.get('onlyReqInfo')?.value;
    const onlyReject = rule.get('onlyReject')?.value;
    if (onlyApprove && onlyReqInfo && onlyReject) {
      rule.get('checkedAll')?.setValue(true);
    } else {
      rule.get('checkedAll')?.setValue(false);
    }
  }

  //delete level
  deleteLevel(i: number) {
    this.supplierWF.removeAt(i);
  }

  //move up
  moveUp(index:number){
    if (index > 0) {
      const tmp = this.supplierWF.controls[index - 1];

      //patch value for level ID
      tmp.patchValue({
        wfLevel : 'L'+ (index+1)
      })
      this.supplierWF.controls[index].patchValue({
        wfLevel : 'L'+ index
      })

      this.supplierWF.controls[index - 1] = this.supplierWF.controls[index];
      this.supplierWF.controls[index] = tmp;
    }
  }

  moveDown(index:number){
    if (index < this.supplierWF?.controls?.length) {
      const tmp = this.supplierWF.controls[index + 1];
      //patch value for level ID
      tmp.patchValue({
        wfLevel : 'L'+ (index+1)
      })
      this.supplierWF.controls[index].patchValue({
        wfLevel : 'L'+ (index+2)
      })
      this.supplierWF.controls[index + 1] = this.supplierWF.controls[index];
      this.supplierWF.controls[index] = tmp;
    }
  }

  callUserList(i:number){
    const formValueArr =  this.initalApprovel.get("supplierWF") as FormArray;
    const formGroup = formValueArr.at(i) as FormGroup;
    formGroup.get("assignedToUserId")?.setValue("")
    const roleName = formGroup.get("wfRole")?.value;
    const getID = this.roleDataAll.find((el:any)=> el.roleName === roleName).roleId;
    this.wfService.getWFRelatedUserApi(getID).subscribe((res)=>{
      if(res){
        formGroup.patchValue({
          assignedUserList: res
        })
      }
    })
  }

}
