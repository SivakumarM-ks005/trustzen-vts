import { Component, effect, inject, TemplateRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormArray,
} from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogTitle,
  MatDialogClose,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  MatIconButton,
  MatButton,
  MatButtonModule,
} from '@angular/material/button';
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  themeBalham,
  type ColDef,
  type GridApi,
  type RowClassRules,
  type SelectionChangedEvent,
} from 'ag-grid-community'; // Column Definition Type Interface

import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatePipe, Location, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { OnlyAllowedInputDirective } from '@app/core/directives/only-allowed-input.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  SysParameterGeneralService,
  SystemGeneralSettings,
} from '@app/core/services/sys-parameter-general.service';
import {
  Entity,
  PRAssignSupplier,
  PRDocument,
  PRItem,
} from '@app/core/models/purchase-requisition';
import { CurrencyMaskDirective } from '@app/core/directives/format-currency.directive';
import { SupplierUserFormService } from '@app/core/services/supplier-management/supplier.user.form.service';
import { AllowNumberOnlyDirective } from '@app/core/directives/allowNumberOnly.directive';
import { RestApiService } from '@app/services/rest-api.service';
import { catchError, debounceTime, forkJoin, of } from 'rxjs';
import { DocIconDirective } from '@app/core/directives/doc-icon.directive';
import { MatBadge, MatBadgeModule } from '@angular/material/badge';
import { EntityHierarchyLevelsPipe } from '@app/core/pipes/entity-hierarchy-levels.pipe';
import { AgGridModule } from 'ag-grid-angular';
import { AdminService } from '@app/core/services/admin/admin.service';
import { AgGridUiComponent } from '@app/ui-components/ag-grid-ui/ag-grid-ui.component';
import { MatDatePickerFormatDirective } from '@app/core/directives/mat-date-picker-format.directive';
import { MaterialIssueNotesComponent } from '@app/inventory-master/material-issue-notes/material-issue-notes.component';
import { MaterialReceiptsComponent } from '@app/inventory-master/material-receipts/material-receipts.component';
import { SharedService } from '@app/core/services/shared/shared.service';
import { Router } from '@angular/router';
import { SupplierAttachmentService } from '@app/core/services/supplier-management/supplier-attachment.service';
import { CommonService } from '@app/core/services/common.service';
import { DialogInitiateApprovalComponent } from '@app/dialogs/dialog-initiate-approval/dialog-initiate-approval.component';
import { WorkFlowScreenConstants, WorkFlowStatusConstants, WorkFlowStatusForLevelWise } from '@app/core/models/constants/work-flow.constant';
import { WfRelatedService } from '@app/core/services/workflow/wf-related.service';
import { ConfirmationDialogComponent } from '@app/confirmation-dialog/confirmation-dialog.component';
import { DialogWfHistoryComponent } from '@app/supplier-user-form/dialog-wf-history/dialog-wf-history.component';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { parseUrlToFile } from '@app/core/models/file-with-url';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-add-purchase-request',
  standalone: true,
  imports: [
    MatDialogTitle,
    UpperCasePipe,
    OnlyAllowedInputDirective,
    MatIconButton,
    MatDialogClose,
    MatTooltip,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatCheckbox,
    NgFor,
    NgIf,
    MatError,
    MatInput,
    MatDialogActions,
    MatBadge,
    MatIcon,
    MatButton,
    TranslatePipe,
    MatDatepickerModule,
    DatePipe,
    CurrencyMaskDirective,
    AllowNumberOnlyDirective,
    DocIconDirective,
    EntityHierarchyLevelsPipe,
    AgGridModule,
    MatDatePickerFormatDirective,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader, MatExpansionPanelTitle,
        MatExpansionPanelDescription
  ],
  templateUrl: './add-purchase-request.component.html',
  styleUrl: './add-purchase-request.component.scss',
})
export class AddPurchaseRequestComponent implements OnInit, OnDestroy {
  SupDetails: any;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private sysParamsGeneral: SysParameterGeneralService,
    private supplierUserFormService: SupplierUserFormService,
    private apiService: RestApiService,
    private adminService: AdminService,
    private sharedService: SharedService,
    private router: Router,
    private wfService: WfRelatedService

  ) { }
  systemParameter: SystemGeneralSettings;
  @ViewChild('addSupplier') addSupplier: any;
  @ViewChild('suppliersListGrid') suppliersListGrid: AgGridUiComponent;
  @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;
  PR_form: FormGroup;
  userDetails = JSON.parse(localStorage.getItem('loginDetails') || '{}');
  entityLevelsLov: {entity:Entity[],entityIndex:number} = {
    entity: [],
    entityIndex:0
  };
  selectedEntity:Entity;
  purchaseClassificationList: any = [];
  sourceList: any = [];
  currencyList: any = [];
  documentSets: any = [];
  spendTypeList: any = [];
  itemInventryList: any = []
  assignedBuyer: any = [];
  budgetCheckRes = [
    { id: 1, response: 'PASS' },
    { id: 0, response: 'FAIL' },
  ];
  prStatus = WorkFlowStatusConstants;
  PR_buttonsControl = {
    save: { disabled: false },
    submit: { disabled: true },
    prWf: { disabled: false },
  };
  valueBaseControls={
    prStatus:''
  }
  prFieldControl = {
    purchaseCategory: false,
    assignedBuyer: false,
  };
  purchaseCategory: any = [];
  back = () => this.router.navigate(['/krya/purchaseRequestList'], { skipLocationChange: true, replaceUrl: true });
  dialogClose = () => this.dialog.closeAll();

  fileList: any = [];
  PR_get_data: any;

  //Inject Service
  supplierAttact = inject(SupplierAttachmentService);
  commonService = inject(CommonService);
  ngOnInit(): void {
    this.getSupplierDetails();
    this.supplierUserFormService.GetSysParameterGeneral().subscribe((res) => {
      if (res) {
        this.systemParameter = res;
        // console.log(this.systemParameter, 'system params general');
        this.allGetLOV();
      }
    });
  }
  ngOnDestroy(): void {
    this.sharedService.supscriptionLookup['PR_sub'].unsubscribe();
    this.sharedService.setData({ sharedId: 'no data' });
  }
  allGetLOV() {
    // this.documentSets = this.mockDoclist;
    // this.entityLevelsLov.entity = this.mockEntityList as [];
    // this.entityLevelsLov.hierarchy = this.mockHierarchy as [];
    // this.purchaseClassificationList = this.mockPurchaseClassificationList as [];
    // this.sourceList = this.mockSource as [];
    // this.currencyList = this.mockCurrency as [];

    // this.apiService.getData('PurchaseRequisition/GetPurchaseClassificationList').subscribe(purchaseClassi=>{
    //   console.log(purchaseClassi,'pydsknlkafdskjndskj')
    // })

    forkJoin(
      this.apiService.getData('Common/GetMatReqDropDownData'),
      this.apiService
        .getData('PurchaseRequisition/GetPRDocumentListAsync?transactionId=2'),
      this.apiService
        .getData('PurchaseRequisition/GetPurchaseClassificationList'),
      this.apiService
        .getData('PurchaseRequisition/GetSourceList'),
      this.apiService
        .getData('PurchaseRequisition/GetCurrencyList'),
      this.apiService
        .getData(`PurchaseRequisition/GetSpendType`),
      this.apiService
        .getData(`PurchaseRequisition/GetPRItemsSection`)).subscribe(
          ([
            entityList,
            docList,
            purchaseClassifi,
            sourceList,
            currencyList,
            spendType,
            itemsSection
          ]) => {
            this.documentSets = docList as [];
            this.entityLevelsLov.entity = (entityList as any)['entityData'] as [];
            this.purchaseClassificationList = purchaseClassifi as [];
            this.sourceList = sourceList as [];
            this.currencyList = currencyList as [];
            // this.assignedBuyer = assignedBuyer as [];
            this.spendTypeList = spendType as [];
            this.itemInventryList = itemsSection as [];
            this.createPRForm();
            console.log(entityList, this.documentSets, 'documentsets');
          }
        );
  }
  onClick(
    neededSelectPath: string,
    selectName: string,
    otherInfo = false,
    info?: any
  ) {
    if (!otherInfo) {
      let needed = this.PR_form.get(neededSelectPath)?.value;
      return (
        needed || this.adminService.showMessage(`Kindly select a ${selectName}`)
      );
    }
    return;
  }
  // getLevelsName(level:number){
  //   this.selectedEntity[`${level${level}LabelName}`]
  // }
  getPRInfo(){
    return this.PR_form.get('purchaseRequisitionInfo') as FormGroup;
  }
  hasvalidators(level:number){
    return this.getPRInfo().get(`level${level}ID`)?.hasValidator(Validators.required);
  }
  
  onHierarchyChange(level:number){
    let levelInp={
      level1EntityData:'level1ID',
      level2EntityData:'level2ID',
      level3EntityData:'level3ID',
      level4EntityData:'level4ID',
    };
    // let levels=Object.keys(levelInp) as ['level1EntityData'|'level2EntityData'|'level3EntityData'|'level4EntityData'];
    [1,2,3,4].forEach((l)=>{
      let nlevel=`level${l}EntityData` as 'level1EntityData'|'level2EntityData'|'level3EntityData'|'level4EntityData' 
      this.getPRInfo().get(levelInp[nlevel])?.removeValidators(Validators.required);
    
      if(l<=level&&this.selectedEntity[nlevel].length!=0){
        this.getPRInfo().get(levelInp[nlevel])?.addValidators([Validators.required]);
        // this.getPRInfo().get(levelInp[nlevel])?.setValue('');
      }else if(l>level){
        this.getPRInfo().get(levelInp[nlevel])?.setValue('');
      }
      this.getPRInfo().get(levelInp[nlevel])?.updateValueAndValidity();
      console.log(l, this.getPRInfo().get(levelInp[nlevel])?.hasValidator(Validators.required))
      // if(l>level){
      //   this.getPRInfo().get(levelInp[nlevel])?.removeValidators(Validators.required);
      //   this.getPRInfo().get(levelInp[nlevel])?.setValue('');
      // }
    })
    this.getPRInfo().updateValueAndValidity()
  // this.selectedEntity[level]
  }
  getHierarchyLevels(level:'level1EntityData'|'level2EntityData'|'level3EntityData'|'level4EntityData',filter:string|null){
     if(!this.selectedEntity)return [];
     if(filter)filter=this.PR_form.get(`purchaseRequisitionInfo.${filter}`)?.value;
    //  else filter= null;
    return this.selectedEntity[level].filter(level=>level.levelValueFilter==filter);
   
  }
  afterApprovedPR(){
    // {    "lookupId": 1,    "lookupCatId": 1,    "langId": 1,    "displayOrder": "",    "lovSubCatName": "ERP System",    "lovSubCatDesc": "",    "lovSubCatCode": "",    "systemFlag": true,    "loggedIn": 0  }
    this.apiService
    .getData(`PurchaseRequisition/GetAssignBuyerList?EntityId=${this.PR_form.get('purchaseRequisitionInfo.entityNameID')?.value}`).subscribe(res=>{
      this.assignedBuyer = res;
    });
    this.apiService.getDataFromAdmin('LOVCategory/GetLOVCategoryMas').subscribe(source=>{
      this.sourceList = source as [];
      this.apiService.getDataFromAdmin('LOVCategory/GetLOVSubCategoryMas').subscribe((pc:any)=>{
        let sourceId=this.PR_form.get('purchaseRequisitionInfo.sourceID')?.value;
        let prCat = pc.filter((data:any)=>data.lookupCatId==sourceId);
          this.purchaseCategory=prCat||[];
        })
    })
   
  }
  //entitySection
  getHierarchy(entityID: number, entityLevelSection?: MatSelect) {
    if (entityID == 0) return;
   
    if(entityLevelSection){
     let matOpt= entityLevelSection?.selected as MatOption;
      this.entityLevelsLov['entityIndex']=+matOpt.id;
    }else this.entityLevelsLov['entityIndex']=entityID;
    
   
   this.selectedEntity=this.entityLevelsLov['entity'][this.entityLevelsLov['entityIndex']];
   this.onHierarchyChange(1);


//  {
//   "entityId": 3,
//   "entityCode": "1000",
//   "companyName": "KRYA CHILD 1",
//   "level1LabelName": null,
//   "level1EntityData": [
//     {
//       "levelHierarchyId": 5,
//       "entityId": 3,
//       "levelDefId": 1,
//       "levelValueCode": "001",
//       "levelValueName": "HR",
//       "levelValueFilter": null
//     },


    return;
    // this.apiService
    //   .getData(`PurchaseRequisition/GetHierarchyLevelMas?entityId=${entityID}`)
    //   .pipe(catchError((err) => of(this.mockHierarchy)))
    //   .subscribe((hierarchy) => {
    //     this.entityLevelsLov.hierarchy = this.mockHierarchy as [];
    //     if (entityLevelSection) {
    //       this.onLevelsChange(`${entityLevelSection.level1ID}`, 1);
    //       this.onLevelsChange(entityLevelSection.level2ID, 2);
    //       this.onLevelsChange(entityLevelSection.level3ID, 3);
    //     }
    //     // if(){
    //     //   this.onLevelsChange()
    //     // }
    //   });
  }
  onLevelsChange(value: string, level: number) {
    if(level==1){
      this.PR_form.get('purchaseRequisitionInfo.fromDepartment')?.setValue(value);
      // this.PR_form.get('purchaseRequisitionInfo.fromDepartment')?.disable();
    }
    [1, 2, 3, 4].forEach((n) => {
      if (level < n)
        this.entityLevelsLov = { ...this.entityLevelsLov, [`level${n}`]: '' };
      else if (level == n)
        this.entityLevelsLov = {
          ...this.entityLevelsLov,
          [`level${level}`]: value,
        };
    });
  }
  //entitySection
  //document section
  getUploadFiles = (doc: FormGroup) => doc.get('upload')?.value.length == 0;
  onUploadClick(event: any, docIndex: number, fg: any) {
    event.stopPropagation();
    let fileUploadInput = document.getElementById(
      'PRfileUpload'
    ) as HTMLInputElement;
    fileUploadInput.onchange = null; // Reset the onchange event
    fileUploadInput.onchange = (event) =>
      this.onFileUploadChange(fileUploadInput, docIndex, fg);
    // if (!fileUploadInput.onchange) {
    //     fileUploadInput.onchange = (event) => this.onFileUploadChange(fileUploadInput, docIndex, fg);
    // }
    fileUploadInput.click();
  }

  onFileUploadChange(fileInp: HTMLInputElement, docIndex: number, fg: any) {
    console.log('file upload', fileInp, this.documentSets[docIndex], 'changed');
    let tFiles = fg.get('upload')?.value || [];
    let existFiles = tFiles.map((file: any) => file.name);
    if (fileInp.files == null) return;
    for (let index = 0; index < fileInp.files.length; index++) {
      const file = fileInp.files[index];
      if (!existFiles.includes(file.name)) tFiles.push(file);
      else this.adminService.showMessage(`${file.name} File already exist`);
    }
    this.updateDocumentSection(tFiles, fg);
    fileInp.value = ''; // Clear the input files
  }
  minArrayLengthValidator(
    minLength: number = 1,
    isRequired = false
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        (isRequired && !control.value) ||
        !Array.isArray(control.value) ||
        !control.value.length
      ) {
        return { uploadFiles: 'Upload a mandatory Files' };
      }
      return null;
    };
  }
  updateDocumentSection(tFiles: any, fg: any) {
    fg.get('upload')?.setValue(tFiles);
    let parsedFiles = this.filePropParsing(tFiles);
    fg.get('fileType')?.setValue(parsedFiles.type);
    fg.get('fileName')?.setValue(parsedFiles.name);
    fg.get('uploadedBy')?.setValue(parsedFiles.uploadBy);
    fg.get('uploadedByName')?.setValue(parsedFiles.uploadByName);
    fg.get('uploadedDate')?.setValue(parsedFiles.uploadedDate);
  }
  uploadedFilesOnChange(files: any, fg: any) {
    this.updateDocumentSection(files, fg);
  }
  filePropParsing(files: File[]) {
    let parsedFiles = {
      type: '',
      name: '',
      uploadBy: this.userDetails.firstName,
      uploadByName: this.userDetails.firstName,
      uploadedDate: this.sysParamsGeneral.formatDate(new Date()),
    };
    files.forEach((file) => {
      parsedFiles.type += ` ${file.type} ,`;
      parsedFiles.name += ` ${file.name} ,`;
    });
    parsedFiles.type = parsedFiles.type.slice(0, -1);
    parsedFiles.name = parsedFiles.name.slice(0, -1);
    return parsedFiles;
  }
  // onUploadClick(docIndex: number, fileUploadInput: HTMLInputElement) {
  //   fileUploadInput.click();
  // }
  // onFileUploadChange(fileInp: HTMLInputElement, docIndex: number,fg:any) {
  //   console.log('file upload', fileInp, this.documentSets[docIndex], 'changed');
  //   let filesInpField = fg.get('upload');
  //  if( fileInp.files==null)return;
  //   for (let index = 0; index < fileInp?.files.length; index++) {
  //     const file = fileInp.files[index];
  //     if (filesInpField != null) this.fileList.push(file)

  //   };
  //   fileInp.files=new FileList([]);
  // }
  mapFileToObject(file: File): {
    filename: string;
    filetype: string;
    uploadedDate: string;
  } {
    return {
      filename: file.name,
      filetype: file.type || 'Unknown',
      uploadedDate: new Date().toISOString(), // Saves timestamp in ISO format
    };
  }
  getDocumentsArray() {
    // console.log(this.PR_form.get('prDocumentSection'))
    return this.PR_form.get('prDocumentSection') as FormArray;
  }
  totalAmount=()=>this.PR_form.get('purchaseRequisitionInfo.itemsSectionTotalAmount') as FormControl;
  //document section
  createPRForm(res?: any) {
    let formInfo: any = {
      refByAuto: true,
      refRequired: [],
      source: {value:2,disabled:true},
      assignBuyer: [{ value: null, disabled: true }, []],
    };
    if (!formInfo.refByAuto) {
      formInfo.refRequired = [Validators.required];
    }

    this.PR_form = this.fb.group({
      userId: [this.userDetails.userId],    
      purchaseRequisitionInfo: this.fb.group({
        purchaseRequisitionInfoID: [0],
        itemsSectionTotalAmount: [0],
        entityNameID: [0,Validators.required],
        loggedIn: 1,
        level1ID: ['',],
        level2ID: ['' ],
        level3ID: ['' ],
        level4ID: ['' ],
        prStatus: ['Draft in Progress'],
        sourceID: [formInfo.source, Validators.required],
        refNo: [
          { value: '', disabled: formInfo.refByAuto },
          ...formInfo.refRequired,
        ],
        createdDate: [this.sysParamsGeneral.formatDate(new Date())],
        indentor: [{value:`${this.userDetails.firstName} ${this.userDetails.lastName}`,disabled:true}],
        assignedBuyerID: formInfo.assignBuyer,
        purchaseCategory:[{value:null,disabled:true}],
        shortName: ['', Validators.required],
        description: [''],
        fromDepartment: [''],
        needByDate: [null, Validators.required],
        budgetCheckID: [{value:1,disabled:true}, Validators.required],
        currencyID: ['', Validators.required],
        toleranceValue: [
          1,
          [Validators.required, Validators.min(1), Validators.max(100)],
        ],
        purchaseClassificationID: ['', Validators.required],
        spendTypeID: ['', Validators.required],
        allowPartialResponse: [true],
        substituteItems: [true],
        prApprovedValue: [0],
        
      }),
      prItemsSection:  this.fb.array([]),
      prAssignSupplier: this.fb.array([]),
      prRemarks: this.fb.group({
        prRemarksID: [0],
        buyerRemarks: [''],
        supplierRemarks: [''],
      }),

      prDocumentSection: this.fb.array([]),
    });
    this.sharedService.supscriptionLookup['PR_sub'] &&
      this.sharedService.supscriptionLookup['PR_sub'].unsubscribe();
    this.sharedService.supscriptionLookup['PR_sub'] = this.sharedService
      .getData()
      .subscribe((res) => {
        console.log(res.sharedData, 'res from pr list');
        if (res.sharedId == 'PR_Data') {
          this.PR_get_data = res.sharedData
          ;
        }
        this.patchPRform(this.PR_get_data);
      });
  }
  getRegularApi() {
    this.checkWFLevelAvailable(); //Check WF level available for this user
    this.getWFStatus(); //Get Workflow status
    this.valueBaseControls.prStatus= this.PR_form.get('purchaseRequisitionInfo.prStatus')?.value;
    // this.getWFStatus()
  }
  onNewPR(){
  this.PR_buttonsControl.prWf.disabled=true;
  }
  patchPRform(res?: any) {
    // Update Form Arrays

    if (res) {
      this.PR_form.patchValue(res);
      this.PR_form.get('purchaseRequisitionInfo.itemsSectionTotalAmount')?.setValue(res?.purchaseRequisitionInfo?.itemsSectionTotalAmount);
      this.getRegularApi();
    }else this.onNewPR()
    this.updateFormArray(
      this.PR_form.get('prItemsSection') as FormArray,
      this.getItemsFormGroup.bind(this),
      res?.prItemsSection,
      'itemSection'
    );
    this.updateFormArray(
      this.PR_form.get('prAssignSupplier') as FormArray,
      this.getAssignSupplierGroup.bind(this),
      res?.prAssignSupplier
    );
    // update documents section with respected values

    this.documentSets.forEach((docs: any, ind: number) => {
      this.documentSets[ind][docs.documentID || docs.documentNameID] = docs.documentName;
    });
    if (res?.prDocumentSection && !res?.prDocumentSection[0]?.['documentName']) {
      let docLookup: any = {};
      this.documentSets.forEach((doc: any) => docLookup[doc.documentID || doc.documentNameID] = doc.documentName);
      res?.prDocumentSection.forEach((docs: any, ind: number) => {
        let doc = res?.prDocumentSection[ind];
        doc[docs?.documentNameID] =
          docLookup[docs?.documentNameID];
      });
    }
    console.log(res?.prDocumentSection, this.documentSets, 'changedgfpad');

    this.updateFormArray(
      this.PR_form.get('prDocumentSection') as FormArray,
      this.getDocumentGroup.bind(this),
      res?.prDocumentSection || this.documentSets
    );
    // update documents section with respected values

    // update entitySection with respected values

    this.updateEntityLevel();

    // update entitySection with respected values
  
    console.log(this.PR_form.value, 'updated');
    this.updatePRFormByStatus()
  }
  updatePRFormByStatus(){
    if(this.valueBaseControls.prStatus==this.prStatus.WFINITIATED||this.valueBaseControls.prStatus==this.prStatus.WFREJECTED){
      this.PR_buttonsControl.prWf.disabled = true;
      this.PR_buttonsControl.save.disabled = true;
      this.PR_form.disable();
    }else if(this.valueBaseControls.prStatus==this.prStatus.WFAPPROVED){
      this.PR_buttonsControl.prWf.disabled = true;
      this.PR_buttonsControl.save.disabled = true;
      this.PR_buttonsControl.submit.disabled = false;
      this.prFieldControl.assignedBuyer=true;
      this.prFieldControl.purchaseCategory=true;
      this.PR_form.disable();
      this.PR_form.get('purchaseRequisitionInfo.purchaseCategory')?.enable();
      this.PR_form.get('purchaseRequisitionInfo.assignedBuyerID')?.enable();
      this.PR_form.get('purchaseRequisitionInfo')?.updateValueAndValidity();
      this.afterApprovedPR()
    }else if(this.valueBaseControls.prStatus==this.prStatus.WFREQINFO){
      this.PR_buttonsControl.prWf.disabled = false;
      this.PR_buttonsControl.save.disabled = false;
      this.PR_buttonsControl.submit.disabled = true;
    }
  }
  updateEntityLevel() {
    let entityLevelSection = this.PR_form.get('purchaseRequisitionInfo')?.value;
    // if(entityLevelSection==0)return;
    let entityIndex = this.entityLevelsLov.entity.findIndex(entity=>entity.entityId==entityLevelSection.entityNameID);
    if(entityIndex==-1)return;
    this.getHierarchy(entityIndex);
  }
  updateFormArray(
    fa: FormArray,
    functionGrp: any,
    data?: any,
    sectionName?: string
  ) {
    fa.clear();
    if (data && data.length > 0) {
      data.forEach((item: any) => {
        let fGrp = functionGrp(item);
        fa.push(fGrp);
        // if (sectionName == 'itemSection') {
        //   this.onCategoryChange(1, fGrp).then((res) => {
        //     this.onCategoryChange(2, fGrp).then((res) => {});
        //   });
        // }
      });
      fa.updateValueAndValidity();
    } else {
      fa.push(functionGrp());
    }
  }
  documentsLookUp: any = {};
  getDocumentGroup(item?: PRDocument) {
    let itemsarray = this.PR_form.get('prDocumentSection') as FormArray;
    let id = item?.documentID || item?.documentNameID;
    this.documentSets.forEach;
    let urlF=[];
    if(item?.filePath){
      urlF.push(parseUrlToFile(item?.filePath));
     
    }
    let docGrp = this.fb.group({
      prDocumentSectionID: [item?.prDocumentSectionID || 0],
      documentTypeID: [{ value: item?.documentTypeID || null, disabled: true }],
      documentType: [{ value: item?.documentType || '', disabled: true }],
      fileType: [item?.fileType || ''],
      documentNameID: [id || null],
      documentName: [item?.[`${id}`] || ''],
      description: [item?.description || ''],
      fileName: [item?.fileName || ''],
      uploadedBy: [item?.uploadedBy || ''],
      uploadedByName: [{ value: '', disabled: true }],
      uploadedDate: [item?.uploadedDate || null],
      upload: [{ value: urlF, disabled: true }],
      serialNo: [0],
      // fileLength:[0,Validators.required],
      delete: [{ value: item?.delete || false, disabled: true }],
    });
    
    docGrp.setValidators(this.fileUploadRequired);
    return docGrp;
  }

  fileUploadRequired(group: AbstractControl): ValidationErrors | null {
    const uploadFiles = group.get('upload')?.value;

    if (!uploadFiles || uploadFiles.length === 0) {
      // console.log('Validation failed: No files uploaded');
      return { fileRequired: true }; // Validation error
    }
    // console.log('Validation passk');
    return null; // No error
  }
  getAssignSupplierGroup(item?: PRAssignSupplier) {
    let itemsarray = this.PR_form.get('assignSuplliers') as FormArray;
    return this.fb.group({
      prAssignSupplierID: [item?.prAssignSupplierID || 0],
      supplierCode: [item?.supplierRefNo||item?.supplierCode || null, Validators.required],
      supplierName: [item?.supplierName || ''],
      grade: [item?.supplierGrade ||item?.grade || '', Validators.required],
      status: [item?.status || null, Validators.required],
      serialNo: [0],
      selectAll: true,
      // action:[item?.action||null,Validators.required],
    });
  }

  getItemsFormGroup(item?: PRItem) {
    // let itemsarray = this.PR_form.get('itemsSection.items') as FormArray;

    return this.fb.group({
      prItemsSectionID: [item?.prItemsSectionID || 0],
      serialNo: [0],
      codeID: [item?.codeID || '', Validators.required],
      typeID: [{ value: item?.typeID || '', disabled: true }],
      descriptionID: [item?.descriptionID || '', Validators.required],
      uomId: [{ value: item?.uomId || '', disabled: true }],
      quantity: [`${item?.quantity || ''}`, Validators.required],
      rate: [`${item?.rate || ''}`, Validators.required],
      value: [{ value: `${item?.value || ''}`, disabled: true }, Validators.required],
      spendCategory1ID: [item?.spendCategory1ID || ''],
      spendCategory2ID: [item?.spendCategory2ID || ''],
      spendCategory3ID: [item?.spendCategory3ID || ''],
    });
  }
  getItems(isAdd = false): any {
    let itemsarray = this.PR_form.get('prItemsSection') as FormArray;
    if (isAdd) itemsarray.push(this.getItemsFormGroup());
    return itemsarray || new FormArray([]);
  }

  // PR ITEMS SECTION
  removeItem(index: number) {
    let itemsArray = this.getItems() as FormArray;
    itemsArray.length == 1 && index == 0
      ? this.adminService.showMessage('Can not remove last Item')
      : itemsArray.removeAt(index);
  }
  onItemGrpChange(itemGrp: FormGroup, selectedItem:any) {
    itemGrp.get('codeID')?.setValue(selectedItem.code);
    itemGrp.get('typeID')?.setValue(selectedItem.typeId || '');
    itemGrp.get('descriptionID')?.setValue(selectedItem.description);
    itemGrp.get('uomId')?.setValue(selectedItem.uomId);
    itemGrp
      .get('spendCategory1ID')
      ?.setValue(selectedItem.spendCategory1ID);
    itemGrp
      .get('spendCategory2ID')
      ?.setValue(selectedItem.spendCategory2ID);
    itemGrp
      .get('spendCategory3ID')
      ?.setValue(selectedItem.spendCategory2ID);

    // console.log('onselected item', selectedItem)
    return itemGrp;
    // this.onCategoryChange(1, itemGrp).then((res) => {
    //   this.onCategoryChange(2, itemGrp).then((res) => {});
    // });
  }

  updateItemValue(index: number) {
    const itemsArray = this.PR_form.get('prItemsSection') as FormArray;
    const totalAmountControl = this.PR_form.get('purchaseRequisitionInfo.itemsSectionTotalAmount');

    if (itemsArray && totalAmountControl) {
      const itemGroup = itemsArray.at(index) as FormGroup;

      const quantity = this.calculationItem(itemGroup.get('quantity')?.value) || 0;
      const rate = this.calculationItem(itemGroup.get('rate')?.value) || 0;

      const calculatedValue = quantity * rate;

      // Update 'value' field
      itemGroup.get('value')?.setValue(calculatedValue, { emitEvent: false });

      let delay = setTimeout(() => {
        // Recalculate total amount
        let totalAmount = 0;
        itemsArray.controls.forEach((group: any) => {
          let value: string | number = group.get('value')?.value || '0';

          totalAmount += this.calculationItem(value);
        });

        // Update 'totalAmount'
        totalAmountControl.setValue(totalAmount, { emitEvent: false });
        // console.log(delay)
        clearTimeout(delay);
      }, 100);
    }
  }
  calculationItem(val: string | number) {
    if (typeof val == 'string') {
      return parseFloat(val.replace(/[^0-9.]/g, ''))
    }
    return val;
  }
  // PR ITEMS SECTION

  //get and save
  focusOnFirstInvalidField(formGroup?: FormGroup) {
    // Get all invalid input fields, including mat-select, checkboxes, and radio buttons
    const invalidFields: NodeListOf<HTMLElement> = document.querySelectorAll(
      'input.ng-invalid, select.ng-invalid, textarea.ng-invalid, mat-select.ng-invalid, input[type="checkbox"].ng-invalid, input[type="radio"].ng-invalid'
    );

    if (invalidFields.length > 0) {
      invalidFields[0].focus();
    }
  }
  focusOnInvalidField(formGroup: FormGroup) {
    const findInvalidControl = (group: any, parentKey = '') => {
      for (const key of Object.keys(group.controls)) {
        const control = group.controls[key];
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (control instanceof FormGroup || control instanceof FormArray) {
          findInvalidControl(control, fullKey);
        } else if (control.invalid) {
          const invalidField: HTMLElement | null = document.querySelector(
            `[formControlName="${key}"]`
          );

          if (invalidField) {
            alert(`Invalid field: ${fullKey}`);
            invalidField.focus();
          }
          return; // Stop searching after finding the first invalid field
        }
      }
    };

    findInvalidControl(formGroup);
  }
  updatePRStatus(info:{status:string,id:number}){
    
    this.apiService.putData(`PurchaseRequisition/UpdatePRStatus?prId=${info.id}&prStatus=${info.status}&userId=${this.userDetails?.userId}`,{}).subscribe((res:any)=>{
       console.log(res,'update PR')
      if(!res)return;
    
    })
  }
  savePR() {
    this.focusOnFirstInvalidField();
    if (!this.PR_form.valid) {
      return
    };
    let apiData = new FormData();
    let data = this.PR_form.value;
    let purchaseRequisitionInfo  = this.PR_form.get('purchaseRequisitionInfo')?.getRawValue();
    let prItems = this.PR_form.get('prItemsSection')?.getRawValue();
    // let purchaseRequisitionInfo=data.purchaseRequisitionInfo;
    let docArray = this.getDocumentsArray() as FormArray;
    let prDocs = data.prDocumentSection.map((doc: any, index: number) => {
      let docM = doc;
      delete docM.documentName;
      let docment = docArray.at(index);
      let files = docment.get('upload')?.value || [];
      if (files[0])
        apiData.append('Files', files[0]);
      // else  document.querySelector('prDoc_'+index)?.animate()
      return docM;
    });

    data = {
      ...data,
      prItemsSection: prItems,
      prDocumentSection: prDocs,
      purchaseRequisitionInfo,
    };
    console.log(apiData.getAll('Files'));

    apiData.append('PurchaseRequisition', JSON.stringify(data));
    // return;
    this.apiService.savePR(apiData).subscribe((res: any) => {
      if (res['success']) {
        this.adminService.showMessage(
          'Purchase Requisition saved successfully'
        );
        this.PR_form.get('purchaseRequisitionInfo.purchaseRequisitionInfoID')?.setValue(res.saveId);
        this.PR_form.get('purchaseRequisitionInfo.refNo')?.setValue(res.data);
        this.PR_form.disable();
        this.PR_buttonsControl.prWf.disabled=false;
        

        // this.createPRForm();
      }
    });
  }
  //get and save

  //add supplier list

  getAssignSupplierFormArray(): any {
    return (
      (this.PR_form.get('prAssignSupplier') as FormArray) || new FormArray([])
    );
  }

  addSuplierLovs = {};
  removeSupplier(index: number, isForm: boolean = false, fromGrp = false) {
    if (!isForm) this.selectedSuppliers.splice(index, 1);
    else {
      let formArray = this.getAssignSupplierFormArray() as FormArray;
      formArray.length == 1 && index == 0
        ? this.adminService.showMessage('Can not remove last supplier')
        : formArray.removeAt(index);
    }
  }
  addSuppliersToForm() {
    let fa = this.getAssignSupplierFormArray() as FormArray;
    let assignedSuppliers = fa.value || [];
    if (assignedSuppliers[0] && !assignedSuppliers[0]['supplierName']) {
      fa.clear();
    }
    let existSuppliers = assignedSuppliers.map(
      (supplier: any) => supplier.supplierId
    );
    this.selectedSuppliers.forEach((suppier: any) => {
      let supplierGrp = this.getAssignSupplierGroup(suppier);
      fa.push(supplierGrp);
    });
    this.dialogClose();
  };
  addSelectedItems(){
    let itemGrpArr = this.getItems() as FormArray;
   let  existItems = itemGrpArr?.value;
   if (existItems[0] && !existItems[0]['code']) {
    itemGrpArr.clear();
  }
  this.selectedItems.forEach(item=>{
    let itemGrp = this.getItemsFormGroup();
    itemGrp = this.onItemGrpChange(itemGrp,item)
    itemGrpArr.push(itemGrp);
  });
  this.dialogClose();

  }
  removeSelectedItem(itemIndex:number){
  this.selectedItems.splice(itemIndex,1);
  }
  searchSuppliers(value: string, keyName: 'supplierCode' | 'supplierName' | 'grade') {
    let searchData = {
      supplierCode: '',
      supplierName: '',
      grade: ''
    }
    searchData[keyName] = value;
    this.getSuplliers(true, searchData)
    // this.searchSignal.set(searchData);

  }
  getAllLovsForAddSupplier() { }

  getSuplliers(filter = false, formData?: any) {
    let baseUrl = `RFQ/GetAssignSupplierSearch`;
    let filterstring = ''
    if (formData?.supplierName) filterstring += `suppliername=${encodeURIComponent(formData?.supplierName)}&`;
    if (formData?.supplierCode) filterstring += `suppliercode=${encodeURIComponent(formData?.supplierCode)}&`;
    if (formData?.grade) filterstring += `grade=${encodeURIComponent(formData?.grade)}&`;
    if (filter) {
      baseUrl += `?${filterstring.slice(0, -1)}`;
    }
    this.apiService.getData(baseUrl).pipe(debounceTime(500)).subscribe(suppliersList => {
      console.log(suppliersList, 'supplierList');
      this.rowData = suppliersList;

    })

  }
  searchSignal = signal({ supplierCode: '', supplierName: '', grade: '' });
  selectedItems:any[]=[];
  itemsColumnDefs: ColDef[] = [
    {
      headerName: 'Serial #',
      valueGetter: (params: any) =>
        params.node ? params.node.rowIndex + 1 : null,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { headerName: 'Item Code', field: 'code' },
    { headerName: 'Item Description', field: 'description' },
    {
      headerName: 'Item Type',
      // valueGetter: (params) => params.data.supplierGrade || '',
      field: 'typeId'
    },
    { headerName: 'UOM', field: 'uomId' },
  ];
  additemDialog() {  
    this.dialog.open(this.popupTemplate, {
        disableClose: true,
        hasBackdrop: true,
        backdropClass: '',
        autoFocus: true,
        width: '75%',
        height: '80%',
        position: {
          top: 'calc(3vw + 20px)',
          bottom: '',
          left: '',
          right: ''
        },
        panelClass: 'popUpMiddle',
      });
    }
  addSupplierPopup() {
    this.selectedSuppliers = [];
    this.dialog.open(this.addSupplier, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '80%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: '',
      },
      panelClass: 'popUpMiddle',
    });
    this.getSuplliers();
    //   effect(() => {
    //   const supplier = this.searchSignal();
    //   if (supplier.grade || supplier.supplierCode||supplier.supplierName){
    //     this.getSuplliers(true,supplier);
    //   }
    // })
    // this.suppliersListGrid.rowSelection
  }


  //add supplier list
  modules = [ClientSideRowModelModule];

  columnDefs: ColDef[] = [
    {
      headerName: 'Serial #',
      valueGetter: (params: any) =>
        params.node ? params.node.rowIndex + 1 : null,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { headerName: 'Code', field: 'supplierRefNo' },
    { headerName: 'Name', field: 'supplierName' },
    {
      headerName: 'Grade',
      valueGetter: (params) => params.data.supplierGrade || '',
    },
    { headerName: 'Status', field: 'status' },
  ];

  rowData: any = []

  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector = [5, 10, 25];

  selectedSuppliers:
    {
      supplierRefNo: string;
      supplierName: string;
      status: string;
      supplierGrade: string;
    }[] = [];

  onSelectionChanged(event: any) {
    this.selectedSuppliers = event.api.getSelectedRows();
    console.log('Selected rows:');
  }
  onItemSelectionChanged(event: any) {
    this.selectedItems = event.api.getSelectedRows();
    console.log('Selected rows:');
  }


  mockDoclist = [
    { documentID: 1, documentName: 'Owner-Passport' },
    { documentID: 2, documentName: 'Owner-Visa' },
    { documentID: 3, documentName: 'POA-Passport' },
    { documentID: 4, documentName: 'Quality Policy and Certificate' },
    {
      documentID: 5,
      documentName: 'Audited Financial Statement for last 3 years',
    },
    { documentID: 6, documentName: 'Contract SRC' },
    { documentID: 7, documentName: 'Power of Attorney (POA)' },
    { documentID: 8, documentName: 'Code of Conduct' },
    { documentID: 9, documentName: 'VAT Certificate' },
    {
      documentID: 10,
      documentName: 'ISO 14001 Environmental Management system',
    },
  ];
  // mockEntityList = [
  //   {
  //     companyId: 3,
  //     companyName: 'Krya-child',
  //     entityTypeId: null,
  //     entityTypeName: null,
  //   },
  //   {
  //     companyId: 4,
  //     companyName: 'Child code name',
  //     entityTypeId: null,
  //     entityTypeName: null,
  //   },
  // ];
  mockAssignedBuyer = [
    { userId: 1, userName: 'Admin' },
    { userId: 3, userName: 'jason' },
    { userId: 5, userName: 'Buyer' },
  ];
  mockHierarchy = [
    {
      hierarchyId: 5,
      entityId: 3,
      levelDefId: 1,
      levelDefName: 'Department',
      levelValueCode: '001',
      levelValueName: 'HR',
      department: null,
      section: null,
      project: null,
      active: false,
    },
    {
      hierarchyId: 8,
      entityId: 3,
      levelDefId: 1,
      levelDefName: 'Department',
      levelValueCode: '002',
      levelValueName: 'IT',
      department: null,
      section: null,
      project: null,
      active: false,
    },
    {
      hierarchyId: 7,
      entityId: 3,
      levelDefId: 2,
      levelDefName: 'Section',
      levelValueCode: '001',
      levelValueName: 'Recruiter',
      department: '001',
      section: null,
      project: null,
      active: false,
    },
    {
      hierarchyId: 10,
      entityId: 3,
      levelDefId: 2,
      levelDefName: 'Section',
      levelValueCode: '002',
      levelValueName: 'Software',
      department: '002',
      section: null,
      project: null,
      active: false,
    },

    {
      hierarchyId: 9,
      entityId: 3,
      levelDefId: 3,
      levelDefName: 'Project',
      levelValueCode: '001',
      levelValueName: 'AR Assistant',
      department: '001',
      section: '001',
      project: null,
      active: false,
    },
    {
      hierarchyId: 9,
      entityId: 3,
      levelDefId: 3,
      levelDefName: 'Project',
      levelValueCode: '004',
      levelValueName: 'AR Assistant Manger',
      department: '001',
      section: '001',
      project: null,
      active: false,
    },
    {
      hierarchyId: 20,
      entityId: 3,
      levelDefId: 3,
      levelDefName: 'Project',
      levelValueCode: '002',
      levelValueName: 'Architect',
      department: '002',
      section: '002',
      project: null,
      active: false,
    },
    {
      hierarchyId: 9,
      entityId: 3,
      levelDefId: 4,
      levelDefName: 'Role',
      levelValueCode: '001',
      levelValueName: 'Executive',
      department: '001',
      section: '001',
      project: '001',
      active: false,
    },
    {
      hierarchyId: 9,
      entityId: 3,
      levelDefId: 4,
      levelDefName: 'project',
      levelValueCode: '003',
      levelValueName: 'Executive SR',
      department: '001',
      section: '001',
      project: '004',
      active: false,
    },
    {
      hierarchyId: 20,
      entityId: 3,
      levelDefId: 4,
      levelDefName: 'Role',
      levelValueCode: '002',
      levelValueName: 'TL',
      department: '002',
      section: '002',
      project: '002',
      active: false,
    },
  ];
  mockSource = [
    { sourceName: 'ERP System', sourceID: 1 },
    { sourceName: 'Direct', sourceID: 2 },
    { sourceName: 'Mat Request', sourceID: 3 },
    { sourceName: 'Auto-Requisition', sourceID: 4 },
  ];
  mockItemListIndex = [0, 1, 2, 3, 4];
  mockItemList = [
    {
      itemHeaderId: 1,
      code: 'Jason1234',
      inventryItemUOM: {
        itemUOMId: 3,
        primaryUOMType: 'Dozens',
      },
      itemType: {
        itemTypeId: null,
        itemType: 'Not Specified',
      },
      description: 'Testing',
      spendCategory: {
        parentCategoryId: 10,
        subCategoryId: 20,
        childCategoryId: 28,
      },
    },
  ];

  mockPurchaseClassificationList = [
    {
      purchaseClassificationID: 1,
      purchaseClassificationName: 'General',
    },
  ];
  mockCurrency = [
    {
      currencyId: 1,
      countryId: 1,
      currencyName: 'USD',
    },
    {
      currencyId: 2,
      countryId: 1,
      currencyName: 'IND',
    },
  ]

  //Process workflow
  readonly wfStatusPanel = signal(true);
  readonly wfDetailsPanel = signal(true);
  isOpen: boolean = true;
  checkIfWFLevelAvialbale: any;
  wfDetailsComments = '';
  WorkFlowStatusForLevelWise = WorkFlowStatusForLevelWise;
  showReqInfoTabs: boolean = false;
  workFlowRowData = [];
  // pagination = true;
  // paginationPageSize = 5;
  // paginationPageSizeSelector = [5, 10, 25];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }
  //Ag grid data's for Workflow status
    public theme = themeBalham;
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
  //Update work flow details
  updateWFStatus(action: any, wfDet: any) {
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
        // let elmObj = {
        //   supId: this.supplierId,
        //   status: action === WorkFlowStatusForLevelWise.LEVELREJECTED ? WorkFlowStatusConstants.WFREJECTED : WorkFlowStatusConstants.WFREQINFO,
        //   userId: this.userId
        // }
        // if (action === WorkFlowStatusForLevelWise.LEVELAPPROVED) {
        this.adminService.showMessage(`WorkFlow ${action} successfully`);
        // this.historyStatusAPICheckFlag = true;
        // this.revokeWFFlag;
        // this.updateFlag;
        this.getWFStatus();
        this.checkWFLevelAvailable();
        // }
      }
    })
  }
  getWFStatus() {
    this.wfService.getSupplierWorkflowStatusApi(this.PR_form.get('purchaseRequisitionInfo.purchaseRequisitionInfoID')?.value, WorkFlowScreenConstants.PR).subscribe({
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
checkAndChangeStatus(wfData:any){
//   {
//     "workflowTransId": 140,
//     "workflowConfigId": 5,
//     "keyValueId": 1,
//     "keyValue": "PR-1",
//     "screenName": "Purchase Requisition",
//     "activityType": "Purchase Requisition",
//     "wfLevel": "L1",
//     "wfRole": "End User",
//     "participantType": "Specific Role",
//     "assignedUserId": 5,
//     "assignedToUserId": 118,
//     "assignedUser": "B, Manoj",
//     "assignedToUser": "Officer, Proc",
//     "actionDate": "2025-04-02T09:21:30.862865",
//     "actionTaken": "Approved",
//     "comments": "approved",
//     "estimatedDateOfCompletion": null,
//     "checkedAll": false,
//     "onlyApprove": true,
//     "onlyReqInfo": false,
//     "onlyReject": false,
//     "active": false,
//     "deleteFlag": false,
//     "createdUserId": 0,
//     "orderBy": 1,
//     "showWfLevel": true
// }
let isGetapproved = true;
let keyValueId =0;
let levelsAction=wfData.map((wf:any)=>{
   if(wf.actionTaken!=WorkFlowStatusConstants.WFAPPROVED)isGetapproved =false;
   keyValueId=wf.keyValueId;
  return wf.actionTaken;
});
if(keyValueId==0)return;
let wfUpdate={status:this.prStatus.WFINITIATED,id:keyValueId}
if(levelsAction.includes(WorkFlowStatusForLevelWise.LEVELREJECTED)){
  wfUpdate.status=this.prStatus.WFREJECTED;
}else if(levelsAction.includes(WorkFlowStatusForLevelWise.LEVELREQFORINFO)){
  wfUpdate.status=this.prStatus.WFREQINFO;
}else if(isGetapproved){
  wfUpdate.status=this.prStatus.WFAPPROVED;
}
this.updatePRStatus(wfUpdate);

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
        supplierDet: {supplierId: this.PR_form.get('purchaseRequisitionInfo.purchaseRequisitionInfoID')?.value},
        screenName: WorkFlowScreenConstants.PR
      },
    });
  }
  // WF details reject verify popup
  rejectVerifyPopup(wfHistory: any) {
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
        this.updateWFStatus(WorkFlowStatusForLevelWise.LEVELREJECTED, wfHistory);
      }
    })
  }
  checkWFLevelAvailable() {

    this.wfService.getWorkflowApi(this.userDetails.userId).subscribe({
      next: (data) => {
        this.checkIfWFLevelAvialbale = data;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }
  processApproval() {
    let details = {
      supplierRefNo: this.PR_form.get('purchaseRequisitionInfo.refNo')?.value,
      entityId: this.PR_form.get('purchaseRequisitionInfo.level1ID')?.value,
      supplierId: this.PR_form.get('purchaseRequisitionInfo.purchaseRequisitionInfoID')?.value
    }
    console.log(details, 'workflo')
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
        supplierDet: details,
        screenId: 4
      },
      panelClass: 'popUpMiddle',
    });
    closedialog.afterClosed().subscribe(result => {
      if (result === true) {
 this.updatePRStatus({id:this.PR_form.get('purchaseRequisitionInfo.purchaseRequisitionInfoID')?.value,status:this.prStatus.WFINITIATED})
      }
    })
  }

  //Get supplier Details
  getSupplierDetails() {
    let supplierId = this.commonService.SupplierId;
    this.supplierAttact.getSupplierDetails(supplierId).subscribe(res => {
      if (res) {
        this.SupDetails = res;
      }
    })
  }
  mockEntityList= [
    {
      "entityId": 1,
      "entityCode": "1000",
      "companyName": "Krya",
      "level1LabelName": null,
      "level1EntityData": [],
      "level2LabelName": null,
      "level2EntityData": [],
      "level3LabelName": null,
      "level3EntityData": [],
      "level4LabelName": null,
      "level4EntityData": []
    },
    {
      "entityId": 2,
      "entityCode": "1000",
      "companyName": "Krya-Virtual",
      "level1LabelName": null,
      "level1EntityData": [],
      "level2LabelName": null,
      "level2EntityData": [],
      "level3LabelName": null,
      "level3EntityData": [],
      "level4LabelName": null,
      "level4EntityData": []
    },
    {
      "entityId": 3,
      "entityCode": "1000",
      "companyName": "KRYA CHILD 1",
      "level1LabelName": null,
      "level1EntityData": [
        {
          "levelHierarchyId": 5,
          "entityId": 3,
          "levelDefId": 1,
          "levelValueCode": "001",
          "levelValueName": "HR",
          "levelValueFilter": null
        },
        {
          "levelHierarchyId": 8,
          "entityId": 3,
          "levelDefId": 1,
          "levelValueCode": "002",
          "levelValueName": "IT",
          "levelValueFilter": null
        },
        {
          "levelHierarchyId": 13,
          "entityId": 3,
          "levelDefId": 1,
          "levelValueCode": "10001",
          "levelValueName": "HR",
          "levelValueFilter": null
        }
      ],
      "level2LabelName": null,
      "level2EntityData": [
        {
          "levelHierarchyId": 7,
          "entityId": 3,
          "levelDefId": 2,
          "levelValueCode": "001",
          "levelValueName": "Recruiter",
          "levelValueFilter": "001"
        },
        {
          "levelHierarchyId": 10,
          "entityId": 3,
          "levelDefId": 2,
          "levelValueCode": "Software",
          "levelValueName": "9138",
          "levelValueFilter": "002"
        }
      ],
      "level3LabelName": null,
      "level3EntityData": [
        {
          "levelHierarchyId": 9,
          "entityId": 3,
          "levelDefId": 3,
          "levelValueCode": "1873",
          "levelValueName": "AR Assistant",
          "levelValueFilter": "001"
        },
        {
          "levelHierarchyId": 14,
          "entityId": 3,
          "levelDefId": 3,
          "levelValueCode": "122",
          "levelValueName": "Projects",
          "levelValueFilter": "001"
        }
      ],
      "level4LabelName": null,
      "level4EntityData": [
        {
          "levelHierarchyId": 15,
          "entityId": 3,
          "levelDefId": 4,
          "levelValueCode": "555",
          "levelValueName": "TEST LAST",
          "levelValueFilter": "1873"
        }
      ]
    },
    {
      "entityId": 4,
      "entityCode": "Child code 001",
      "companyName": "KRYA CHILD 2",
      "level1LabelName": null,
      "level1EntityData": [],
      "level2LabelName": null,
      "level2EntityData": [],
      "level3LabelName": null,
      "level3EntityData": [],
      "level4LabelName": null,
      "level4EntityData": []
    },
    {
      "entityId": 5,
      "entityCode": "908",
      "companyName": "KRYA CHILD 3",
      "level1LabelName": null,
      "level1EntityData": [],
      "level2LabelName": null,
      "level2EntityData": [],
      "level3LabelName": null,
      "level3EntityData": [],
      "level4LabelName": null,
      "level4EntityData": []
    },
    {
      "entityId": 6,
      "entityCode": "001",
      "companyName": "A-Check",
      "level1LabelName": null,
      "level1EntityData": [],
      "level2LabelName": null,
      "level2EntityData": [],
      "level3LabelName": null,
      "level3EntityData": [],
      "level4LabelName": null,
      "level4EntityData": []
    },
    {
      "entityId": 7,
      "entityCode": "001",
      "companyName": "LOG",
      "level1LabelName": null,
      "level1EntityData": [],
      "level2LabelName": null,
      "level2EntityData": [],
      "level3LabelName": null,
      "level3EntityData": [],
      "level4LabelName": null,
      "level4EntityData": []
    },
    {
      "entityId": 8,
      "entityCode": "Acheck001",
      "companyName": "Acheck Entity",
      "level1LabelName": null,
      "level1EntityData": [
        {
          "levelHierarchyId": 11,
          "entityId": 8,
          "levelDefId": 1,
          "levelValueCode": "001",
          "levelValueName": "Coromandal",
          "levelValueFilter": null
        }
      ],
      "level2LabelName": null,
      "level2EntityData": [
        {
          "levelHierarchyId": 12,
          "entityId": 8,
          "levelDefId": 2,
          "levelValueCode": "Code1",
          "levelValueName": "second level",
          "levelValueFilter": "001"
        }
      ],
      "level3LabelName": null,
      "level3EntityData": [],
      "level4LabelName": null,
      "level4EntityData": []
    }
  ]
}


