import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output, signal, ViewChild, viewChild } from '@angular/core';
import { DialogSeekClarificationComponent } from '../../dialogs/dialog-seek-clarification/dialog-seek-clarification.component';
import { DialogSupplierManualMapComponent } from '../../dialogs/dialog-supplier-manual-map/dialog-supplier-manual-map.component';
import { DialogSupplierAssignEntityComponent } from '../../dialogs/dialog-supplier-assign-entity/dialog-supplier-assign-entity.component';
import { CommonService } from '../../core/services/common.service';
import { MatAccordion, MatExpansionPanel,MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, NgControl, AbstractControl, FormControl } from '@angular/forms';
import { AdminService } from '../../core/services/admin/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLabel, MatFormField, MatError } from '@angular/material/form-field';
import { NgFor, NgIf, DecimalPipe, TitleCasePipe, DatePipe, NgClass } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { AllowNumberOnlyDirective } from '../../core/directives/allowNumberOnly.directive';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { CurrencyMaskDirective } from '../../core/directives/format-currency.directive';
import { MatButton } from '@angular/material/button';
import { DialogInitiateApprovalComponent } from '../../dialogs/dialog-initiate-approval/dialog-initiate-approval.component';
import { LoginService } from '../../core/services/login/login.service';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { themeBalham } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { DialogWfHistoryComponent } from '../dialog-wf-history/dialog-wf-history.component'
import { MatDialog } from '@angular/material/dialog';
import { WfRelatedService } from '../../core/services/workflow/wf-related.service';
import { TransactionTypeConstants } from '../../core/models/constants/transaction-type.constant';
import { WorkFlowScreenConstants, WorkFlowStatusConstants, WorkFlowStatusForLevelWise } from '../../core/models/constants/work-flow.constant';
import { BusinessRoleConstant } from '@app/core/models/constants/business-role.constant';
import { ConfirmationDialogComponent } from '@app/confirmation-dialog/confirmation-dialog.component';
import {TaxPayerComponent} from '../../dialogs/tax-payer/tax-payer.component'
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
    selector: 'app-pq-assesment-list',
    templateUrl: './pq-assesment-list.component.html',
    styleUrl: './pq-assesment-list.component.scss',
    standalone: true,
    imports: [MatLabel,AgGridAngular,FormsModule, ReactiveFormsModule, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader,MatExpansionPanelDescription, MatExpansionPanelTitle, NgFor,NgClass, MatFormField, MatInput, AllowNumberOnlyDirective, NgIf, MatSelect, MatTooltip, MatOption, MatError, MatCheckbox, CurrencyMaskDirective, MatButton, DecimalPipe, TitleCasePipe, DatePipe]
})
export class PqAssesmentListComponent implements OnInit, AfterViewInit {
  // colDefs: ColDef[] = [];
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector = [5, 10, 25];
  public theme = themeBalham;
  userName: string;
  isAccordionState: boolean = true;
  selectedOption = '1';
  previousTabClick: boolean = false;
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  @Output() tabValidCheckEmit = new EventEmitter();
  @Output() disableSaveAttachEmit = new EventEmitter<boolean>();
  @Input() supplierId: number;
  SupDetails: any;
  userData: any;
  SupCatDetails: any;
  // PQCategoryScore: any;
  // PQCompRepDetails: any;
  // PQCompScoreDetails: any;
  // ScoreCardMasDetail: any;
  // PQCategoryReponse: any;
  isOpen:boolean =true;
  accordion = viewChild.required(MatAccordion);
  readonly panelOpenStep1 = signal(true);
  readonly panelOpenStep2 = signal(true);
  readonly panelOpenStep3 = signal(true);
  readonly panelOpenStep4 = signal(true);
  readonly panelOpenStep5 = signal(true);
  readonly panelOpenStep6 = signal(true);
  readonly panelOpenStep7 = signal(true);
  supplierPQAssementFormList: FormGroup;
  Averagevalue: number;
  pqAssesmentRes: any;
  currency: any;
  workFlowHistory: any;
  seekClarifications: any;
  aggreCatScore: number = 0;
  aggregatedScore: number = 0;
  totalCategoryValue: number = 0;
  totalAggregateValue: number = 0;
  SupplierManagement: any;
  approvelHistory: any;
  roleList: any;
  roleName: any;
  approvalworkFlowHistory: any;
  approvalHistory: FormGroup;
  approvalList: { name: string; }[];
  systemParameter: any;
  loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);

  showReqInfoTabs : boolean = false;
  wfDetailsComments = "";
  getResponse = "";
  @Output() getButtonStatusFrom = new EventEmitter<string>();

  //Inject Wf API
  wfService = inject(WfRelatedService);
  notifiySupplier: boolean = false;
  wfStatusConstant = WorkFlowStatusConstants;
  WorkFlowStatusForLevelWise = WorkFlowStatusForLevelWise;
  isSaveAsDraftEnable: boolean = true; // true means it will not disable
  isSeekClarificationEnable: boolean = true; // false means it will disable
  isProcessWFEnable: boolean = false;  // true means it will not disable
  isNotifyEnable: boolean = false; // false means it will disable
  isAssignEntityEnable: boolean = false; // false means it will disable
  isMapErpEnable: boolean= false; // false means it will disable
  hideAllButtons: boolean = false;
  allLevelApproved: boolean = false;
  anyLevelRejected: boolean = false;
  checkIfWFLevelAvialbale: any =[];
  supplier: any;
  showAssignEntity: boolean = true;
  showMapErpBtn: boolean = true;
  getStoredEntityData: any;
  getAssignEntityList: any;
  getErpSupplier: any;

  constructor( public dialog: MatDialog,
    private commonService: CommonService,
    public adminService: AdminService,
    private supplierAttact: SupplierAttachmentService,
    public supplierUserFormService: SupplierUserFormService,
    private fb: FormBuilder,
    private loginservice: LoginService,
    public activateRouter: ActivatedRoute,
    private router : Router
  ) {
    this.supplierId = this.commonService.SupplierId;
    this.approvalHistory = this.fb.group({
      approvalArray: this.fb.array([])
    })
  }

  //Ag grid data's for Workflow status
  workFlowRowData = [];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }

  workFlowStatuscolDefs: ColDef[] = [
      { field: "wfLevel" , headerName:"WF Level", filter:false, floatingFilter:false },
      { field: "assignedToUser" , headerName:"Approver Name",
        cellRenderer: (params:any) => params.value ? params.value : "N/A",
      },
      { field: "wfRole" , headerName:"Approver Role",
        cellRenderer: (params:any) => params.value ? params.value : "N/A",
      },
      { field: "comments" , headerName:"Approver Comments",
        cellRenderer: (params:any) => params.value ? params.value : "N/A",
      },
      { field: "EstDate" , headerName:"Est. Complete Date",
        cellRenderer: (params:any) => params.value ? params.value : "N/A",
      },
      { field: "ActionDate" , headerName:"Action Date",
        cellRenderer: (params:any) => params.value ? params.value : "N/A",
      },
      { field: "actionTaken" , headerName:"Status" },
  ];

  @ViewChild('commentSection') commentSection :ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.approvalList = [
      { "name": "Approval" },
      { "name": "Reject" }
    ]
    this.activateRouter?.params?.subscribe((response) => {
      this.getResponse = response?.status;
      if (response?.id) {
        const storedData: any = localStorage.getItem('loginDetails');
        this.userData = JSON.parse(storedData);
        this.supplierId = response?.id;

      }
       else if (response?.status === 'In-Progress') {
        const storedData: any = localStorage.getItem('loginDetails');
        this.userData = JSON.parse(storedData);
        if (!this.commonService.isfromDashboard) {
          this.supplierId = storedData.supplierId;
        }
      } else if (response?.profile === 'manageprofile') {
        const storedData: any = localStorage.getItem('loginDetails');
        this.userData = JSON.parse(storedData);
        if (!this.commonService.isfromDashboard) {
          this.supplierId = storedData.supplierId;
        }
      } 
      else {
        const storedData: any = localStorage.getItem('loginDetails');
        this.userData = JSON.parse(storedData);
        if (!this.commonService.isfromDashboard) {
          this.supplierId = storedData.supplierId;
        }
      }

      //Workflow Related
      if(response?.status === 'workFlow'){
        this.getResponse = response?.status;
        const storedData: any = localStorage.getItem('loginDetails');
        this.userData = JSON.parse(storedData);
        // if (!this.commonService.isfromDashboard) {
        //   this.supplierId = storedData.supplierId;
        // }
        // this.supplierPQAssementFormList.get('supplierGradeSegmentation')?.disable();
        //   this.supplierPQAssementFormList.get('evaluationCategories')?.disable();
        //   this.supplierPQAssementFormList.get('supplierScores')?.disable();
        //   this.supplierPQAssementFormList.get('creditAssessment')?.disable();
        //   this.supplierPQAssementFormList.get('feeDetails')?.get('supplierName')?.disable();
        //   this.supplierPQAssementFormList.get('feeDetails')?.get('paymentStatus')?.disable();
      }

    })
    this.supplierUserFormService.GetSysParameterGeneral().subscribe(res => {
      if (res) {
        
        this.systemParameter = res;
      }
    })
    this.initializeForm();
    // this.getApprovalWFHistory();
    this.getSupplierCategoryDetails();
    this.getSupplierDetails();
    this.getAddressDetail()
    // this.GetPQCategoryScoreDetails();
    // this.GetPQCategoryReponseDetails();
    // this.GetScoreCardMasDetails();
    // this.GetPQComplianceScoreDetails();
    // this.GetPQComplianceReponseDetails();
    this.GetSupplierManagement();
    // this.getSupplierAprovlHistroy();
    this.getSeekClarification();
    this.getWFHistory();
    this.checkWFLevelAvailable();

    this.WFRelatedBtnCondition();
    if(this.userData?.businessRole === BusinessRoleConstant.PQREP){
      this.getSavedAssignEntityList();
      this.getAssignedEntityList();
    }
  }

  WFRelatedBtnCondition(){
    //While status is Under Review -> seekClarification, proccess WF, Save draft buttons should enabled
    if(this.getResponse === "Under Review"){
      if(this.getTotalScore() < this.SupplierManagement?.general?.minimumScoreToPQ){
        this.isSeekClarificationEnable = true;
        this.isNotifyEnable = false;
        this.isSaveAsDraftEnable = false;
        this.isProcessWFEnable = false;
        this.isAssignEntityEnable = false;
        this.isMapErpEnable = false;
      }else{
      this.isSeekClarificationEnable = true;
      this.isNotifyEnable = false;
      this.isSaveAsDraftEnable = true;
      this.isProcessWFEnable = false
      this.isAssignEntityEnable = false;
      this.isMapErpEnable = false;
      }
    }
    // while status is initiated all button should be disabled
    else if(this.getResponse === WorkFlowStatusConstants.WFINITIATED){
      this.getClearBtn();
    }
    // while status is Rejected -> only Notify button should be enabled
    else if(this.getResponse === WorkFlowStatusConstants.WFREJECTED){
      if(this.getTotalScore() < this.SupplierManagement?.general?.minimumScoreToPQ){
        this.isSeekClarificationEnable = true;
        this.isNotifyEnable = false;
        this.isSaveAsDraftEnable = false;
        this.isProcessWFEnable = false;
        this.isAssignEntityEnable = false;
        this.isMapErpEnable = false;
      }else{
      this.isSeekClarificationEnable = false;
      this.isNotifyEnable = true;
      this.isSaveAsDraftEnable = false;
      this.isProcessWFEnable = false
      this.isAssignEntityEnable = false;
      this.isMapErpEnable = false;

      this.anyLevelRejected = true;
      }
    }
    // while status is Request For Info -> seekClarification, proccess WF, Notify button should be enabled
    else if(this.getResponse === WorkFlowStatusConstants.WFREQINFO){
      if(this.getTotalScore() < this.SupplierManagement?.general?.minimumScoreToPQ){
        this.isSeekClarificationEnable = true;
        this.isNotifyEnable = false;
        this.isSaveAsDraftEnable = false;
        this.isProcessWFEnable = false;
        this.isAssignEntityEnable = false;
        this.isMapErpEnable = false;
      }else{
      this.isSeekClarificationEnable = true;
      this.isNotifyEnable = false;
      this.isSaveAsDraftEnable = true;
      this.isProcessWFEnable = true
      this.isAssignEntityEnable = false;
      this.isMapErpEnable = false;
      }
    }
    // while status is Approved -> first check Assign entity datas 
    else if(this.getResponse === WorkFlowStatusConstants.WFAPPROVED){
      if(this.getTotalScore() < this.SupplierManagement?.general?.minimumScoreToPQ){
        this.isSeekClarificationEnable = true;
        this.isNotifyEnable = false;
        this.isSaveAsDraftEnable = false;
        this.isProcessWFEnable = false;
        this.isAssignEntityEnable = false;
        this.isMapErpEnable = false;
      }else{
      this.isSeekClarificationEnable = false;
      this.isNotifyEnable = false; // change after enable MAP ERP and Assigned Entity
      this.isSaveAsDraftEnable = false;
      this.isProcessWFEnable = false
      this.isAssignEntityEnable = false;
      this.isMapErpEnable = false;
      this.allLevelApproved = true; // boolean for all level approved
      }

      if(this.userData?.businessRole === BusinessRoleConstant.PQREP){
        //If Assign entity and Map ERP button is not there
        if(!this.showAssignEntity && !this.showMapErpBtn){
          this.isNotifyEnable = true;
        }
        //check need to show Assign entity
        if(this.showAssignEntity){
          this.isAssignEntityEnable = true;
        }
        //Check if Assign entity is already assigned
        if(this.getStoredEntityData?.length > 0){
          // check show mapp erp need
          if(this.showMapErpBtn){
            this.isMapErpEnable = true;
            this.isNotifyEnable = true; // AS of now enable Notify
          }else{
            this.isMapErpEnable = false;
            this.isNotifyEnable = true;
          }
        }

        if(!this.showAssignEntity && this.showMapErpBtn){
          this.isMapErpEnable = true;
        }
      }else{

      }
    }
    else if(this.getResponse === "Requested Information" || this.getResponse === "Rejected" || this.getResponse === 'Active'){
      this.getClearBtn();
    }
  }

  getClearBtn(){
    if(this.getTotalScore() < this.SupplierManagement?.general?.minimumScoreToPQ){
      this.isSeekClarificationEnable = true;
      this.isNotifyEnable = false;
      this.isSaveAsDraftEnable = false;
      this.isProcessWFEnable = false;
      this.isAssignEntityEnable = false;
      this.isMapErpEnable = false;
    }else{
    this.isSeekClarificationEnable = false;
    this.isNotifyEnable = false;
    this.isSaveAsDraftEnable = false;
    this.isProcessWFEnable = false
    this.isAssignEntityEnable = false;
    this.isMapErpEnable = false;
    }
  }

  checkWFLevelAvailable(){
    this.wfService.getWorkflowApi(this.loggedUserDetails.userId).subscribe({
      next: (data) => {
        this.checkIfWFLevelAvialbale = data;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
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
        screenName : WorkFlowScreenConstants.PREQUALIFICATION
      },
    });
  }

  // private formatAndSetValue(data: string) {

  //   let value = data.replace(new RegExp(`[${this.systemParameter.digitGroupingsymb}]`, 'g'), '');
  
  //   // Ensure two decimal places
  //   const [integerPart, decimalPart] = value.split(`${this.systemParameter.decimalSymbol}`);

  //   if(this.systemParameter?.noOfDigitsAftDec === '3'){
  //     if (decimalPart && decimalPart.length > 3) {
  //       value = `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart.substring(0, 3)}`;
  //     }
  //   }else if(this.systemParameter?.noOfDigitsAftDec === '2'){
  //   if (decimalPart && decimalPart.length > 2) {
  //     value = `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart.substring(0, 2)}`;
  //   }
  //   }else if(this.systemParameter?.noOfDigitsAftDec === '1'){
  //     if (decimalPart && decimalPart.length > 1) {
  //       value = `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart.substring(0, 1)}`;
  //     }
  //   }else if(this.systemParameter?.noOfDigitsAftDec === '0'){
  //       value = `${integerPart}`
  //   }
    
  //   if (this.systemParameter?.digitGrouping === '12,34,56,789') {
  //     value = this.formatIndianNumber(value);
  //   } else if (this.systemParameter?.digitGrouping === '123,456,789') {
  //     value = this.formatWesternNumber(value);
  //   } else if (this.systemParameter?.digitGrouping === '123456,789') {
  //     value = this.formatCustomNumber(value);
  //   }else{
  //     value = value;
  //   }
    
  //   return value;
  // }

  // private formatIndianNumber(value: string): string {
  //   if (!value) return '';
  //   const groupingSymbol = this.systemParameter.digitGroupingsymb || ',';
  //   let [integerPart, decimalPart] = value.split(`${this.systemParameter.decimalSymbol}`);
  //   integerPart = integerPart.replace(/(\d+)(\d{3})$/, (match, p1, p2) => {
  //     return p1.replace(/\B(?=(\d{2})+(?!\d))/g, groupingSymbol) + groupingSymbol + p2;
  //   });
  //   return decimalPart !== undefined ? `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart}` : integerPart;
  // }

  // private formatWesternNumber(value: string): string {
  //   if (!value) return '';
  //   return value.replace(/\B(?=(\d{3})+(?!\d))/g, `${this.systemParameter.digitGroupingsymb}`);
  // }

  // private formatCustomNumber(value: string): string {
  //   if (!value) return '';
  //   const groupingSymbol = this.systemParameter?.digitGroupingsymb || ',';
  //   value = value.replace(new RegExp(`[${groupingSymbol}]`, 'g'), '');
  //   let [integerPart, decimalPart] = value.split(this.systemParameter?.decimalSymbol || '.');
  //   integerPart = integerPart.replace(/(\d+)(\d{3})$/, (_, p1, p2) => {
  //     return p1 + groupingSymbol + p2;
  //   });
  //   return decimalPart !== undefined ? `${integerPart}${this.systemParameter?.decimalSymbol}${decimalPart}` : integerPart;
  // }
  taxPayer(){
            this.dialog.open(TaxPayerComponent, {
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
                supplierId: this.supplierId,
              },
            });
          }
  getRole() {
    this.commonService.getUserRole().subscribe((result: any) => {
      if (result) {
        const storedData: any = localStorage.getItem('loginDetails');
        const roleList = result.filter((role: { roleId: any; }) => role?.roleId === JSON.parse(storedData)?.workflowRoleId);
        this.roleName = roleList[0]?.roleName;
      }
    })
  }

  ngAfterViewInit(): void {
    if(this.getResponse === 'workFlow'){
      this.commentSection.nativeElement.scrollIntoView();
    }
  }

  GetSupplierManagement() {
    this.supplierUserFormService.GetSupplierManagement().subscribe(res => {
      if (res != null) {
        this.SupplierManagement = res;
        if(!this.SupplierManagement?.general?.allowManualMapping){
          this.isMapErpEnable = false;
          this.showMapErpBtn = false;
        }
      }
    })
  }

  getAddressDetail() {
    this.supplierUserFormService.getAddressDetails(this.supplierId).subscribe((res1: any) => {
      if (res1) {
        this.loginservice.GetCurrencyDetails()
          .subscribe({
            next: (res: any) => {
              this.currency = res.find((c: { countryId: any; }) => c?.countryId === res1[0]?.countryId);
            }, error: (error: any) => this.adminService.showMessage(error),
            complete: () => { }
          });
      }
    })
  }

  // getSupplierAprovlHistroy() {
  //   this.supplierAttact.GetApprovelHistory(this.supplierId).subscribe((res: any) => {
  //     this.approvelHistory = res;
  //   })
  // }

  getProcessedText(): string {
    return this.currency?.currencyName.substring(0, 3); // Get the first three characters
  }

  initializeForm() {
    this.supplierPQAssementFormList = this.fb.group({
      supplierId: [0],
      evaluationCategories: this.fb.array([]),
      supplierScores: this.fb.array([]),
      supplierGradeSegmentation: this.fb.group({
        supplierGrade: [null, Validators.required],
        segment1: [''],
        segment2: [''],
        segment3: [''],
        segment4: [''],
        notToInviteForTender: [false],
        notToRemindForCommercialLicenseExpiry: [false]
      }),
      creditAssessment: this.fb.array([]),
      feeDetails: this.fb.group({
        supplierName: [''],
        paymentStatus: ['']
      })
    });
  }

  getSupplierCategoryDetails() {
    this.supplierAttact.GetSupplierPQAssessment(this.supplierId).subscribe((res1: any) => {
      let staticObject = {
        "scoreID": 9,
        "evaluationCriteria": "Average Category Score",
        "weightage": 10,
        "assignedScore": 100,
        "givenScore": 20,
        "qualitativeFlag": true,
        "qualitativeResponse": null
    };
      this.pqAssesmentRes = res1;
      //Check already data is saved
      if(this.pqAssesmentRes?.supplierGradeSegmentation !==null && (this.getResponse === WorkFlowStatusConstants.WFREQINFO || this.getResponse ==='Under Review')){
        this.isProcessWFEnable = true;
      }
      const res = {
        supplierId: res1?.supplierId || 0,
        evaluationCategories: res1?.evaluationCategories || [],
        supplierScores: res1?.supplierScores || [],
        supplierGradeSegmentation: res1?.supplierGradeSegmentation || {
          segmentationID: null,
          supplierGrade: [null, Validators.required],
          segment1: '',
          segment2: '',
          segment3: '',
          segment4: '',
          notToInviteForTender: false,
          notToRemindForCommercialLicenseExpiry: false
        },
        creditAssessment: res1?.creditAssessment || [],
        feeDetails: res1?.feeDetails || {
          feeID: null,
          supplierName: '',
          paymentStatus: ''
        }
      };

      // Patch form values
      this.supplierPQAssementFormList.patchValue({
        supplierId: res.supplierId,
        supplierGradeSegmentation: res.supplierGradeSegmentation,
        feeDetails: res.feeDetails
      });

      // Populate evaluationCategories
      const evaluationCategories = this.supplierPQAssementFormList.get('evaluationCategories') as FormArray;
      evaluationCategories.clear();
      res.evaluationCategories.forEach((category: any) => {
        evaluationCategories.push(this.fb.group({
          categoryID: [category.categoryID || null],
          spendParentCategory: [category.spendParentCategory || ''],
          spendSubCategory: [category.spendSubCategory || ''],
          spendChildCategory: [category.spendChildCategory || ''],
          assignedScore: [100],
          qualitativeFlag: [this.SupplierManagement?.general?.qualitativeResponseBased || true],
          qualitativeResponse: [JSON.parse(category?.qualitativeResponse)],
          // score: [category.score || 0]
          score: [category?.score || null, Validators.required]

        }));
        this.totalCategoryValue = this.totalCategoryValue + 10;
        const totalScore = evaluationCategories.controls.reduce((total: number, group: any) => {
          const givenScore = group.get('score')?.value || null; // Get the 'givenScore' value, default to 0 if null/undefined
          return total + givenScore; // Accumulate the total
        }, 0);
        this.aggreCatScore = totalScore;
      });

      // this.calculateAverageScore();

      // Populate supplierScores
      const supplierScores = this.supplierPQAssementFormList.get('supplierScores') as FormArray;
      supplierScores.clear();
      res.supplierScores.forEach((score: any) => {
        supplierScores.push(this.fb.group({
          scoreID: [score.scoreID || null],
          evaluationCriteria: [score.evaluationCriteria || ''],
          weightage: [score.weightage || 0],
          assignedScore: [100],
          // givenScore: [score.givenScore || 0],
          givenScore: [score?.givenScore || null, Validators.required],
          qualitativeFlag: [this.SupplierManagement?.general?.qualitativeResponseBased || true],
          qualitativeResponse: [JSON.parse(score?.qualitativeResponse)],
          aggregatedScore: [score.aggregatedScore || 0]
        }));
        this.totalAggregateValue = this.totalAggregateValue + score.assignedScore;
        const totalGivenScore = supplierScores.controls.reduce((total: number, group: any) => {
          const givenScore = group.get('givenScore')?.value || null; // Get the 'givenScore' value, default to 0 if null/undefined
          return total + givenScore; // Accumulate the total
        }, 0);
        this.aggregatedScore = totalGivenScore;
      });

      // Populate creditAssessment
      const creditAssessment = this.supplierPQAssementFormList.get('creditAssessment') as FormArray;
      creditAssessment.clear();
      if (res.creditAssessment.length > 0) {
        res.creditAssessment.forEach((assessment: any) => {
        
          creditAssessment.push(this.fb.group({
            creditID: [assessment.creditID || null],
            description: [assessment.description || ''],
            currency: [assessment.currency || ''],
            requestedCreditLimit: [assessment.requestedCreditLimit || 0],
            requestedCreditExposureLimit: [assessment.requestedCreditExposureLimit || 0],
            requestedProjectLimit: [assessment.requestedProjectLimit || 0]
          }));
        });
      } else {
        creditAssessment.push(this.fb.group({
   
          description: [''],
          currency: [''],
          requestedCreditLimit: [null],
          requestedCreditExposureLimit: [null],
          requestedProjectLimit: [null]
        }));
      }

      if (this.userData?.businessRole === BusinessRoleConstant.PQREPAPRROVER) {
        // this.supplierPQAssementFormList.disable();
        this.supplierPQAssementFormList.get('supplierGradeSegmentation')?.disable();
        this.supplierPQAssementFormList.get('evaluationCategories')?.disable();
        this.supplierPQAssementFormList.get('supplierScores')?.disable();
        this.supplierPQAssementFormList.get('creditAssessment')?.disable();
        this.supplierPQAssementFormList.get('feeDetails')?.get('supplierName')?.disable();
        this.supplierPQAssementFormList.get('feeDetails')?.get('paymentStatus')?.disable();
  
        this.hideAllButtons = true;
      }
      else if (this.getResponse === 'workFlow' || this.getResponse === WorkFlowStatusConstants.WFINITIATED
        || this.getResponse === WorkFlowStatusConstants.WFREJECTED || this.getResponse === "Rejected"
        || this.getResponse === 'Active' || this.getResponse === WorkFlowStatusConstants.WFAPPROVED
      ) {
        this.supplierPQAssementFormList.get('supplierGradeSegmentation')?.disable();
        this.supplierPQAssementFormList.get('evaluationCategories')?.disable();
        this.supplierPQAssementFormList.get('supplierScores')?.disable();
        this.supplierPQAssementFormList.get('creditAssessment')?.disable();
        this.supplierPQAssementFormList.get('feeDetails')?.get('supplierName')?.disable();
        this.supplierPQAssementFormList.get('feeDetails')?.get('paymentStatus')?.disable();
      }
      else {
  
        if (!this.SupDetails?.creditLimit) {
          this.supplierPQAssementFormList.get('creditAssessment')?.disable();
        }
      }
    });
    this.getRole();

    

    // this.commonService.getUserRole().subscribe((result: any) => {
    //   if (result) {
    //     const storedData: any = localStorage.getItem('loginDetails');
    //     const roleList = result.filter((role: { roleId: any; }) => role?.roleId === JSON.parse(storedData)?.userType);

    //     if (roleList[0].roleName === 'PQ Rep') {
    //       this.supplierPQAssementFormList.get('supplierGradeSegmentation')?.disable();
    //       this.supplierPQAssementFormList.get('evaluationCategories')?.disable();
    //       this.supplierPQAssementFormList.get('supplierScores')?.disable();
    //       this.supplierPQAssementFormList.get('creditAssessment')?.disable();
    //       this.supplierPQAssementFormList.get('feeDetails')?.get('supplierName')?.disable();
    //       this.supplierPQAssementFormList.get('feeDetails')?.get('paymentStatus')?.disable();
    //     }
    //     else if(this.getResponse === 'workFlow'){
    //       this.supplierPQAssementFormList.get('supplierGradeSegmentation')?.disable();
    //       this.supplierPQAssementFormList.get('evaluationCategories')?.disable();
    //       this.supplierPQAssementFormList.get('supplierScores')?.disable();
    //       this.supplierPQAssementFormList.get('creditAssessment')?.disable();
    //       this.supplierPQAssementFormList.get('feeDetails')?.get('supplierName')?.disable();
    //       this.supplierPQAssementFormList.get('feeDetails')?.get('paymentStatus')?.disable();
    //     }
    //     else{
          
    //       if(!this.SupDetails?.creditLimit){
    //       this.supplierPQAssementFormList.get('creditAssessment')?.disable();
    //       }
    //     }
    //   }
    // })
  }

  getTotalScore(): number {
    return this.supplierScores.controls.reduce((sum, _, index): any => {
      return (Number(sum) + Number(this.getCalculatedScore(index) !== 'Infinity'? this.getCalculatedScore(index) : 0)).toFixed(2);
    }, 0);
  }

  calAvarageCategory(score: any, index: number) {
    const evaluationCategories = this.supplierPQAssementFormList.get('evaluationCategories') as FormArray;
    const scoresControl = evaluationCategories.at(index).get('score');
    const assignedScoreControl = evaluationCategories.at(index).get('assignedScore');

    if (assignedScoreControl?.value < scoresControl?.value) {
        this.adminService.showMessage(`Entered score is greater than the assigned score!`);
        scoresControl?.setValue(null);
    }

    this.aggreCatScore = 0;

    // ✅ Calculate aggregated score
    evaluationCategories.controls.forEach((item) => {
        this.aggreCatScore += Number(item.get('score')?.value || 0);
    });

    const evaluationCategoriesData = this.supplierPQAssementFormList.get('supplierScores') as FormArray;
    console.log('evaluationCategoriesData',evaluationCategoriesData);
    

    if (this.aggreCatScore > 0) {
        let avgCatValue = this.aggreCatScore / evaluationCategories.length;

        evaluationCategoriesData.controls.forEach((item) => {
            if (item.get('evaluationCriteria')?.value === 'Average Category Score') {
              item.get('givenScore')?.disable()
                item.get('givenScore')?.setValue(avgCatValue);
            }
        });
    } else {
        evaluationCategoriesData.controls.forEach((item) => {
            if (item.get('evaluationCriteria')?.value === 'Average Category Score') {
                item.get('givenScore')?.setValue(null);
            }
        });
    }

    // ✅ Ensure `givenScore` exists in all form controls
    // evaluationCategoriesData.controls.forEach((item) => {
    //     if (!item.get('givenScore')) {
    //         item.addControl('givenScore', new FormControl(''));  // Adding missing control
    //     }
    // });

    // ✅ Calculate the total score
    const totalGivenScore = evaluationCategoriesData.controls.reduce((total: number, group: AbstractControl) => {
        const givenScore = group.get('givenScore')?.value || 0;
        return total + givenScore;
    }, 0);

    this.aggregatedScore = totalGivenScore;
}


  calAggregateScore(score: any, index: number) {

    const evaluationCategories = this.supplierPQAssementFormList.get('supplierScores') as FormArray;
    const scores = evaluationCategories.at(index).get('givenScore')?.value;
    const assignedScore = evaluationCategories.at(index).get('assignedScore')?.value;

    if (assignedScore < scores) {
      this.adminService.showMessage(`Entered score is greater than the given score! `);
      evaluationCategories.at(index).get('givenScore')?.setValue(null);
      // return; 
    }

    this.aggregatedScore = 0;
    // let avgCatValue = 0;
    // // if (this.aggreCatScore > 0) {
    // //   avgCatValue = (this.aggreCatScore / 2);
    // // }
    evaluationCategories.controls.forEach(item => {

      this.aggregatedScore = (this.aggregatedScore + Number(item.get('givenScore')?.value));
      // if (item.evaluationCriteria === 'Category Average Score') {
      //   item.givenScore = avgCatValue;
      // }
    });

    if(this.getTotalScore() < this.SupplierManagement?.general?.minimumScoreToPQ){
      this.isSeekClarificationEnable = true;
      this.isNotifyEnable = false;
      this.isSaveAsDraftEnable = false;
      this.isProcessWFEnable = false;
      this.isAssignEntityEnable = false;
      this.isMapErpEnable = false;
    }else{
      this.isSeekClarificationEnable = true;
      this.isNotifyEnable = false;
      this.isSaveAsDraftEnable = true;
      this.isProcessWFEnable = false;
      this.isAssignEntityEnable = false;
      this.isMapErpEnable = false;
    }


    //this.aggregatedScore = (this.aggregatedScore + Number(score));
  }

  calculateAverageScore(): void {
    const evaluationCategories = this.supplierPQAssementFormList.get('evaluationCategories') as FormArray;
    const scores = evaluationCategories.controls
      .map(control => control.get('score')?.value)
      .filter(score => score !== null && score !== undefined && score !== ''); // Filter out null or empty scores

    const total = scores.reduce((sum, score) => sum + parseFloat(score), 0);
    this.Averagevalue = scores.length ? total / scores.length : 0; // Calculate average
  }

  // Helper to get FormArray controls
  get evaluationCategories() {
    return this.supplierPQAssementFormList.get('evaluationCategories') as FormArray;
  }

  get supplierScores() {
    return this.supplierPQAssementFormList.get('supplierScores') as FormArray;
  }

  get creditAssessment() {
    return this.supplierPQAssementFormList.get('creditAssessment') as FormArray;
  }


  // get evaluationCategorie(): FormArray {
  //   return this.supplierPQAssementForm.get('evaluationCategories') as FormArray;
  // }

  getWFHistory() {
    this.wfService.getSupplierWorkflowStatusApi(this.supplierId, WorkFlowScreenConstants.PREQUALIFICATION).subscribe({
      next: (data: any) => {
        // this.allLevelApproved = false;
        // this.anyLevelRejected = false;
        this.workFlowHistory = data;
        this.workFlowRowData = data;
        // if (data?.length > 0) {
        //   //Check whether all status is approved or not 
        //   const checkAllApproved = data.every((ele: any) => ele?.actionTaken === WorkFlowStatusForLevelWise.LEVELAPPROVED);
        //   if (checkAllApproved) {
        //     let elmObj = {
        //       supId: this.supplierId,
        //       status: WorkFlowStatusConstants.WFAPPROVED,
        //       userId: this.loggedUserDetails?.userId
        //     }
        //     this.wfService.updateApplicationStatus(elmObj).subscribe((res) => {
        //       if (res) {
        //         // this.router.navigate(['/krya/dashboard'], { skipLocationChange: true,  replaceUrl: true })
        //         // this.getWFHistory();
        //         // this.checkWFLevelAvailable();
        //       }
        //     }, err => {
        //       this.adminService.showMessage("Error while changing application status")
        //     })
        //   }
        // }
      },
      error: (err: any) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  getSeekClarification() {
    this.supplierAttact.GetSeekClariDetails(this.supplierId).subscribe({
      next: (data) => {
        //  this.workFlowHistory = data.workflowHistory;
        this.seekClarifications = data;

      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  getApprovalWFHistory(status: any, id: any) {
    this.supplierAttact.GetApprovalWorkFlowDetails(this.supplierId).subscribe({
      next: (data) => {
        this.approvalworkFlowHistory = data.workflowHistory;
        this.setApproval(data.workflowHistory, status, id);
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  get approvalArray(): FormArray {
    return this.approvalHistory.get('approvalArray') as FormArray;
  }

  setApproval(approvals: any, status: any, id: any) {
    const approvalFormArray = this.approvalHistory.get('approvalArray') as FormArray;
    
    approvals.forEach((approval: {
      assignedUser: any;
      workflowID: any;
      userId: any;
      actionDate: any;
      status: any;
      comments: any;
    }) => {
      const group = approvalFormArray.push(this.fb.group({
        supplierId: [Number(this.supplierId)],
        assignedUser: [approval?.assignedUser],
        workflowID: [approval?.workflowID],
        userId: [approval?.userId],
        actionDate: [approval?.actionDate],
        comments: [],
        status: [Number(id)]
      }));
    })

    this.approval(status);
  }

  stausChange(status: any, i: any) {
    this.approvalHistory.get('approvalArray')?.get('status')?.value;

  }

  SavePqAssesment() {

    if (this.pqAssesmentRes.supplierGradeSegmentation) {
      this.supplierPQAssementFormList.markAllAsTouched();
      if (this.supplierPQAssementFormList.valid) {
        const finalValue = this.supplierPQAssementFormList.value;

        if (finalValue.creditAssessment && Array.isArray(finalValue.creditAssessment)) {
          finalValue.creditAssessment.forEach((credit: any) => {
            console.log('credit',credit);
            
            if(credit?.requestedCreditExposureLimit){
              credit.requestedCreditExposureLimit = this.roundNumber(credit.requestedCreditExposureLimit);
            }
            if(credit?.requestedCreditLimit){
              credit.requestedCreditLimit = this.roundNumber(credit.requestedCreditLimit);
            }
            if(credit?.requestedProjectLimit){
              credit.requestedProjectLimit = this.roundNumber(credit.requestedProjectLimit)
            }
          })
        }

        // finalValue.feeDetails = {
        //   ...finalValue.feeDetails,
        //   supplierName: finalValue.feeDetails ? this.roundNumber(finalValue.feeDetails.supplierName) : ''
        // }

        
        this.supplierAttact.UpdateSupplierPQAssessment(finalValue).subscribe(res => {
          if (res) {
            this.getSupplierCategoryDetails();
            this.adminService.showMessage('All information entered on the form has been saved successfully');
          }
        })
      }
      else {
        this.adminService.showMessage('Please fill in all mandatory fields before save!.');
      }
    } else {
      this.supplierPQAssementFormList.markAllAsTouched();
      if (this.supplierPQAssementFormList.valid) {
        // const finalValue = this.supplierPQAssementFormList.value;

        const finalValue = {
          supplierId: this.supplierId, // Set appropriate supplierId
          evaluationCategories: this.supplierPQAssementFormList.value.evaluationCategories.map((item: { spendParentCategory: any; spendSubCategory: any; spendChildCategory: any; score: any; qualitativeFlag: any; qualitativeResponse: any; }) => ({
            spendParentCategory: item.spendParentCategory || '',
            spendSubCategory: item.spendSubCategory || '',
            spendChildCategory: item.spendChildCategory || '',
            score: Number(item.score) || null, // Ensure numeric conversion
            qualitativeFlag: item.qualitativeFlag ?? true,
            qualitativeResponse: item.qualitativeResponse ?? true
          })),
          supplierScores: this.supplierPQAssementFormList.value.supplierScores.map((item: { evaluationCriteria: any; weightage: any; assignedScore: any; givenScore: any; aggregatedScore: any; qualitativeFlag: any; qualitativeResponse: any; }) => ({
            evaluationCriteria: item.evaluationCriteria || '',
            weightage: Number(item.weightage) || 0,
            assignedScore: Number(item.assignedScore) || 0,
            givenScore: Number(item.givenScore) || null,
            aggregatedScore: Number(item.aggregatedScore) || 0,
            qualitativeFlag: item.qualitativeFlag ?? true,
            qualitativeResponse: item.qualitativeResponse ?? true
          })),
          supplierGradeSegmentation: this.supplierPQAssementFormList.get('supplierGradeSegmentation')?.value,
          creditAssessment: this.supplierPQAssementFormList.get('creditAssessment')?.value,
          feeDetails: this.supplierPQAssementFormList.get('feeDetails')?.value,
        };
        
        this.supplierAttact.SaveSupplierPQAssessment(finalValue).subscribe(res => {
          if (res) {
            this.getSupplierCategoryDetails();
            this.adminService.showMessage('Data on the form has been Save successfully');
          }
        })
      }
      else {
        this.adminService.showMessage('Please fill in all mandatory fields before save!.');
      }
    }
  }

  getSupplierDetails() {
    this.supplierAttact.getSupplierDetails(this.supplierId).subscribe(res => {
      if (res) {
        this.SupDetails = res;
        this.notifiySupplier = res?.notifySupplierFlag;
        if(res?.creditLimit){
          this.creditAssessment.get('requestedCreditLimit')?.disable();
        }
        
      }
    })

      this.commonService.getSupplier(this.supplierId).subscribe({
        next: (data) => {
          this.supplier = data;
        },
        error: (err) => {
          console.error('Error fetching supplier types', err);
        }
      });
  }

  // CODE COMMENTED BY JASON(UNWANTED CODE)
  // GetSupplierCategoryDetails(){
  //   this.supplierAttact.GetSupplierCategoryDetails(this.supplierId).subscribe(res => {
  //     if(res){
  //       this.SupCatDetails = res;
  //       this.InitSupPQForm();
  //     }
  //   })
  // }

  // GetPQCategoryScoreDetails() {
  //   this.supplierAttact.GetPQCategoryScoreDetails(this.supplierId).subscribe(res => {
  //     if (res) {
  //       this.PQCategoryScore = res;
  //     }
  //   })
  // }

  // GetPQCategoryReponseDetails() {
  //   this.supplierAttact.GetPQCategoryReponseDetails(this.supplierId).subscribe(res => {
  //     if (res) {
  //       this.PQCategoryReponse = res;
  //     }
  //   })
  // }

  // GetScoreCardMasDetails() {
  //   this.supplierAttact.GetScoreCardMasDetails().subscribe(res => {
  //     if (res) {
  //       this.ScoreCardMasDetail = res;
  //     }
  //   })
  // }

  // GetPQComplianceScoreDetails() {
  //   this.supplierAttact.GetPQComplianceScoreDetails(this.supplierId).subscribe(res => {
  //     if (res) {
  //       this.PQCompScoreDetails = res;
  //     }
  //   })
  // }

  // GetPQComplianceReponseDetails() {
  //   this.supplierAttact.GetPQComplianceReponseDetails(this.supplierId).subscribe(res => {
  //     if (res) {
  //       this.PQCompRepDetails = res;
  //     }
  //   })
  // }

  handleDialogResult(event: any) {

  }


  confirmatioPopUp(): void {
    let mandatoryFields: boolean = false;
    let optionalFields: boolean = false;
    // mandatoryFields = Object.values(this.mandatoryForm.controls).some(control => control.dirty || control.value);
    // if (this.optionalAttachFlag) {
    //   optionalFields = Object.values(this.optionalForm.controls).some(control => control.dirty || control.value);
    // }
    // if ((mandatoryFields && this.mandatoryForm.dirty) || (optionalFields && this.optionalForm.dirty)) {
    //   const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, this.commonService.dataLostModalConfig);
    //   cancelDialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       this.previousTabClick = true;
    //       this.savePQAttachments();
    //     } else {
    //       this.dialogResult.emit(true);
    //     }
    //   });
    // }
    // else {
    //   this.mandatoryForm.resetForm();
    //   if (this.optionalAttachFlag) {
    //     this.optionalForm.resetForm();
    //   }
    //   this.dialogResult.emit(true);
    // }  
  }

  approval(status: any) {
    const approval =
    {
      "workflowHistory": this.approvalHistory.get('approvalArray')?.value
    }
    this.supplierAttact.SaveApprovel(approval).subscribe({
      next: (data) => {
        if(status === 'Qualified'){
        this.adminService.showMessage('Approved successfully');
        }else if(status === 'Reject'){
          this.adminService.showMessage('Rejected successfully');
        }else if(status === 'Request for Information'){
          this.adminService.showMessage('Request for Information successfully');
        }
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  savePQAttachments(isNextClick: boolean = false) {
    if (isNextClick) {
      // if (!this.mandatoryForm.dirty || !this.optionalForm.dirty) {
      this.nextTabEmit.emit();
      return;
      // }
    }
    this.disableSaveAttachEmit.emit(true);

    if (isNextClick) {
      setTimeout(() => {
        this.nextTabEmit.emit();
      }, 1000);
    }
    if (this.previousTabClick) {
      setTimeout(() => {
        this.dialogResult.emit(true);
      }, 1000);
    }

  }

  getCalculatedScore(i: number): any {
    const assignedScore = this.supplierScores.at(i).get('assignedScore')?.value;
    const weightage = this.supplierScores.at(i).get('weightage')?.value;
    const givenScore = this.supplierScores.at(i).get('givenScore')?.value;
    return ((givenScore / assignedScore) * weightage).toFixed(2);
  }

  seekClarification() {
   const closedialog = this.dialog.open(DialogSeekClarificationComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '55%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
      data: {
        supplierId: this.supplierId,
        supplier : this.supplier
      },
    });
    closedialog.afterClosed().subscribe(result =>{
      if(result){
        this.getSeekClarification();
        let elmObjSup = {
          supId: this.supplierId,
          status: "Requested information",
          userId: this.loggedUserDetails?.userId
        }
        this.wfService.updateApplicationStatus(elmObjSup).subscribe((v:any)=>{
          if(v){
            this.adminService.showMessage('Seek Information sent successfully');
            this.getWFHistory();
            this.getClearBtn();
            // this.router.navigate(['/krya/dashboard'], { skipLocationChange: true,  replaceUrl: true })
          }
        },error =>{
          this.adminService.showMessage("Supplier status failed")
        })
      }
    })
  }

  supplierManualMap() {
    const closedialog = this.dialog.open(DialogSupplierManualMapComponent, {
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
      panelClass: 'popUpMiddle',
      data: {
        supplierId: this.supplierId,
        SupplierManagement: this.SupplierManagement,
        erpSupplier : this.getErpSupplier
      },
    });
    closedialog.afterClosed().subscribe(result =>{
      if (result === true) {
        //this.getSavedAssignEntityList();
      }
    })
  }
  supplierAssignEntity() {
    const closedialog = this.dialog.open(DialogSupplierAssignEntityComponent, {
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
      panelClass: 'popUpMiddle',
      data: {
        supplierId: this.supplierId,
        storedEntitiyList : this.getStoredEntityData,
        entirydata : this.getAssignEntityList,
        SupplierManagement: this.SupplierManagement,
      },
    });
    closedialog.afterClosed().subscribe(result =>{
      if (result === true) {
        this.getSavedAssignEntityList();
      }
    })
  }
  processApproval() {
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
        screenId :1
      },
      panelClass: 'popUpMiddle',
    });
    closedialog.afterClosed().subscribe(result =>{
      if (result === true) {
        let elmObj = {
          supId: this.supplierId,
          status: WorkFlowStatusConstants.WFINITIATED,
          userId: this.loggedUserDetails?.userId
        }
        this.wfService.updateApplicationStatus(elmObj).subscribe((res) => {
          if (res) {
            this.adminService.showMessage("Process workflow initiated")
            this.router.navigate(['/krya/dashboard'], { skipLocationChange: true,  replaceUrl: true });
          }
        }, err => {
          this.adminService.showMessage("Error while updating status")
          // this.getWFHistory();
          // this.checkWFLevelAvailable();
        })
      }
    })
  }

  private roundNumber(value: string): string {
    // Remove commas first
    if (!value) return '';

    // Step 1: Normalize decimal separator (convert to a standard format)
    let normalizedValue = value.replace(this.systemParameter.decimalSymbol, this.systemParameter.decimalSymbol);

    // Step 2: Remove grouping symbols (e.g., commas)
    let numericValue = normalizedValue.replace(new RegExp(`[${this.systemParameter.digitGroupingsymb}]`, 'g'), '');

    if(this.systemParameter.digitGroupingsymb === ','){
    let roundedValue = Number(numericValue).toFixed(this.systemParameter.noOfDigitsAftDec);
    let formattedValue = this.formatAndSetValue(roundedValue.replace(this.systemParameter.decimalSymbol, this.systemParameter.decimalSymbol));

    return formattedValue;
    }else{

    const correctNumber = this.fixNumberFormat(numericValue);
    let roundedValue = Number(correctNumber).toLocaleString('de-DE',{ minimumFractionDigits: 2 });
    let formattedValue = this.formatAndSetValue(roundedValue.replace(this.systemParameter.decimalSymbol, this.systemParameter.decimalSymbol));

    return formattedValue;
    }

  }

  fixNumberFormat(wrongNumber: string): number {
    // Step 1: Remove all dots except the last one
    let parts = wrongNumber.split(",");
    let integerPart = parts[0].replace(/\./g, ""); // Remove all dots from integer part
    let decimalPart = parts[1] || "00"; // Keep decimal part if exists
  
    // Step 2: Join integer and decimal parts properly
    let fixedNumber = `${integerPart}.${decimalPart}`;
  
    return parseFloat(fixedNumber);
  }

  private formatAndSetValue(data: string) {

    let value = data?.replace(new RegExp(`[${this.systemParameter.digitGroupingsymb}]`, 'g'), '');

    if (value) {

      if (this.systemParameter?.digitGrouping === '12,34,56,789') {
        value = this.formatIndianNumber(value);
      } else if (this.systemParameter?.digitGrouping === '123,456,789') {
        value = this.formatWesternNumber(value);
      } else if (this.systemParameter?.digitGrouping === '123456,789') {
        value = this.formatCustomNumber(value);
      } else {
        value = value;
      }
    }

    return value;

  }

  private formatIndianNumber(value: string): string {
    if (!value) return '';
    const groupingSymbol = this.systemParameter.digitGroupingsymb || ',';
    let [integerPart, decimalPart] = value.split(`${this.systemParameter.decimalSymbol}`);
    integerPart = integerPart.replace(/(\d+)(\d{3})$/, (match, p1, p2) => {
      return p1.replace(/\B(?=(\d{2})+(?!\d))/g, groupingSymbol) + groupingSymbol + p2;
    });
    return decimalPart !== undefined ? `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart}` : integerPart;
  }

  private formatWesternNumber(value: string): string {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, `${this.systemParameter.digitGroupingsymb}`);
  }

  private formatCustomNumber(value: string): string {
    if (!value) return '';
    const groupingSymbol = this.systemParameter?.digitGroupingsymb || ',';
    value = value.replace(new RegExp(`[${groupingSymbol}]`, 'g'), '');
    let [integerPart, decimalPart] = value.split(this.systemParameter?.decimalSymbol || '.');
    integerPart = integerPart.replace(/(\d+)(\d{3})$/, (_, p1, p2) => {
      return p1 + groupingSymbol + p2;
    });
    return decimalPart !== undefined ? `${integerPart}${this.systemParameter?.decimalSymbol}${decimalPart}` : integerPart;
  }
  openAccordionAll() {
    this.isOpen= true;
  }
  closeAccordionAll() {
    this.isOpen= false;
  }

  //Update work flow details
  updateWFStatus(action:any, wfDet: any){
    if(action !== WorkFlowStatusForLevelWise.LEVELAPPROVED && this.wfDetailsComments === ""){
      this.adminService.showMessage("Please give comments");
      return;
    }
    let objData = {
      "workflowTransId": wfDet?.workflowTransId || 0,
      "actionTaken": action,
      "comments": this.wfDetailsComments ? this.wfDetailsComments : "",
      "createdUserId": wfDet?.assignedUserId || 0
    }
    this.wfService.updateWorkFlowDetails(objData).subscribe((res)=>{
      if(res){
        let elmObj = {
          supId: this.supplierId,
          status: action === WorkFlowStatusForLevelWise.LEVELREJECTED ? WorkFlowStatusConstants.WFREJECTED : WorkFlowStatusConstants.WFREQINFO,
          userId: this.loggedUserDetails?.userId
        }
        if(action === WorkFlowStatusForLevelWise.LEVELAPPROVED){
          this.adminService.showMessage(`WorkFlow approved successfully`);
          this.getWFHistory();
          this.checkWFLevelAvailable();
        }else {
          this.wfService.updateApplicationStatus(elmObj).subscribe((res) => {
            if (res) {
              // this.router.navigate(['/krya/dashboard'], { skipLocationChange: true,  replaceUrl: true })
              this.getWFHistory();
              this.checkWFLevelAvailable();
            }
          }, err => {
            this.adminService.showMessage("Error while changing application status")
          })
        }
        // this.getButtonStatusFrom.emit(action);
      }
    })
  }

  handleButtons(): any {
    if (this.loggedUserDetails?.userType === 1) {
      return 'Buyer'
    } else if (this.loggedUserDetails?.userType === 1) {
      return 'PQRep'
    }
  }

  handleStatus(data?:any): any {
    if (data === WorkFlowStatusConstants.WFREJECTED) {
      return WorkFlowStatusConstants.WFREJECTED;
    } else if (data === WorkFlowStatusConstants.WFREQINFO) {
      return WorkFlowStatusConstants.WFREQINFO;
    } else if (data === WorkFlowStatusConstants.WFAPPROVED) {
      return WorkFlowStatusConstants.WFAPPROVED;
    }
  }

  notifySupplier() {
    const data = {
      "supplierId": this.supplierId,
      "status": this.allLevelApproved ? 'NotifyApprovedSupplier' : 'NotifyRejectSupplier'
    }
    this.wfService.NotifyWorkFlow(data).subscribe(
      response => {
        if (response) {
          let elmObjApp = {
            supId: this.supplierId,
            status: this.allLevelApproved ? "Active" : "Rejected",
            userId: this.loggedUserDetails?.userId
          };
          this.wfService.updateApplicationStatus(elmObjApp).subscribe((res) => {
            if (res) {
              this.adminService.showMessage('Notification sent successfully');
              this.getWFHistory();
              this.getClearBtn();
              // this.router.navigate(['/krya/dashboard'], { skipLocationChange: true,  replaceUrl: true })
            }
          }, err => {
            this.adminService.showMessage("Application status failed")
          })
        }
      }
    );
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numeric keys (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  getSavedAssignEntityList(){
    this.wfService.getStoredEntityListApi(this.supplierId).subscribe((res:any)=>{
      if(res && res.length > 0){
        this.getStoredEntityData = res;
        this.WFRelatedBtnCondition();
        // this.isNotifyEnable = true;
      }
    },error=>{

    })
  }

  getAssignedEntityList(){
    this.wfService.getEntityList().subscribe((res)=>{
      if(res && res.length > 0){
        this.getAssignEntityList = res;
        this.isAssignEntityEnable = false;
        this.showAssignEntity = true;
        this.WFRelatedBtnCondition();
      }else{
        this.showAssignEntity = false;
        // this.isAssignEntityEnable = false;
      }
    },error=>{
      this.showAssignEntity = false;
      this.isAssignEntityEnable = false;
    })
  }


  rejectVerifyPopup(wfHistory:any) {
    const closedialog = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '55%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
      data: {
        rejectFlag : true
      },
    });
    closedialog.afterClosed().subscribe(result => {
      if (result) {
        this.updateWFStatus(WorkFlowStatusForLevelWise.LEVELREJECTED,wfHistory);
      }
    })
  }

  getMapErp() {
    this.commonService.getMapErp(this.supplierId).subscribe({
      next: (data: any) => {
        this.getErpSupplier = data;
      }
    })
  }
}
