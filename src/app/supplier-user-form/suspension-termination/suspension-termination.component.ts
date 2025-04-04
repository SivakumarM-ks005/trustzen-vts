import { Component, ElementRef, inject, signal, viewChild, ViewChild } from '@angular/core';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';
import { CommonService } from '../../core/services/common.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin/admin.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { MatButtonModule } from '@angular/material/button';
import { DialogInitiateApprovalComponent } from '@app/dialogs/dialog-initiate-approval/dialog-initiate-approval.component';
import { MatDialog, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { WfRelatedService } from '@app/core/services/workflow/wf-related.service';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { DialogWfHistoryComponent } from '../dialog-wf-history/dialog-wf-history.component';
import { ActivityScreenConstants, WorkFlowScreenConstants, WorkFlowStatusConstants, WorkFlowStatusForLevelWise } from '@app/core/models/constants/work-flow.constant';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ICellRendererParams,ModuleRegistry, themeBalham } from 'ag-grid-community';
import { partition } from 'rxjs';
import { ConfirmationDialogComponent } from '@app/confirmation-dialog/confirmation-dialog.component';
import { BusinessRoleConstant } from '@app/core/models/constants/business-role.constant';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SuspensionTerminationService } from '@app/core/services/suspension&termination/suspension-termination.service';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-suspension-termination',
  templateUrl: './suspension-termination.component.html',
  styleUrl: './suspension-termination.component.scss',
  standalone: true,
  imports: [MatCheckbox, MatFormFieldModule, MatRadioModule, MatLabel,
    MatSelectModule, MatDatepickerModule, DatePipe, MatInputModule,
    ReactiveFormsModule, FormsModule, MatIconModule, CommonModule,
    MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions,
    MatButtonModule, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle,
    MatExpansionPanelDescription, AgGridAngular, MatAccordion, MatTooltipModule, DialogInitiateApprovalComponent]
})
export class SuspensionTerminationComponent {

  //Service injections
  supplierAttact = inject(SupplierAttachmentService);
  commonService = inject(CommonService);
  adminService = inject(AdminService);
  supplierManagementService = inject(SupplierUserFormService);
  wfService = inject(WfRelatedService);
  componentService = inject(SuspensionTerminationService);

  supplierId: any = this.commonService.SupplierId; //Get Supplier ID
  SupDetails: any; //Supplier details
  entitydata: any;
  assignEntity: FormGroup;
  selectedTerminationType : any;

  processData: FormGroup;

  startDate = new FormControl(new Date()); 
  todayDate = new Date(); //Today date

  // temporary data
  reasonList: any = [
    {value: "reason 1"},
    {value: "reason 2"},
    {value: "reason 3"},
    {value: "reason 4"},
  ]

  consequencesList = [
    {id: 1, value: "Block Supplier User (No Actions Allowed)", flag : false, disabled: false},
    {id: 2, value: "Access to Supplier Portal (limited access based on Allowed Actions)", flag : false, disabled : true},
    {id: 3, value: "Manage Profile", flag : false, disabled : true},
    {id: 4, value: "Physical Visit or Access to Buyer facilities (Only if is integrated into the Admin/Gate Pass System)", flag : false, disabled : true},
    {id: 5, value: "Inclusion in Sourcing Events", flag : false, disabled : true},
    {id: 6, value: "E-Commerce - Transactions", flag : false, disabled : true},
    {id: 7, value: "Contract Processing & Sig-off", flag : false, disabled : true},
    {id: 8, value: "Accept or Issue of New Purchase Orders", flag : false, disabled : true},
    {id: 9, value: "Supplier's Invoice Submission", flag : false, disabled : true},
    {id: 10, value: "Payment of Submitted Invoices", flag : false, disabled : true},
    {id: 11, value: "View Supplier Analytics", flag : false, disabled : true},
    {id: 12, value: "Supplier Performance Evaluation (By Buyer)", flag : false, disabled : true},
    {id: 13, value: "Buyer Performance Evaluation (By Supplier)", flag : false, disabled : true},
  ];

  divideConsequencesArray = Math.ceil(this.consequencesList.length / 2);
  arrayFirstHalf = this.consequencesList.slice(0, this.divideConsequencesArray);
  arraySecondHalf = this.consequencesList.slice(this.divideConsequencesArray, this.consequencesList.length);


  listOfFiles: File[] = [];
  listOfFilesRevoke: File[] = [];
  retrieveListOfFiles: any[] = [];
  @ViewChild('fileInput') fileInput: ElementRef;
  uploadDescription: string ="";
  disableAllOption : boolean = false;

  loginData = JSON.parse(localStorage.getItem('loginDetails')!);
  userName : string = this.loginData.userName;
  fullName : string = (this.loginData?.firstName || "")+" "+(this.loginData?.lastName || "");
  userId: number = this.loginData.userId;
  finalConsequenceList: any[]= [...this.arrayFirstHalf, ...this.arraySecondHalf];

  statusBasedDisable: boolean = false;
  SupplierManagement: any;
  readonly wfStatusPanel = signal(true);
  readonly wfDetailsPanel = signal(true);
  isOpen:boolean =true;
  //Ag grid data's for Workflow status
  public theme = themeBalham;
  workFlowRowData = [];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }

  workFlowStatuscolDefs: ColDef[] = [
    { field: "wfLevel", headerName: "WF Level", filter: false, floatingFilter: false },
    {
      field: "assignedToUser", headerName: "Approver Name",
      cellRenderer: (params: any) => params.value ? params.value : "N/A",
    },
    {
      field: "wfRole", headerName: "Approver Role",
      cellRenderer: (params: any) => params.value ? params.value : "N/A",
    },
    {
      field: "comments", headerName: "Approver Comments",
      cellRenderer: (params: any) => params.value ? params.value : "N/A",
    },
    {
      field: "EstDate", headerName: "Est. Complete Date",
      cellRenderer: (params: any) => params.value ? params.value : "N/A",
    },
    {
      field: "ActionDate", headerName: "Action Date",
      cellRenderer: (params: any) => params.value ? params.value : "N/A",
    },
    { field: "actionTaken", headerName: "Status" },
  ];
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector = [5, 10, 25];
  //Mat accordian related
  accordion = viewChild.required(MatAccordion);
  //Variables
  checkIfWFLevelAvialbale: any;
  WorkFlowStatusForLevelWise = WorkFlowStatusForLevelWise;
  wfDetailsComments = "";
  showReqInfoTabs : boolean = false;
  activityStatus: string;
  savedList: any[]=[];
  listOfFilesDesc: any = [];
  listOfFilesUploadedBy: any= [];
  listOfFilesToShown: any[] = [];
  isNotifyEnable : boolean = false; //disable
  isProcessWorkflowEnable : boolean = false; //disable
  isSaveEnable: boolean = true; //disable
  isRevokeNotifyEnable : boolean = false; //disable
  isRevokeProcessWorkflowEnable : boolean = false; //disable
  isRevokeSaveEnable: boolean = true; //disable

  // Revoke process
  revokeForm : FormGroup;
  submitResponse: any;
  checkBtnsEnable:boolean = true;
  listOfFilesRevokeToShown: any[] = [];
  allLevelApproved: boolean = false;
  getSusTermEntityListArray: any;
  omitEntityIds: any[];
  revokeListEntityId: number | null = null;
  suspensionHistoryId: number | null = null;
  @ViewChild('susTerProcessElem') susTerProcessElem !: ElementRef;
  updateFlag: boolean = false;
  updatedData: any;
  isShowRevokeProcessWF: boolean = false;
  checkStatusWhetherIsUpdatedStatus: boolean = false;
  revokedStoredData: any[]=[];
  revokedFilterResult: any;
  revokedHistoryId: any;
  getSelectedRevokeData: any;
  revokeWFFlag: boolean = false;
  checkStatusWhetherIsRevokeStatus: boolean = false;
  showWFDetailsPopup: boolean = false;
  PQAPRCheck: boolean = false;
  historyStatusAPICheckFlag: boolean = false; //check need to call update history API
  checkUpdateReqInfo: boolean = false;
  isRejectWFStatus: boolean= false;
  statusRFI: boolean = false;
  alreadyRevokedCalled: boolean = false;
  revokeWFRequestObject : any = {};
  callRevokeAPI: boolean = false;
  
  constructor(public fb: FormBuilder, public router: Router,public dialog: MatDialog,public activateRouter: ActivatedRoute,) {
    this.assignEntity = this.fb.group({
      assignAll: [false],
      entityArray: this.fb.array([])
    })

    this.processData = this.fb.group({
      supplierId: this.supplierId,
      supplierName: "",
      suspensionType : new FormControl("termination"),
      reason: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      actionStartDate: new FormControl(null, Validators.required),
      actionEndDate: new FormControl(null),
      Consequence : [],
      documents : [],
      entityId: "",
      entityName : "",
      status: ""
    })
    
    this.revokeForm = this.fb.group({
      revokeId: new FormControl(0),
      reason : new FormControl("", Validators.required),
      description : new FormControl("", Validators.required),
      effectiveDate : new FormControl("", Validators.required),
    })
  }
  @ViewChild('revokeEntity') revokeEntity: any;

  ngOnInit() {
    this.activateRouter?.params?.subscribe((response:any) => {
      this.supplierId = response.id;
    })
    if (this.loginData?.businessRole === BusinessRoleConstant.PQREPAPRROVER) {
      this.PQAPRCheck = true;
      this.checkBtnsEnable = false;
    }
    this.getSuspendedTerminatedEntities(); //Call Suspension and termination entity list
    this.getSupplierDetails(); //Call supplier details
    // this.assignEntitys(); //Call Assign entity API
    this.checkWFLevelAvailable(); //Check WF level available for this user
    this.getWFStatus(); //Get Workflow status
    this.getRevokeData(); //Call Revoke data
    this.processData.controls['suspensionType']?.valueChanges?.subscribe((value: string)=>{
      if(value === 'suspension'){
        this.processData.controls['actionEndDate'].setValidators([Validators.required]);
      }else{
        this.processData.patchValue({
          actionEndDate : null
        });
        this.processData.controls['actionEndDate'].clearValidators();
      }
      this.processData.controls['actionEndDate'].updateValueAndValidity();
    })
  }

  // supplier details API
  getSupplierDetails() {
    this.supplierAttact.getSupplierDetails(this.supplierId).subscribe(res => {
      if (res) {
        this.SupDetails = res;
      }
    })
  }

  // Assign entity API
  assignEntitys() {
    // this.wfService.getEntityList().subscribe({
    this.componentService.getStoredEntityListApi(this.supplierId).subscribe({
      next: (data) => {
        if(data?.length > 0){
          data.forEach((element:any, index:any) => {
            element.status = "Active";
          });
        }
        for (let i = data.length - 1; i >= 0; i--) {
          const obj = data[i];
          const isDuplicate = this.getSusTermEntityListArray?.length > 0 && this.getSusTermEntityListArray?.some((item:any) => item.historyRecord?.entityIds === obj?.entityId)
          if (isDuplicate) {
            data.splice(i, 1); // Remove the object at index i
          }
        }
        this.entitydata = data;
        this.getAlreadySuspensionDetails();
        // this.setEntity(this.entitydata);
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  getAlreadySuspensionDetails() {
    this.componentService.getlreadySuspensionDetailsAPI(this.supplierId).subscribe(res => {
      if (res?.data?.length > 0) {
        this.savedList = res?.data;
        // If there is no entity
        if (this.entitydata?.length > 0) {
          //Check if Entities are there in save
          if (res?.data[res?.data.length - 1]?.suspension?.entityId?.length > 0) {
            res?.data[res?.data.length - 1]?.suspension?.entityId.forEach((element: any) => {
              this.entitydata.filter((obj: any) => {
                if (obj.entityId === element) {
                  obj.susFlag = true;
                  obj.checked = true;
                  obj.retrivalData = {
                    suspension: res?.data[res?.data.length - 1].suspension,
                    documents: res?.data[res?.data.length - 1].documents,
                  };
                }
              });
            });
          } else {
            let obj = {
              retrivalData: {
                suspension: res?.data[res?.data.length - 1].suspension,
                documents: res?.data[res?.data.length - 1].documents,
              }
            }
            this.entitydata.push(obj)
          }
        } else {
          let obj = {
            retrivalData: {
              suspension: res?.data[res?.data.length - 1].suspension,
              documents: res?.data[res?.data.length - 1].documents,
            }
          }
          this.entitydata.push(obj)
        }
        this.isProcessWorkflowEnable = true;
        this.setEntity(this.entitydata);
        this.bindFields(res?.data[res?.data.length-1]);
      } else {
        this.setEntity(this.entitydata);
      }
    })
  }

  get entityArray(): FormArray {
    return this.assignEntity.get('entityArray') as FormArray;
  }

  //set as form array to handle checkbox
  setEntity(entitys: any) {
    const entityFormArray = this.assignEntity.get('entityArray') as FormArray;
    entityFormArray.clear();
    entitys.forEach((entity: any) => {
      const group = entityFormArray.push(this.fb.group({
        entityId: [entity?.entityId],
        supplierId: [this.supplierId],
        entityCode: [entity?.entityCode],
        entityName: [entity?.entityName],
        status: [entity?.status],
        reason: [entity?.reason],
        description: [entity?.description],
        entityAssign: [entity?.checked ? entity?.checked : false],
        entitySuspended : [entity?.susFlag ? entity?.susFlag : false],
        retrivalData : [entity?.retrivalData ? entity?.retrivalData : ""]
      }));
    })
    if(this.savedList?.length > 0){
      this.checkAndChangeStatus(this.workFlowRowData);
    }
    if (this.loginData?.businessRole === BusinessRoleConstant.PQREPAPRROVER) {
      const entityFormArray = this.assignEntity.get('entityArray') as FormArray;
      this.assignEntity.disable();
      this.processData.disable();
      entityFormArray.disable();
      this.statusBasedDisable = true;
      this.checkBtnsEnable = false;
      this.revokeForm.disable();
    }
    //NOTE - check if update status is Initiated, ReqInfo, or Approved in Suspended or terminated array
    let checkStatusForDisbaleFields = this.getSusTermEntityListArray?.some((v:any)=> 
      v.historyRecord.status === `Update ${WorkFlowStatusConstants.WFINITIATED}`||
      v.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFAPPROVED}` ||
      v.historyRecord.status === `Revoke ${WorkFlowStatusConstants.WFINITIATED}`||
      v.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFAPPROVED}`||
      v.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFREQINFO}`
    )
    if(checkStatusForDisbaleFields){
      const entityFormArray = this.assignEntity.get('entityArray') as FormArray;
      entityFormArray.disable();
      this.statusBasedDisable = true;
      this.assignEntity.get('assignAll')?.disable();
    }

    let checkStatusforDisableUpdateReqInfo = this.getSusTermEntityListArray?.some((v:any)=>
      v?.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFREQINFO}`
    )
    if(checkStatusforDisableUpdateReqInfo){
      this.checkUpdateReqInfo = true;
      const entityFormArray = this.assignEntity.get('entityArray') as FormArray;
      entityFormArray.disable();
      this.assignEntity.get('assignAll')?.disable();
    }
  }

  onIndividualAssignChange() {
    if(this.updateFlag){
      this.updateFlag = false;
      this.clearRetriveData();
    }
    // Check if all individual checkboxes are checked
    const allChecked = this.entityArray.controls.every(
      (group) => group.get('entityAssign')?.value === true
    );

    // Update the "Assign All" checkbox
    this.assignEntity.get('assignAll')?.setValue(allChecked);
  }

  toggleAssignAll(ischecked: any) {
    this.entityArray.controls.forEach((group) => {
      group.get('entityAssign')?.setValue(ischecked?.checked);
    });
  }

  onIndividualConsequenceChange(event: any, value: any, arraySet: string) {
    if (event.checked && value.id === 1) {
        for(var i=0; i< this.arrayFirstHalf.length; i++){
          if(this.arrayFirstHalf[i].id !== 1){
            this.arrayFirstHalf[i].flag = false;
          }
        }
        for(var i=0; i< this.arraySecondHalf.length; i++){
          this.arraySecondHalf[i].flag = false;
        }
      this.disableAllOption = true;
    }else{
      this.disableAllOption = false;
    }
    this.finalConsequenceList = [...this.arrayFirstHalf, ...this.arraySecondHalf];
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length) {
      if (event.target.files.length > 0) {
          if (
          this.listOfFiles.find(obj => obj.name === files[0].name)) {
          this.adminService.showMessage('This File Already Exist.');
          this.fileInput.nativeElement.value = null;
          return;
        }
        // this.listOfFiles.push(event.target.files);
        this.listOfFilesDesc.push(this.uploadDescription);
        this.listOfFilesUploadedBy.push(this.fullName)
        // event.target.files[0].decription = this.uploadDescription;
        // event.target.files[0].uploadedBy = this.userName;
        // this.listOfFiles.push(Array.from(event.target.files));
        // this.listOfFiles.push(event.target.files);
        // this.uploadDescription = "";
      }
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        this.listOfFiles.push(event.target.files[i]);
        if (
          this.listOfFilesToShown?.find((obj:any) => obj.fileInfo.name === selectedFile.name)) {
          this.adminService.showMessage('This File Already Exist.');
          this.fileInput.nativeElement.value = null;
          return;
        }
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[i]); // read file as data url

        reader.onload = (event:any) => { // called once readAsDataURL is completed
          // fileDetail.fileInfo.base64Content = event.target.result;
          // fileDetail.base64Content = event.target.result;
          // console.log(this.url)
        }
        let fileDetail: any = {};
        fileDetail.fileInfo = selectedFile;
        // fileDetail.fileInfo.documentId = 0;
        // fileDetail.fileInfo.description = this.uploadDescription;
        // fileDetail.fileInfo.uploadedBy = this.userName;
        // fileDetail.fileInfo.supplierId = this.supplierId;
        fileDetail.description = this.uploadDescription;
        fileDetail.uploadedBy = this.fullName;
        // fileDetail.supplierId = this.supplierId;
        fileDetail.fileName = fileDetail?.fileInfo?.name
        this.listOfFilesToShown.push(fileDetail);
        this.uploadDescription = "";
      }
      // this.saveCategoryAndScopeVm.isFileChanged = true;
      this.fileInput.nativeElement.value = null;
      // this.toggleAttach();
    }

  }

  checkDescription(event:any){
    // Open file dialog
    if(!this.uploadDescription.trim()){
      this.adminService.showMessage('Please add description.');
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    // Do not open file dialog
    else{
      return true;
    }
  }

  removeFileFromList(index: number){
    this.listOfFiles.splice(index, 1);
    this.listOfFilesDesc.splice(index, 1);
    this.listOfFilesUploadedBy.splice(index, 1);
    this.listOfFilesToShown.splice(index, 1);
  }

  cancelBtn(){

  }

   saveBtn() {
     if (this.updateFlag) {
      let consequencesArray: any = [];
      this.finalConsequenceList.filter((data: any) => {
        if (data?.flag === true) {
          consequencesArray.push(data?.value)
        }
      })

      let obj = {
        suspensionType: this.processData.get('suspensionType')?.value,
        reason: this.processData.get('reason')?.value,
        description: this.processData.get('description')?.value,
        actionStartDate: this.startDate.value ? moment(this.startDate.value).format('YYYY-MM-DDThh:mm:ssZ') : null,
        actionEndDate: this.processData.get('actionEndDate')?.value ? moment(this.processData.get('actionEndDate')?.value).format('YYYY-MM-DDThh:mm:ssZ') : null,
        consequence: consequencesArray,
        status: "Update In-Progress",
      }
      console.log(obj)
      this.componentService.updateSusTer(obj, this.updatedData?.historyRecord?.suspensionHistoryId).subscribe((res:any)=>{
        if(res.success){
          if(this.listOfFiles?.length > 0){
            const formData = new FormData();
            formData.append('SupplierId', this.supplierId);
            formData.append('SuspensionHistoryId', this.updatedData?.historyRecord?.suspensionHistoryId);
            formData.append("EntityId", this.updatedData?.historyRecord?.entityIds);
            this.listOfFilesDesc.forEach((item: any) => formData.append("Descriptions", item));
            this.listOfFilesUploadedBy.forEach((item: any) => formData.append("UploadedBy", item));
            if (this.listOfFiles.length > 0) {
              this.listOfFiles.forEach((file) => {
                formData.append('Files', file)
              });
            };
            console.log(formData.get('Files'))
            this.componentService.updateSusTerAttachments(formData).subscribe((data: any) => {
              if (data?.success) {
                this.adminService.showMessage('Your request is updated successfully.');
                this.isProcessWorkflowEnable = true;
                this.submitResponse = res.data;
                // this.getAlreadySuspensionDetails();
                this.getSuspendedTerminatedEntities();
              }
            }, error => {
              this.adminService.showMessage("Upload Failed!")
            })
          }else{
            this.adminService.showMessage("Data updated successful!")
            this.getSuspendedTerminatedEntities();
            this.isProcessWorkflowEnable = true;
          }
        }
      })
     } else {
       // let entityId: string = "";
       // let entityName: string = "";
       let entityIDarray: any = [];
       let entityNamearray: any = [];
       let consequencesArray: any = [];
       let documentDescription: any = [];
       let documentUploadedBy: any = [];

       this.assignEntity?.get('entityArray')?.value
         .filter((group: any) => {
           if (group.entityAssign === true) {
             entityIDarray.push(group?.entityId);
             entityNamearray.push(group?.entityName);
             // entityId = entityIDarray.toString();
             // entityName = entityNamearray.toString();
           }
         })


       this.finalConsequenceList.filter((data: any) => {
         if (data?.flag === true) {
           consequencesArray.push(data?.value)
         }
       })


      //  if (this.listOfFiles?.length === 0 && this.retrieveListOfFiles?.length === 0) {
      //   this.adminService.showMessage('Please select files.');
      //    return;
      //  }

       // if(consequencesArray?.length === 0){
       //   this.adminService.showMessage('Please select Consequences - Stop Allowing.');
       //   return;
       // }

       //Check entity fields are selected
       if (entityIDarray?.length === 0) {
         this.adminService.showMessage('Please select entity.');
         return;
       }

       // this.listOfFiles.forEach(function(obj) {
       //   delete obj.theId;
       // });

       this.processData?.patchValue({
         supplierName: this.SupDetails?.supplierName,
         actionEndDate: this.processData.get('actionEndDate')?.value ? moment(this.processData.get('actionEndDate')?.value).format('YYYY-MM-DDThh:mm:ssZ') : null,
         actionStartDate: this.startDate.value ? moment(this.startDate.value).format('YYYY-MM-DDThh:mm:ssZ') : "",
         Consequence: consequencesArray ? consequencesArray : [],
         documents: this.listOfFiles,
         entityId: entityIDarray || [],
         entityName: entityNamearray || [],
         status: this.processData.get('suspensionType')?.value === "suspension" ? "Suspended" : "Terminated"
       });

       //Check trermination process fields are valid
       // if (!this.processData?.valid || consequencesArray?.length === 0) {
       //   this.adminService.showMessage('Please select termination process.');
       //   return;
       // }

       console.log(this.processData.value)
       this.processData.markAllAsTouched();
       if(!this.processData.valid){
        this.adminService.showMessage('Please fill all mandatory fields.');
        return;
       }
       this.componentService.supplierSuspensionSave(this.processData.value).subscribe((res: any) => {
         // console.log(res)
         //check API success
         if(this.listOfFiles?.length > 0){
           if (res?.success) {
             const formData = new FormData();
             formData.append('SupplierId', this.supplierId);
             formData.append('SuspensionId', res?.saveId);
             entityIDarray.forEach((item: any) => {
               const numericValue = Number(item);
               formData.append("EntityIds", numericValue.toString())
             });
             this.listOfFilesDesc.forEach((item: any) => formData.append("Descriptions", item));
             this.listOfFilesUploadedBy.forEach((item: any) => formData.append("UploadedBy", item));
             // formData.append('Descriptions', this.listOfFilesDesc);
             // formData.append('UploadedBy', this.listOfFilesUploadedBy);
             if (this.listOfFiles.length > 0) {
               this.listOfFiles.forEach((file) => {
                 formData.append('Files', file)
               });
             };
             console.log(formData.get('Files'))
             this.componentService.saveSusTerAttachments(formData).subscribe((data: any) => {
               if (data?.success) {
                 this.adminService.showMessage('Your request is saved successfully.');
                 this.isProcessWorkflowEnable = true;
                 this.submitResponse = res.data;
                 // this.getAlreadySuspensionDetails();
               }
             }, error => {
               this.adminService.showMessage("Upload Failed!")
             })
             // this.router.navigate(['/krya/PQAssesmentList'], { skipLocationChange: true, replaceUrl: true });
           } else {
             this.adminService.showMessage('You request is failed!.');
           }
         }else{
          this.adminService.showMessage('Your request is saved successfully.');
          this.isProcessWorkflowEnable = true;
          this.submitResponse = res.data;
         }
       }, error => {
         this.adminService.showMessage('You request is failed!.');
       })
     }
    
  }

  pqAssesmentList(){
    this.router.navigate(['/krya/PQAssesmentList'], { skipLocationChange: true,  replaceUrl: true })
  }

  bindFields(data:any){
    // this.retrieveData = true;
    this.retrieveListOfFiles = [];
    this.listOfFiles = [];
    this.listOfFilesToShown = [];
    this.finalConsequenceList.filter((data: any) => {
      data.flag = false
    });
    // this.processData.disable();
    debugger
    this.processData?.patchValue({
      supplierName: this.SupDetails?.supplierName,
      actionEndDate: data?.suspension?.actionEndDate ? moment(data?.suspension?.actionEndDate).format('YYYY-MM-DDThh:mm:ssZ') : "",
      actionStartDate: data?.suspension?.actionStartDate ? moment(data?.suspension?.actionStartDate).format('YYYY-MM-DDThh:mm:ssZ') : "",
      suspensionType : data?.suspension?.suspensionType,
      reason: data?.suspension?.reason,
      description: data?.suspension?.description,
      // Consequence: consequencesArray ? consequencesArray : [],
      documents: data?.documents,
    });
    
    this.retrieveListOfFiles = data?.documents;
    const consArray = typeof(data?.suspension?.consequence) ==='string' ? JSON.parse(data?.suspension?.consequence) : data?.suspension?.consequence;
    consArray?.forEach((element:any) => {
      // let firstFlag = this.arrayFirstHalf.some((obj)=>obj.value===element)
      // let secondFlag = this.arraySecondHalf.some((obj)=>obj.value===element)
      this.arrayFirstHalf.filter((data: any) => {
        if (data?.value === element) {
          data.flag = true
        }
      })
      this.arraySecondHalf.filter((data: any) => {
        if (data?.value === element) {
          data.flag = true
        }
      })
    });
    this.finalConsequenceList
  }

  clearRetriveData(){
    // this.retrieveData = false;
    this.retrieveListOfFiles = [];
    this.processData.enable();
    this.arrayFirstHalf.filter((data) => data.flag = false)
    this.arraySecondHalf.filter((data) =>data.flag = false)
    this.processData.patchValue({
      suspensionType: "termination",
      reason: "",
      description: "",
      actionStartDate: new FormControl(null, Validators.required),
      actionEndDate: new FormControl(null),
      Consequence : [],
      documents : [],
      entityId: "",
      entityName : ""
    })
    this.assignEntity.get('assignAll')?.enable();
  }

  downloadFile(data:any){
    const src = data?.base64Content;
    const link = document.createElement("a")
    link.href = src
    link.download = data?.fileInfo?.name
    link.click()

    link.remove()

  }

  processWorkflow() {
    const closedialog = this.dialog.open(DialogInitiateApprovalComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        supplierDet: this.SupDetails,
        screenId: 2,
        checkWFObject: {
          clearFlag : this.statusRFI || false,
          activity : ActivityScreenConstants.SupplierTerminationActivity
        }
      },
      panelClass: 'popUpMiddle',
    });
    closedialog.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.historyStatusAPICheckFlag = true;
        this.getWFStatus();
      }
    })

  }

  GetSupplierManagement() {
    this.supplierManagementService.GetSupplierManagement().subscribe(res => {
      if (res) {
        this.SupplierManagement = res;
      }
    })
  }

  checkWFLevelAvailable(){
    this.wfService.getWorkflowApi(this.userId).subscribe({
      next: (data) => {
        this.checkIfWFLevelAvialbale = data;debugger
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  getWFStatus(revokeFlag :boolean = false) {
    debugger
    // let id = revokeFlag ? this.revokeWFRequestObject?.supplierId : this.supplierId;
    let screenName = revokeFlag ? WorkFlowScreenConstants.SUPPLIERREVOKE : WorkFlowScreenConstants.SUPPLIERTERSUS;
    this.wfService.getSupplierWorkflowStatusApi(this.supplierId, screenName).subscribe({
      next: (data: any) => {
        // this.workFlowHistory = data;
        this.workFlowRowData = data;
        this.checkAndChangeStatus(data);
      },
      error: (err: any) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  //check WF status for status change in assign entity
  checkAndChangeStatus(data:any){
    this.allLevelApproved = false;
    this.statusRFI = false;
    const entityFormArray = this.assignEntity.get('entityArray') as FormArray;
    //Check pending status 
    const pendingStatus = data?.length > 0 ? data.some((d:any)=> d.actionTaken === WorkFlowStatusForLevelWise.LEVELPENDING) : false;
    //Check All approved
    const allApprovedStatus = data?.length > 0 ? data.every((a:any)=> a.actionTaken === WorkFlowStatusForLevelWise.LEVELAPPROVED) : false;
    //Check Request for information
    const reqInfoStatus = data.some((r:any)=> r.actionTaken === WorkFlowStatusForLevelWise.LEVELREQFORINFO);
    //Check Rejected
    const rejectedStatus = data.some((r:any)=> r.actionTaken === WorkFlowStatusForLevelWise.LEVELREJECTED);
    //Get suspension type value
    let suspensionType = this.savedList.length > 0 ? this.savedList[this.savedList.length -1]?.suspension?.suspensionType : this.submitResponse?.suspensionType;

    let dataObjForStatus = {
      suspensionHistoryId: 0,
      status : ""
    }
    let statusType = this.revokeWFFlag ? 'Revoke' : 'Update';
    if(pendingStatus){
      this.processData.disable();
      this.statusBasedDisable = true;
      let activityStatus = `${suspensionType === "suspension" ? "Suspension" : "Termination"} ${WorkFlowStatusConstants.WFINITIATED}`;
      entityFormArray.disable();
      this.assignEntity.get('assignAll')?.disable();
      entityFormArray.controls.forEach((v:any)=>{
        if(v.get('entityAssign').value){
          v.get('status').setValue(activityStatus);
        }
      });
      this.isSaveEnable = false;
      this.isNotifyEnable = false;
      this.isProcessWorkflowEnable = false;
      if(this.revokeWFFlag || this.checkStatusWhetherIsRevokeStatus){
        this.isRevokeNotifyEnable = false;
        this.isRevokeProcessWorkflowEnable = false;
        this.isRevokeSaveEnable = false;
      }
      dataObjForStatus = {
        suspensionHistoryId : this.updatedData?.historyRecord?.suspensionHistoryId,
        status: `${statusType} ${WorkFlowStatusConstants.WFINITIATED}`
      }
    }
    else if(allApprovedStatus){
      this.allLevelApproved = true;
      this.processData.disable();
      this.statusBasedDisable = true;
      let activityStatus = `${suspensionType === "suspension" ? "Suspension" : "Termination"} ${WorkFlowStatusConstants.WFAPPROVED}`;
      entityFormArray.disable();
      entityFormArray.controls.forEach((v:any)=>{
        if(v.get('entityAssign').value){
          v.get('status').setValue(activityStatus);
        }
      })
      this.assignEntity.get('assignAll')?.disable();
      this.isSaveEnable = false;
      this.isNotifyEnable = true;
      this.isProcessWorkflowEnable = false;
      if(this.revokeWFFlag || this.checkStatusWhetherIsRevokeStatus){
        this.isRevokeNotifyEnable = true;
        this.isRevokeProcessWorkflowEnable = false;
        this.isRevokeSaveEnable = false;
      }
      dataObjForStatus = {
        suspensionHistoryId : this.updatedData?.historyRecord?.suspensionHistoryId,
        status: `${statusType} ${WorkFlowStatusConstants.WFAPPROVED}`
      }
    }
    else if(reqInfoStatus){
      let activityStatus = `${suspensionType === "suspension" ? "Suspension" : "Termination"} ${WorkFlowStatusConstants.WFREQINFO}`;
      entityFormArray.disable();
      this.assignEntity.get('assignAll')?.disable();
      entityFormArray.controls.forEach((v:any)=>{
        if(v.get('entityAssign').value){
          v.get('status').setValue(activityStatus);
        }
      });
      this.isSaveEnable = true;
      this.isNotifyEnable = false;
      this.isProcessWorkflowEnable = true;
      this.statusRFI = true;
      if(this.revokeWFFlag || this.checkStatusWhetherIsRevokeStatus){
        this.isRevokeNotifyEnable = false;
        this.isRevokeProcessWorkflowEnable = true;
        this.isRevokeSaveEnable = true;
      }
      dataObjForStatus = {
        suspensionHistoryId : this.updatedData?.historyRecord?.suspensionHistoryId,
        status: `${statusType} ${WorkFlowStatusConstants.WFREQINFO}`
      }
    }
    else{
      if((this.updateFlag || this.checkStatusWhetherIsUpdatedStatus || this.checkStatusWhetherIsRevokeStatus || this.revokeWFFlag)){
        dataObjForStatus = {
          suspensionHistoryId : this.updatedData?.historyRecord?.suspensionHistoryId,
          status: this.updatedData?.historyRecord?.suspensionType === "suspension" ? "Suspended" : "Terminated"
        }
        this.processData.reset();
        this.clearRetriveData();
        this.clearForms();
      }else{
        if(this.isRejectWFStatus){ //REVIEW - Checking condition
          this.isRejectWFStatus = false;
          this.componentService.removeSusTerData(this.supplierId).subscribe((res:any)=>{
            if(res?.success){
              // this.getAlreadySuspensionDetails();
              this.processData.reset();
              this.arrayFirstHalf.filter((data) => data.flag = false)
              this.arraySecondHalf.filter((data) =>data.flag = false)
              let activityStatus = `Active`;
              entityFormArray.controls.forEach((v:any)=>{
                if(v.get('entityAssign').value){
                  v.get('status').setValue(activityStatus);
                  v.get('entityAssign').setValue(false);
                }
              });
              this.retrieveListOfFiles = [];
            }
          }, error=>{
    
          })
        }
        // alert("Check clear Remove data")
      }
    }
    debugger
    if((this.updateFlag || this.checkStatusWhetherIsUpdatedStatus || this.checkStatusWhetherIsRevokeStatus || this.revokeWFFlag) && this.historyStatusAPICheckFlag)this.historyStatusAPICheckFlag = false,this.updateStatusForHistory(dataObjForStatus);
  } 

  wfHistory() {
    this.dialog.open(DialogWfHistoryComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '90%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
      data: {
        supplierDet: this.SupDetails,
        screenName: this.revokeWFFlag ? WorkFlowScreenConstants.SUPPLIERREVOKE : WorkFlowScreenConstants.SUPPLIERTERSUS
      },
    });
  }

  //Update work flow details
  updateWFStatus(action: any, wfDet: any, rejectedAction?: boolean, revokeCheck?:boolean) {
    this.isRejectWFStatus = false;
    if (action !== WorkFlowStatusForLevelWise.LEVELAPPROVED && this.wfDetailsComments === "") {
      this.adminService.showMessage("Please give comments");
      return;
    }
    let objData = {
      "workflowTransId": wfDet?.workflowTransId || 0,
      "actionTaken": action,
      "comments": this.wfDetailsComments ? this.wfDetailsComments : "",
      "createdUserId": wfDet?.assignedUserId || 0
    }
    this.wfService.updateWorkFlowDetails(objData).subscribe((res) => {
      if (res) {
        if(action === WorkFlowStatusForLevelWise.LEVELREJECTED){
          this.isRejectWFStatus = true;
          if(rejectedAction){
            debugger
            this.revokedFilterResult[0]?.revokeId
            this.componentService.deleteRevokeData(this.revokedFilterResult[0]?.revokeId).subscribe((res:any)=>{
              if(res){

              }
            })
          }
        }
        // let elmObj = {
        //   supId: this.supplierId,
        //   status: action === WorkFlowStatusForLevelWise.LEVELREJECTED ? WorkFlowStatusConstants.WFREJECTED : WorkFlowStatusConstants.WFREQINFO,
        //   userId: this.userId
        // }
        // if (action === WorkFlowStatusForLevelWise.LEVELAPPROVED) {
          this.adminService.showMessage(`WorkFlow ${action} successfully`);
          this.historyStatusAPICheckFlag = true;
          this.getWFStatus(revokeCheck);
          this.checkWFLevelAvailable();
        // }
      }
    })
  }

  // WF details reject verify popup
  rejectVerifyPopup(wfHistory: any, rejectedAction?: boolean) {
    const closedialog = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '35%',
      height: '40%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
      data: {
        rejectFlag: true
      },
    });
    closedialog.afterClosed().subscribe(result => {
      if (result) {
        this.updateWFStatus(WorkFlowStatusForLevelWise.LEVELREJECTED, wfHistory, rejectedAction,true);
      }
    })
  }

  // Revoke Document upload
  onRevokeFileChange(event: any) {
    const files = event.target.files;
    if (files.length) {
      if (event.target.files.length > 0) {
          if (
          this.listOfFilesRevoke.find(obj => obj.name === files[0].name)) {
          this.adminService.showMessage('This File Already Exist.');
          this.fileInput.nativeElement.value = null;
          return;
        }
        // this.listOfFilesDesc.push(this.uploadDescription);
        // this.listOfFilesUploadedBy.push(this.userName)
      }
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        this.listOfFilesRevoke.push(event.target.files[i]);
        if (
          this.listOfFilesRevokeToShown?.find((obj:any) => obj.fileInfo.name === selectedFile.name)) {
          this.adminService.showMessage('This File Already Exist.');
          this.fileInput.nativeElement.value = null;
          return;
        }
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[i]); // read file as data url

        reader.onload = (event:any) => { // called once readAsDataURL is completed
          // fileDetail.fileInfo.base64Content = event.target.result;
          // fileDetail.base64Content = event.target.result;
          // console.log(this.url)
        }
        let fileDetail: any = {};
        fileDetail.fileInfo = selectedFile;
        fileDetail.description = this.uploadDescription;
        fileDetail.uploadedBy = this.fullName;
        fileDetail.fileName = fileDetail?.fileInfo?.name
        this.listOfFilesRevokeToShown.push(fileDetail);
        // this.uploadDescription = "";
      }
      // this.fileInput.nativeElement.value = null;
    }

  }

  //Save Revoke 
  saveRevokeBtn(){
    if(this.revokeForm.valid){
        let reqObj = {
          revokeId : this.revokeForm.get('revokeId')?.value || 0,
          supplierId: this.supplierId,
          entityIds : [this.revokeListEntityId],
          reasons: this.revokeForm.get('reason')?.value,
          descriptions: this.revokeForm.get('description')?.value,
          effectiveDates : this.revokeForm.get('effectiveDate')?.value ? moment(this.revokeForm.get('effectiveDate')?.value).format('YYYY-MM-DDThh:mm:ssZ') : "",
          uploadedBy : this.fullName,
          suspensionHistoryId: this.suspensionHistoryId
        }
        this.componentService.saveRevokeProcess(reqObj).subscribe((res)=>{
          if(res?.success){
          //   if(this.listOfFilesRevoke?.length > 0){
          //     const formData = new FormData();
          //     formData.append('SupplierId', this.supplierId);
          //     formData.append('revokeId', res?.data?.revokeId);
          //     formData.append("description", this.updatedData?.historyRecord?.entityIds);
          //     formData.append("description", this.updatedData?.historyRecord?.entityIds);
          //     // this.listOfFilesDesc.forEach((item: any) => formData.append("Descriptions", item));
          //     // this.listOfFilesUploadedBy.forEach((item: any) => formData.append("UploadedBy", item));
          //     if (this.listOfFilesRevoke.length > 0) {
          //       this.listOfFilesRevoke.forEach((file) => {
          //         formData.append('files', file)
          //       });
          //     };
          //     console.log(formData.get('files'))
          //     this.componentService.updateSusTerAttachments(formData).subscribe((data: any) => {
          //       if (data?.success) {
          //         this.adminService.showMessage('Your request is saved successfully.');
          //         this.isProcessWorkflowEnable = true;
          //         this.submitResponse = res.data;
          //         // this.getAlreadySuspensionDetails();
          //         this.getSuspendedTerminatedEntities();
          //       }
          //     }, error => {
          //       this.adminService.showMessage("Upload Failed!")
          //     })
          //   }else{
          //     this.getSuspendedTerminatedEntities();
          //     this.isProcessWorkflowEnable = true;
          //   }
          let obj = {
            suspensionHistoryId: this.suspensionHistoryId,
            status : `Revoke In-Progress`
          }
          this.componentService.updateStatusForHistoy(obj).subscribe((res)=>{
            if(res.success){
              this.revokeWFFlag = true;
              debugger
              this.callRevokeAPI = true;
              this.revokeWFRequestObject;
              this.getSuspendedTerminatedEntities();
              this.isRevokeProcessWorkflowEnable = true;
            }
          })
          }
        })
    }else{
      this.adminService.showMessage(`Please fill all mandatory fields`);
    }
  }

  // Notify supplier
  notifySupplier(actionRevoke?:boolean) {
    const data = {
      "supplierId": this.supplierId,
      "status": 'NotifySuspension'
    }
    this.wfService.notifySuspensionTerminationFlow(data).subscribe(
      (response:any) => {
        if (response) {
          this.adminService.showMessage('Notification sent successfully');
          this.getSuspendedTerminatedEntities(true);
          this.dialog.closeAll();
          if(actionRevoke){
            let obj = {
              supId : this.supplierId,
              screenName: ActivityScreenConstants.SupplierRevoke
            }
            this.wfService.clearWfStatus(obj).subscribe((res:any)=>{
              if(res){
                
              }
            })
          }
        }
      }
    );
  }

  getSuspendedTerminatedEntities(fromNotifier:boolean=false){
    this.getSusTermEntityListArray = [];
    this.componentService.getSusTermEntityList(this.supplierId).subscribe((res:any)=>{
      if(res?.success && res?.data?.length > 0){
        res?.data?.forEach((element:any) => {
          const entityNameArray = JSON.parse(element?.historyRecord?.entityNames);
          element.historyRecord.entityName = entityNameArray[0];
        });
        this.getSusTermEntityListArray = res?.data;
        this.checkStatusWhetherIsUpdatedStatus = res?.data?.some((v:any)=> 
          v.historyRecord.status === `Update ${WorkFlowStatusConstants.WFINITIATED}`||
          v.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFREQINFO}` ||
          v.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFAPPROVED}`
        )

      //   let checkStatusForDisbaleFields = res?.data?.some((v:any)=> 
      //     v.historyRecord.status === `Update ${WorkFlowStatusConstants.WFINITIATED}`||
      //     v.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFAPPROVED}` ||
      //     v.historyRecord.status === `Revoke ${WorkFlowStatusConstants.WFINITIATED}`||
      //     v.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFAPPROVED}`
      //   )
      //   //NOTE - check if update status is Initiated, ReqInfo, or Approved
      // if(checkStatusForDisbaleFields){
      //   const entityFormArray = this.assignEntity.get('entityArray') as FormArray;
      //   entityFormArray.disable();
      //   this.statusBasedDisable = true;
      //   this.assignEntity.get('assignAll')?.disable();
      // }
        this.checkStatusWhetherIsRevokeStatus = res?.data?.some((v:any)=> 
          v.historyRecord.status === `Revoke ${WorkFlowStatusConstants.WFINITIATED}`||
        v.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFREQINFO}` || 
        v.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFAPPROVED}`
      )
      if(this.checkStatusWhetherIsRevokeStatus)this.revokeWFFlag= true;
      if(this.checkStatusWhetherIsRevokeStatus && this.PQAPRCheck)this.revokePopup();
      let status = this.revokeWFFlag ? 'Revoke' : 'Update'
      this.updatedData = res?.data?.find((e:any)=>{
        return e?.historyRecord?.status === `${status} ${WorkFlowStatusConstants.WFINITIATED}` || 
        e.historyRecord?.status === `${status} ${WorkFlowStatusConstants.WFREQINFO}` ||
        e?.historyRecord?.status === `${status} ${WorkFlowStatusConstants.WFAPPROVED}` ||
        e?.historyRecord?.status === `${status} In-Progress` || 
        e.historyRecord?.status === `${status} ${WorkFlowStatusConstants.WFREJECTED}`
      });
      //Check auto condition for autopopulated when status is Update - Initiate, Req Info
      let updateCondCheck = res?.data?.find((e:any)=>{
        return e?.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFINITIATED}` || 
        e.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFREQINFO}` ||
        e?.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFAPPROVED}` ||
        e.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFREJECTED}`
      });
      if(this.checkStatusWhetherIsUpdatedStatus){
        let formObjectToShow = {
          suspension : updateCondCheck?.historyRecord,
          documents: updateCondCheck?.historyDocuments
        }
        this.bindFields(formObjectToShow);
      }
      // Check update Req Info
      if(res?.data?.find((e:any)=>e?.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFREQINFO}`)){
        this.updateFlag = true;
      }
        let checkApprovedData = res?.data?.find((e:any)=>{
          return e?.historyRecord?.status === `Update ${WorkFlowStatusConstants.WFAPPROVED}`;
        });
        let checkRevokeApprovedData = res?.data?.find((e:any)=>{
          return e?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFAPPROVED}`;
        });
        if(checkApprovedData && this.allLevelApproved && fromNotifier){
          let obj = {
            suspensionHistoryId: checkApprovedData.historyRecord.suspensionHistoryId,
            status : checkApprovedData.historyRecord.suspensionType === "suspension" ? "Suspended" : "Terminated"
          }
          this.updateStatusForHistory(obj);
          this.clearRetriveData();
          this.clearForms();
          this.getWFStatus();
        }else if(checkRevokeApprovedData && this.allLevelApproved && this.revokeWFFlag && fromNotifier){
          this.componentService.deleteSuspensionHistory(Number(this.suspensionHistoryId)).subscribe((resData:any)=>{
            if(resData?.success){
              this.adminService.showMessage("Data revoked succesfully");
              this.revokeWFFlag = false;
              this.clearRetriveData();
              this.clearForms();
              this.getSuspendedTerminatedEntities();
            }
          })
        }
        console.log("Suspension and termination list",res.data)
        // if(!this.checkStatusWhetherIsRevokeStatus && !this.checkStatusWhetherIsUpdatedStatus){
          this.entitydata = [];
          this.assignEntitys(); //Call Assign entity API
        // }

        if(fromNotifier){
          this.clearRetriveData();
          this.clearForms();
          this.getWFStatus();
          this.getSuspendedTerminatedEntities();
        }

        if(this.callRevokeAPI)this.callRevokeAPI=false,this.getRevokeData();
      }else{
        this.entitydata = [];
        this.assignEntitys(); //Call Assign entity API
      }
    },error=>{
      this.entitydata = [];
      this.assignEntitys(); //Call Assign entity API
    })
  }

  // Get revoke selection checkbox data
  getRevokeCheckbox(value:any){
    this.updateFlag = false;
    this.updatedData = {};
    this.revokeForm.reset();
    this.isRevokeProcessWorkflowEnable = false;
    if(this.suspensionHistoryId === value?.historyRecord?.suspensionHistoryId){
      this.revokeListEntityId = null;
      this.suspensionHistoryId = null;
    }else{
      this.revokeListEntityId = value?.historyRecord?.entityIds;
      this.suspensionHistoryId = value?.historyRecord?.suspensionHistoryId;
      this.getSelectedRevokeData = value;
      debugger
      this.updatedData = value;
    }
    console.log("Revoke ID : ", this.revokeListEntityId);
  }

  // Revoke process workflow
  revokeProcessWorkflow(){
    this.isShowRevokeProcessWF = true;
  }

  // Update or View
  updateOrViewDetails(data:any, action : string){
    this.updateFlag = false;
    this.isProcessWorkflowEnable = false;
    let formObjectToShow = {
      suspension : data?.historyRecord,
      documents: data?.historyDocuments
    }
    this.updatedData = data;
    if(data?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFINITIATED}` || 
      data?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFAPPROVED}` ||
      data?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFREQINFO}` || 
      data?.historyRecord?.status === `Revoke In-Progress`
    ){
      this.revokeListEntityId = data?.historyRecord?.entityIds;
      this.revokePopup();
      return;
    }
    this.bindFields(formObjectToShow);
    if(action === 'update'){
      this.updatedData = data;
      this.processData.enable();
      this.statusBasedDisable = false;
      this.updateFlag = true;
      this.isSaveEnable = true;
      if(data?.historyRecord?.status === 'Update In-Progress'){
        this.isProcessWorkflowEnable = true;
      }
    }else{
      this.processData.disable();
      this.statusBasedDisable = false;
      this.updateFlag = false;
      this.isSaveEnable = false;
    }
    this.susTerProcessElem.nativeElement.scrollIntoView();
  }

  // Update status for history
  updateStatusForHistory(data:any){
    let obj = {
      suspensionHistoryId: data.suspensionHistoryId,
      status : data.status
    }
    this.componentService.updateStatusForHistoy(obj).subscribe((res)=>{
      if(res.success){
        this.getSuspendedTerminatedEntities();
      }
    })
  }

  // Get revoke data
  getRevokeData(){
    this.alreadyRevokedCalled = false;
    this.revokedHistoryId = 0;
    this.revokedFilterResult = {};
    this.componentService.getRevokeSusupensionData(this.supplierId).subscribe((res:any)=>{
      if(res?.success && res?.data?.length > 0){
        this.revokedStoredData = res?.data;
        debugger
        
          if(this.updatedData?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFAPPROVED}` || 
            this.updatedData?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFINITIATED}` ||
            this.updatedData?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFREQINFO}`  ||
            this.updatedData?.historyRecord?.status === `Revoke In-Progress`
          ){
            this.revokeListEntityId = this.updatedData?.historyRecord?.entityIds;
            this.suspensionHistoryId = this.updatedData?.historyRecord?.suspensionHistoryId;
          }
        // this.getSusTermEntityListArray.forEach((element:any) => {
        //   // if(element?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFAPPROVED}`){
        //   //   this.revokedHistoryId = element?.historyRecord?.suspensionHistoryId;
        //   // }
        //   if(element?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFAPPROVED}` || 
        //     element?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFINITIATED}` ||
        //     element?.historyRecord?.status === `Revoke ${WorkFlowStatusConstants.WFREQINFO}`  ||
        //     element?.historyRecord?.status === `Revoke In-Progress`
        //   ){
        //     this.revokeListEntityId = element?.historyRecord?.entityIds;
        //     this.suspensionHistoryId = element?.historyRecord?.suspensionHistoryId;
        //   }
        // });
        if(this.updatedData?.historyRecord?.status === `Revoke In-Progress`){
          this.isRevokeProcessWorkflowEnable = true;
        }
        this.revokedFilterResult = res?.data?.filter((rev:any) => this.suspensionHistoryId === rev.suspensionHistoryId);
        // const getHistoryId = this.getSusTermEntityListArray.filter((his:any)=> his.historyRecord?.entityIds === this.revokeListEntityId);
        debugger
        this.revokeWFRequestObject = {
          supplierRefNo : `Revoke-${this.revokedFilterResult[0]?.revokeId}`,
          supplierId: this.supplierId,
          checkWFObject: {
            clearFlag : this.statusRFI || this.allLevelApproved || false,
            activity : ActivityScreenConstants.SupplierRevoke
          }
        }
        if(this.revokedFilterResult?.length > 0)this.suspensionHistoryId = this.revokedFilterResult[0]?.suspensionHistoryId;
        if(this.revokedFilterResult?.length > 0){this.showWFDetailsPopup = true;this.getWFStatus(true); this.checkWFLevelAvailable();}
        console.log("Revoke filter : ", this.suspensionHistoryId)
        this.revokedFilterResult?.length && this.revokeForm.patchValue({
          revokeId : this.revokedFilterResult[0]?.revokeId,
          reason : this.revokedFilterResult[0]?.reasons,
          description : this.revokedFilterResult[0]?.descriptions,
          effectiveDate : this.revokedFilterResult[0]?.effectiveDates,
        })
        // if(this.checkStatusWhetherIsRevokeStatus && this.PQAPRCheck)this.alreadyRevokedCalled = true,this.revokePopup();
        if(this.checkStatusWhetherIsRevokeStatus)this.alreadyRevokedCalled = true,this.revokePopup();
      }
    })
  }

  //Clear form 
  clearForms(){
    this.startDate.setValue(new Date());
    this.statusBasedDisable = false;
    this.isNotifyEnable = false;
    this.isSaveEnable = true;
    this.isRevokeNotifyEnable = false;
    this.entitydata = [];
    // this.assignEntitys(); //Call Assign entity API
  }

  //Revoke popup
  revokePopup() {
    if(this.revokeListEntityId){
      this.PQAPRCheck = false;
      if(!this.alreadyRevokedCalled)this.getRevokeData();
      if(this.getSelectedRevokeData?.historyRecord?.status === `Revoke In-Progress`){
        this.isRevokeProcessWorkflowEnable = true;
      }else if(this.getSelectedRevokeData?.historyRecord?.status===''){
        this.isRevokeSaveEnable = true;
      }
      this.isShowRevokeProcessWF = false;
      const closedialog = this.dialog.open(this.revokeEntity, {
        disableClose: true,
        hasBackdrop: true,
        backdropClass: '',
        autoFocus: true,
        width: '85%',
        height: '80%',
        position: {
          top: 'calc(3vw + 20px)',
          bottom: '',
          left: '',
          right: ''
        },
        data: {
          entityIDs: this.revokeListEntityId,
        },
        panelClass: 'popUpMiddle',
      });
      closedialog.afterClosed().subscribe((result:any) => {
        if (result === true) {
          this.getWFStatus(true);
        }
      })
    }else{
      if(!this.PQAPRCheck)this.adminService.showMessage("Please select one entity");
    }
  }

  revokeInitiateWF(e:any){
    if(e){
      debugger
      this.historyStatusAPICheckFlag = true;
      this.revokeWFFlag = true;
      this.getWFStatus(true);
    }
  }

  closeRevokePopup(){
    this.revokeListEntityId = null;
    this.suspensionHistoryId = null;
  }
}
