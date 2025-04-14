import { Component, ElementRef, HostListener, inject, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../core/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressComponent } from '../add-address/add-address.component';
import { ContactDetailsComponent } from '../supplier-user-form/contact-details/contact-details.component';
import { BankDetailsComponent } from '../supplier-user-form/bank-details/bank-details.component';
import { CategoryScopeManagementComponent } from './category-scope-management/category-scope-management.component';
import { SupplierAttachmentComponent } from './supplier-attachment/supplier-attachment.component';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { ProductService } from './productService';
import { MatAccordion } from '@angular/material/expansion';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { FinancialHealthDetailsComponent } from './financial-health-details/financial-health-details.component'
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs';
import { ComplianceChecklistComponent } from './compliance-checklist/compliance-checklist.component';
import { FinalSubmissionComponent } from '../supplier-user-form/final-submission/final-submission.component'
import { ComplianceCheckService } from '../core/services/supplier-management/supplier-compliance-checklist.service';
import { AdminService } from '../core/services/admin/admin.service';
import { SupplierInformationComponent } from './supplier-information/supplier-information.component';
import { MatScreenNavigation } from '../core/models/master-screen-navigation.model';
import { PqQuestionnariesComponent } from './pq-questionnaries/pq-questionnaries.component';
import { RegActivitiesCertificateComponent } from './reg-activities-certificate/reg-activities-certificate.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PqAssesmentListComponent } from './pq-assesment-list/pq-assesment-list.component';
import { ResetPasswordComponent } from '../auth-module/reset-password/reset-password.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { ContactDetailsComponent as ContactDetailsComponent_1 } from './contact-details/contact-details.component';
import { BankDetailsComponent as BankDetailsComponent_1 } from './bank-details/bank-details.component';
import { SupplierFormPreviewComponent } from './supplier-form-preview/supplier-form-preview.component';
import { FinalSubmissionComponent as FinalSubmissionComponent_1 } from './final-submission/final-submission.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LoginService } from '../core/services/login/login.service';
import { SupplierUserFormService } from '../core/services/supplier-management/supplier.user.form.service';
import { DateTimeService } from '../core/date-time/date-time.service';
import { ActivatedRoute } from '@angular/router';
import { SupplierAttachmentService } from '../core/services/supplier-management/supplier-attachment.service';
import { DialogSeekClarificationComponent } from '../dialogs/dialog-seek-clarification/dialog-seek-clarification.component';
import { PreviousAlrtComponent } from '../previous-alrt/previous-alrt.component';
import { DialogSupplierManualMapComponent } from '../dialogs/dialog-supplier-manual-map/dialog-supplier-manual-map.component';
import { DialogSupplierAssignEntityComponent } from '../dialogs/dialog-supplier-assign-entity/dialog-supplier-assign-entity.component';
import { DialogInitiateApprovalComponent } from '../dialogs/dialog-initiate-approval/dialog-initiate-approval.component';
import { WfRelatedService } from '../core/services/workflow/wf-related.service';
import { TransactionTypeConstants } from '../core/models/constants/transaction-type.constant';
import { WorkFlowScreenConstants, WorkFlowStatusConstants } from '../core/models/constants/work-flow.constant';
import { timeout } from 'rxjs';

interface Column {
  field: string;
  header: string;
  minWidth?: string;
  sortfield?: boolean;
  toolTip?: string;
  style?: any;
}
export interface Product {
  fname?: string;
  mname?: string;
  lname?: string;
  jTitle?: string;
  role?: number;
  email?: string;
  wPhone?: string;
  mPhone?: string;
  pContact?: string;
}
@Component({
  selector: 'app-supplier-user-form',
  templateUrl: './supplier-user-form.component.html',
  styleUrl: './supplier-user-form.component.scss',
  providers: [ProductService],
  standalone: true,
  imports: [MatToolbar, MatTooltip, CommonModule, MatMenuTrigger, MatMenu, NgIf, MatMenuItem, RouterLink, MatTabGroup, MatTab, MatTabLabel, SupplierInformationComponent, MatButton, AddressDetailsComponent, ContactDetailsComponent_1, FinancialHealthDetailsComponent, BankDetailsComponent_1, CategoryScopeManagementComponent, PqQuestionnariesComponent, RegActivitiesCertificateComponent, SupplierAttachmentComponent, SupplierFormPreviewComponent, PqAssesmentListComponent, FinalSubmissionComponent_1, TranslatePipe, MatTooltipModule]

})
export class SupplierUserFormComponent implements OnInit {


  @ViewChild(ContactDetailsComponent) Contact: ContactDetailsComponent;
  @ViewChild(BankDetailsComponent) Bank: BankDetailsComponent;
  @ViewChild(FinalSubmissionComponent) FinalSubmission: FinalSubmissionComponent;
  @ViewChild(SupplierInformationComponent) childSupplierInformation: SupplierInformationComponent;
  @ViewChild(CategoryScopeManagementComponent) childCategoryScope: CategoryScopeManagementComponent;
  @ViewChild(SupplierAttachmentComponent) childAttachment: SupplierAttachmentComponent;
  @ViewChild(PqAssesmentListComponent) childPQAttachment: PqAssesmentListComponent;
  @ViewChild(AddressDetailsComponent) addressDetails: AddressDetailsComponent;
  @ViewChild(FinancialHealthDetailsComponent) financialHealth: FinancialHealthDetailsComponent;
  @ViewChild(ComplianceChecklistComponent) complianceChecklist: ComplianceChecklistComponent;
  @ViewChild(PqQuestionnariesComponent) pqquestionaries: PqQuestionnariesComponent;
  @ViewChild(RegActivitiesCertificateComponent) regActivitiesCertificate: RegActivitiesCertificateComponent;
  @ViewChild(PqAssesmentListComponent) childPQApproval: PqAssesmentListComponent;

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  NextFlag: boolean = false;
  userName: string;
  supplierForm!: FormGroup;
  supplierId!: any;
  establishmentDate: any;
  userData: any | null;
  readonly dialog = inject(MatDialog);
  currentTabIndex: number = 0;
  isMobile = true;

  readonly panelOpenStep1 = signal(true);
  readonly panelOpenStep2 = signal(true);
  readonly panelOpenStep3 = signal(true);
  readonly panelOpenStep4 = signal(true);
  readonly panelOpenStep5 = signal(true);
  readonly panelOpenStep6 = signal(true);
  readonly panelOpenStep7 = signal(true);
  readonly panelOpenStep8 = signal(true);
  readonly panelOpenStep9 = signal(true);
  accordion = viewChild.required(MatAccordion);
  disableSaveCategoryButton: boolean = false;
  disableSaveAttachButton: boolean = false;
  tabCheckValues: any[] = new Array();
  SaveDraftFlag: boolean = false;
  disableStatusBased: boolean = true;
  loggedDetails: any;
  supId: any;
  erpSupplier: boolean = true;
  userId: number;
  supplier: any;
  assignedEntities: any;
  id: boolean = false;
  status: boolean = false;
  profile: boolean = false;

  disableComplianceTab: boolean = false;
  childPQAttachmentmapErp: any;
  userIds: string | null;
  SupDetails: any;
  statusData: any;
  initialWorkflow: void;
  workFlowHistory: any;
  approvalworkFlowHistory: any;
  notifiySupplier: boolean = false;
  enableDeclaration: boolean = false;

  //Get Activated Route
  private readonly route = inject(ActivatedRoute);
  hideHeader: boolean = false;
  getTabIndex = 0;

  //Inject service 
  wfService = inject(WfRelatedService);
  supplierManagementResponce: any;
  tabValidation: string;
  profileStatus: boolean = false;


  constructor(
    private elementRef: ElementRef,
    public commonService: CommonService,
    private loginservice: LoginService,
    private supplierUserFormService: SupplierUserFormService,
    private productService: ProductService,
    public supplierservice: ComplianceCheckService,
    private fb: FormBuilder,
    public adminService: AdminService,
    private observer: BreakpointObserver,
    public activateRouter: ActivatedRoute,
    private dateTimeService: DateTimeService,
    private supplierAttact: SupplierAttachmentService,
    private router: Router
  ) {
    this.userName = this.commonService.userName;
    // this.supplierId = this.commonService.SupplierId;
  }

  ngOnInit() {

    window.history.replaceState({}, '', '/ProcureZen');

    this.route.url.subscribe((event) => {
      if (event[0].path === "dashboardSupReg") {
        this.hideHeader = true;
      } else {
        this.hideHeader = false;
      }
    })

    this.activateRouter?.params?.subscribe((response) => {
      this.statusData = response?.status;
      this.supId = response?.id
      localStorage.setItem('supId', response?.id);
      //check it's from workflow
      if (response?.status === 'workFlow') {
        this.getTabIndex = 1;
      }
      if (response?.id) {
        this.supId = response?.id
        this.id = true;
        // this.getApprovalWFHistory();
        if (typeof window !== 'undefined' && localStorage) {
          this.loggedDetails = JSON.parse(localStorage.getItem('loginDetails')!);
          let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
          this.userIds = localStorage.getItem('userId');
          this.supplierId = response?.id;
          this.userId = loggedUserDetails.userId;
          this.userName = loggedUserDetails.userName;
          this.commonService.UserId = loggedUserDetails.userId;
          this.commonService.SupplierId = loggedUserDetails.supplierId;
          this.getScreenCompleteDetails();
          this.getWFHistory();
          this.dateTimeService.setDateFormat();
          this.observer.observe(['(max-width: 900px)']).subscribe((screenSize) => {
            if (screenSize.matches) {
              this.isMobile = true;
            } else {
              this.isMobile = false;
            }
          });
        }
      } else if (response?.status === 'In-Progress') {
        this.disableStatusBased = false;
        this.status = true;
        if (typeof window !== 'undefined' && localStorage) {
          this.loggedDetails = JSON.parse(localStorage.getItem('loginDetails')!);
          let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
          this.supplierId = loggedUserDetails.supplierId;
          this.userId = loggedUserDetails.userId;
          this.userName = loggedUserDetails.userName;
          this.commonService.UserId = loggedUserDetails.userId;
          this.commonService.SupplierId = loggedUserDetails.supplierId;
          this.getScreenCompleteDetails();
          this.dateTimeService.setDateFormat();
          this.observer.observe(['(max-width: 900px)']).subscribe((screenSize) => {
            if (screenSize.matches) {
              this.isMobile = true;
            } else {
              this.isMobile = false;
            }
          });
        }
      } else if (response?.profile === 'manageprofile') {
        // this.disableStatusBased = false;
        this.profileStatus = true;
        this.profile = true;
        if (typeof window !== 'undefined' && localStorage) {
          this.loggedDetails = JSON.parse(localStorage.getItem('loginDetails')!);
          let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
          this.supplierId = loggedUserDetails.supplierId;
          this.userId = loggedUserDetails.userId;
          this.userName = loggedUserDetails.userName;
          this.commonService.UserId = loggedUserDetails.userId;
          this.commonService.SupplierId = loggedUserDetails.supplierId;
          this.getScreenCompleteDetails();
          this.dateTimeService.setDateFormat();
          this.observer.observe(['(max-width: 900px)']).subscribe((screenSize) => {
            if (screenSize.matches) {
              this.isMobile = true;
            } else {
              this.isMobile = false;
            }
          });
        }
      } else {
        if (typeof window !== 'undefined' && localStorage) {
          this.status = true
          this.loggedDetails = JSON.parse(localStorage.getItem('loginDetails')!);
          let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
          if (!this.commonService.isfromDashboard) {
            this.supplierId = loggedUserDetails.supplierId;
          }
          this.userId = loggedUserDetails.userId;
          this.userName = loggedUserDetails.userName;
          this.commonService.UserId = loggedUserDetails.userId;
          this.commonService.SupplierId = loggedUserDetails.supplierId;
          this.getScreenCompleteDetails();
          this.dateTimeService.setDateFormat();
          this.observer.observe(['(max-width: 900px)']).subscribe((screenSize) => {
            if (screenSize.matches) {
              this.isMobile = true;
            } else {
              this.isMobile = false;
            }
          });
        }
      }
    });
    this.loadSupplier();
    this.getSupplierDetails();
  }

  products!: Product[];
  cols!: Column[];

  onchangePswdSubmit() {
    this.changePasswordPopUp();
  }

  logOut() {
    const element = {
      "userId": localStorage.getItem('userId'),
      "userName": this.loggedDetails?.userName
    }
    this.loginservice.logoutToken(element).subscribe({
      next: res => {
      localStorage.removeItem('loginDetails');
      this.router.navigate(['/ProcureZen'], { skipLocationChange: true, replaceUrl: true })
      }, error: error => {
        localStorage.removeItem('loginDetails');
        this.router.navigate(['/ProcureZen'], { skipLocationChange: true, replaceUrl: true })
      }
    })
    // localStorage.removeItem('loginDetails');
  }

  changePasswordPopUp() {
    this.dialog.open(ResetPasswordComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '30%',
      height: '50%',
      position: {
        top: 'calc(7vw + 50px)',
        bottom: '',
        left: '',
        right: ''
      },
      // data: { logInDetails: this.logInDetails },  // Pass userId to the child component
      panelClass: 'popUpMiddle',
    });
  }

  getScreenCompleteDetails(): void {
    this.supplierUserFormService.getSupplierFormSaveDetails(this.supplierId).subscribe({
      next: (data) => {
        data?.forEach((ele: any) => {
          ele.checkValidation = false;
        })
        this.tabCheckValues = data;
        this.getComplianceFlags();
        this.checkValidationDisable(this.tabCheckValues, 8)
      },
      error: (err) => {
      }
    });
  }

  checkValidationDisable(arr: any, totalIndex: number) {
    let num = arr.findIndex((value: any) => { return value.isValid === false });

    // if (num == 8) {
    //   //check condition for declaration disabled
    //   this.enableDeclaration = true;
    // } else
    if (num === -1) {
      this.enableDeclaration = true;
    } else {
      //check condition for API valid disable
      for (var i = num; i <= totalIndex; i++) {
        arr[i].checkValidation = true;
      }
    }
  }

  getComplianceFlags() {
    this.supplierUserFormService.GetSupplierManagement().subscribe(res => {
      if (res.complianceRenewalBank) {
        if (!res.complianceRenewalBank.captureLicensedActivities &&
          !res.complianceRenewalBank.captureBusinessLicenses &&
          !res.complianceRenewalBank.captureRelatedPartyInformation) {
          this.disableComplianceTab = true;
        }
        this.supplierManagementResponce = res;
      }
    });
  }

  getTabBodyheight() {
    let a = this.elementRef.nativeElement.ownerDocument.getElementsByTagName('body')[0].clientHeight;
    let b = Math.round(a);
    if (b && this.elementRef.nativeElement.getElementsByClassName('tabContent')[0]) {
      if (b >= 450) {
        this.elementRef.nativeElement.getElementsByClassName('tabContent')[0].style.minHeight = (b - 240) + 'px';
      }
      else {
        this.elementRef.nativeElement.getElementsByClassName('tabContent')[0].style.minHeight = '400px';
      }
    }
  }

  getTabPageheight() {
    let a = this.elementRef.nativeElement.ownerDocument.getElementsByTagName('body')[0].clientHeight;
    let b = Math.round(a);
    if (b && this.elementRef.nativeElement.getElementsByClassName('mat-mdc-tab-body-wrapper')[0]) {
      if (b >= 450) {
        this.elementRef.nativeElement.getElementsByClassName('mat-mdc-tab-body-wrapper')[0].style.height = (b - 170) + 'px';
      }
      else {
        this.elementRef.nativeElement.getElementsByClassName('mat-mdc-tab-body-wrapper')[0].style.height = '400px';
      }
    }
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.getTabPageheight();
    this.getTabBodyheight();
  }

  ngAfterViewChecked() {
    this.getTabPageheight();
    this.getTabBodyheight();
  }

  goToPreviousRegActivitities(checkClickPrevious?: boolean) {
    this.regActivitiesCertificate.goToPreviousMaster(checkClickPrevious);
  }

  onSupplyInfoSubmit(isNextClick: boolean = false): void {
    this.childSupplierInformation.onSubmit(isNextClick);
  }

  saveAddressDetails(isNextClick: boolean = false) {
    this.addressDetails.onAddClick(isNextClick);
  }

  saveContactDetails(isNextClick: boolean = false) {
    // this.Contact.saveUpdateContact(isNextClick);
  }

  saveFinancialandBusiness(isNextClick: boolean = false) {
    // this.financialHealth.saveFinancialandBusiness(isNextClick);
  }

  saveBankDetails(isNextClick: boolean = false) {
    // this.Bank.AddUpdateBank(isNextClick);
  }

  saveCategoryAndScope(isNextClick: boolean = false) {
    this.childCategoryScope.addCategories(isNextClick);
  }

  saveRegActivitities(isNextClick: boolean = false) {
    this.regActivitiesCertificate.saveMasterTables(isNextClick);
  }

  onComplianceSubmit(isNextClick: boolean = false) {
    this.complianceChecklist.onComplianceSubmit(isNextClick);
  }

  saveAttachments(isNextClick: boolean = false) {
    this.childAttachment.saveAttachments(isNextClick);
  }

  savePQAttachments(isNextClick: boolean = false) {
    this.childPQAttachment.savePQAttachments(isNextClick);
  }

  savePQquestionnaries(isNextClick: boolean = false) {
    this.pqquestionaries.PQquestionnaries(isNextClick);
  }

  saveFinalSubmission() {
    // this.FinalSubmission.SaveFinalSubmission();
  }

  getCommonPageName(data: string) {
    this.tabValidation = data;

  }

  goto(buttonControlFlag: boolean, comp: string, checkClickPrevious?: boolean) {

    if (buttonControlFlag) {
      this.addressDetails.saveAddressDetails();
      this.gotoNextTab('');
    } else if (!buttonControlFlag) {
      switch (comp) {
        case 'addressDetails':
          this.addressDetails.confirmatioPopUp(undefined, checkClickPrevious);
          return;
        case 'contactDetails':
          // this.Contact.confirmatioPopUp(undefined, checkClickPrevious);
          return;
        case 'financialHealth':
          // this.financialHealth.confirmatioPopUp(undefined, checkClickPrevious);
          return;
        case 'bankDetails':
          // this.Bank.confirmatioPopUp(undefined, checkClickPrevious);
          return;
        case 'pqquestionaries':
          this.pqquestionaries.confirmatioPopUp(undefined, checkClickPrevious);
          return;
        case 'categoryAndScope':
          this.childCategoryScope.confirmatioPopUp(undefined, checkClickPrevious);
          return;
        case 'compliance':
          this.complianceChecklist.confirmatioPopUp();
          // this.pqquestionaries.savePQquestionnaries(false);
          return;
        case 'attachment':
          this.childAttachment.confirmatioPopUp(undefined, checkClickPrevious);
          return;
        default:
          this.gotoPreviousTab();
          return;
      }
    }
  }

  tabClick(tab: any) {
    if (this.loggedDetails.userType !== 1) {
      if (tab.index > 0) {
        let decreaseIndex = 1;
        if (tab.index === 10) {
          decreaseIndex = 2;
        }
        let tabValid = this.tabCheckValues.find(x => x.index === tab.index - decreaseIndex)
        //  if(tabValid.screenName === 'Supplier Information'){
        //     this.onSupplyInfoSubmit(true);
        //   }else if(tabValid.screenName === 'Address Details'){
        //     this.saveAddressDetails(true);
        //   }else if(tabValid.screenName === 'Contact Details'){
        //     this.Contact.saveUpdateContact(true);
        //   }else if(tabValid.screenName === 'Financial & Business'){
        //     this.financialHealth.saveFinancialandBusiness(true);
        //   }else if(tabValid.screenName === 'Bank Details'){
        //     this.Bank.AddUpdateBank(true);
        //   }
        if (tabValid?.isValid) {
          this.currentTabIndex = tab.index;


        } else {
          // this.adminService.showMessage('Please complete ' + tabValid?.screenName)
          // this.adminService.showMessage('Ensure the current tab is fully completed before moving to the next step');
          this.adminService.showMessage('Please fill in all mandatory fields before save');
          this.tabGroup.selectedIndex = this.currentTabIndex;
        }
      }
    }
  }

  SavePQAssesment() {
    this.childPQAttachment.SavePqAssesment();
  }

  // getApprovalWFHistory() {
  //   this.supplierAttact.GetApprovalWorkFlowDetails(this.supplierId).subscribe({
  //     next: (data) => {
  //       this.approvalworkFlowHistory = data.workflowHistory;

  //     },
  //     error: (err) => {
  //     }
  //   });
  // }

  approval(id: any) {
    this.childPQApproval.getApprovalWFHistory(WorkFlowStatusConstants.WFAPPROVED, id);
    // this.adminService.showMessage('Approved successfully');
  }

  reject(id: any) {
    this.childPQApproval.getApprovalWFHistory(WorkFlowStatusConstants.WFREJECTED, id);
    // this.adminService.showMessage('Rejected successfully');
  }

  request(id: any) {
    this.childPQApproval.getApprovalWFHistory(WorkFlowStatusConstants.WFREQINFO, id);
    // this.adminService.showMessage('Request for Information successfully');
  }

  // seekClarification() {
  //   const dialogRef = this.dialog.open(DialogSeekClarificationComponent, {
  //     disableClose: true,
  //     hasBackdrop: true,
  //     backdropClass: '',
  //     autoFocus: true,
  //     width: '55%',
  //     height: '60%',
  //     position: {
  //       top: 'calc(3vw + 20px)',
  //       bottom: '',
  //       left: '',
  //       right: ''
  //     },
  //     data: {
  //       supplierId: this.supId, // Example value
  //     },
  //     panelClass: 'popUpMiddle',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.childPQAttachment.getSeekClarification();
  //   });
  // }

  previousAlert() {
    const cancelDialogRef = this.dialog.open(PreviousAlrtComponent, this.commonService.deletetModalConfig);
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.goto(false, 'pqattachment');
      } else {
        this.dialog.closeAll();
      }
    })
  }

  // supplierManualMap() {
  //   const dialogRef = this.dialog.open(DialogSupplierManualMapComponent, {
  //     disableClose: true,
  //     hasBackdrop: true,
  //     backdropClass: '',
  //     autoFocus: true,
  //     width: '85%',
  //     height: '80%',
  //     position: {
  //       top: 'calc(3vw + 20px)',
  //       bottom: '',
  //       left: '',
  //       right: ''
  //     },
  //     data: {
  //       supplierId: this.supId, // Example value
  //     },
  //     panelClass: 'popUpMiddle',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === false) {
  //       // this.getMapErp();
  //     }

  //   });
  // }
  // supplierAssignEntity() {
  //   const dialogRef = this.dialog.open(DialogSupplierAssignEntityComponent, {
  //     disableClose: true,
  //     hasBackdrop: true,
  //     backdropClass: '',
  //     autoFocus: true,
  //     width: '85%',
  //     height: '80%',
  //     position: {
  //       top: 'calc(3vw + 20px)',
  //       bottom: '',
  //       left: '',
  //       right: ''
  //     },
  //     data: {
  //       supplierId: this.supId, // Example value
  //     },
  //     panelClass: 'popUpMiddle',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === false) {
  //       this.getSupplierDetails();
  //     }

  //   });
  // }
  // initiateApproval() {
  //   const dialogRef = this.dialog.open(DialogInitiateApprovalComponent, {
  //     disableClose: true,
  //     hasBackdrop: true,
  //     backdropClass: '',
  //     autoFocus: true,
  //     width: '85%',
  //     height: '80%',
  //     position: {
  //       top: 'calc(3vw + 20px)',
  //       bottom: '',
  //       left: '',
  //       right: ''
  //     },
  //     data: {
  //       supplierDet: this.SupDetails, // Example value

  //     },
  //     panelClass: 'popUpMiddle',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === true) {
  //       let elmObj= {
  //         supId : this.supId,
  //         statusId:   1,
  //         userId: this.userId
  //       }
  //       this.wfService.updateWorkFlowStatus(elmObj).subscribe((res)=>{
  //         if(res){          
  //           this.childPQApproval.getWFHistory();
  //           this.getWFHistory();
  //         }
  //       })
  //     }
  //   });
  // }

  getWFHistory() {
    // this.supplierAttact.GetWorkFlowDetails(this.supId).subscribe({
    //   next: (data) => {
    //     this.workFlowHistory = data.workflowHistory;


    //   },
    //   error: (err) => {
    //   }
    // });
    this.wfService.getSupplierWorkflowStatusApi(this.supId, WorkFlowScreenConstants.PREQUALIFICATION).subscribe({
      next: (data: any) => {
        this.workFlowHistory = data;
      },
      error: (err: any) => {
      }
    });
  }

  gotoPreviousTab() {
    if (this.tabGroup?.selectedIndex !== null) {
      const nextIndex = (this.tabGroup.selectedIndex - 1);
      this.tabGroup.selectedIndex = nextIndex; // Move to the next tab
    }
  }
  gotoNextTab(data: any) {
    if(data){
      if (this.tabGroup?.selectedIndex !== null) {
        const nextIndex = (this.tabGroup.selectedIndex + data);
        this.tabGroup.selectedIndex = nextIndex; // Move to the next tab
      }
    }else{
    if (this.tabGroup?.selectedIndex !== null) {
      const nextIndex = (this.tabGroup.selectedIndex + 1);
      this.tabGroup.selectedIndex = nextIndex; // Move to the next tab
    }
  }
  }

  handleDialogResult(result: boolean): void {
    if (result) {
      this.gotoPreviousTab();
    }
  }

  addAddress(): void {
    this.dialog.open(AddAddressComponent, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '70%',
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

  loadContactTable() {
    this.productService.getProductsMini().then((data: Product[]) => {
      this.products = data;
    });
    this.cols = [
      { field: 'fname', header: 'First Name', style: { minWidth: '150px' }, toolTip: 'First Name', sortfield: true },
      { field: 'mname', header: 'Middle Name', style: { minWidth: '120px' }, toolTip: 'Middle Name', sortfield: true },
      { field: 'lname', header: 'Last Name', style: { minWidth: '150px' }, toolTip: 'Last Name', sortfield: true },
      { field: 'jTitle', header: 'Job Title', style: { minWidth: '150px' }, toolTip: 'Job Title', sortfield: true },
      { field: 'role', header: 'Role', style: { minWidth: '150px' }, toolTip: 'Role', sortfield: true },
      { field: 'email', header: 'Email', style: { minWidth: '150px' }, toolTip: 'Email', sortfield: true },
      { field: 'wPhone', header: 'Work Phone', style: { minWidth: '120px' }, toolTip: 'Work Phone', sortfield: true },
      { field: 'mPhone', header: 'Mobile Phone', style: { minWidth: '120px' }, toolTip: 'Mobile Phone', sortfield: true },
      { field: 'pContact', header: 'Primary Contact', style: { minWidth: '120px' }, toolTip: 'Primary Contact', sortfield: true },
    ];
  }

  addContactDetails(): void {
    this.dialog.open(AddContactDialogComponent, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '70%',
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

  disableOrEnableCategorySave(value: boolean) {
    this.disableSaveCategoryButton = value;
  }

  disableOrEnableAttachSave(value: boolean) {
    this.disableSaveAttachButton = value;
  }

  getSaveDraftFlag(result: boolean) {
    this.SaveDraftFlag = result;
  }


  getNextFlag(result: boolean) {
    this.NextFlag = result;
  }

  loadSupplier() {
    this.commonService.getSupplier(this.supplierId).subscribe({
      next: (data) => {
        this.supplier = data;
      },
      error: (err) => {
      }
    });
  }

  getSupplierDetails() {
    this.supplierAttact.getSupplierDetails(this.supplierId).subscribe(res => {
      if (res) {
        this.SupDetails = res;
        this.notifiySupplier = res?.notifySupplierFlag;
      }
    })
  }

  notifySupplier() {
    const supplierName = this.childPQAttachment.getSupplierDetails();

    const emailTemplate = `
      Dear ${this.supplier?.firstName} ${this.supplier?.lastName},<br><br>${this.SupDetails?.supplierName},<br><br>
      We are pleased to inform you that your pre-qualification and registration as a supplier with 
      ${this.supplier?.organizationWebsite} have been successfully completed in our Digital Procurement Platform. 
      Thank you for your interest and the timely submission of all necessary documentation.<br><br>
      Your supplier profile is now active and as a pre-qualified supplier, you are eligible to 
      participate in upcoming sourcing events and collaborate with us.<br><br>
      Please keep the following details for future reference:<br><br>
      Supplier ID: ${this.supplierId}<br>
      Your company is assigned now to work with the following entities:<br>
      Assigned Entities:<br>
      ${this.assignedEntities.join('<br>')}<br><br>
      Should you have any questions or require support, please feel free to reach out to our Supplier 
      Relations team at ${this.supplier?.email}.<br><br>
      Thank you once again for your interest in partnering with us. We look forward to a successful and 
      productive business relationship.<br><br>
      Thank you,<br>Sincerely yours,<br>Digital Procurement Platform`;
    // ${this.assignedEntities.join('<br>')}
    const data = {
      "supplierId": this.supplierId,
      "toEmail": this.supplier?.email,
      "subject": "Your Subject",
      "body": emailTemplate
    }

    this.commonService.saveNotifySupplier(data).subscribe(
      response => {
        this.getSupplierDetails();
        this.notifiySupplier = response.emailresponse?.notifySupplierFlag
        this.adminService.showMessage('Data on the form has been saved successfully');
      }
    );
  }

  handleButtons(): any {
    if (this.loggedDetails?.userType === 1) {
      return 'Buyer'
    } else if (this.loggedDetails?.userType === 1) {
      return 'PQRep'
    }
  }

  handleStatus(): any {
    if (this.statusData === WorkFlowStatusConstants.WFREJECTED) {
      return WorkFlowStatusConstants.WFREJECTED;
    } else if (this.statusData === WorkFlowStatusConstants.WFREQINFO) {
      return WorkFlowStatusConstants.WFREQINFO;
    } else if (this.statusData === WorkFlowStatusConstants.WFAPPROVED) {
      return WorkFlowStatusConstants.WFAPPROVED;
    }
  }

  handleInitialApproval(): boolean {
    if (this.handleButtons() === 'PQRep') {
      return false;
    }
    if (this.handleStatus() === 'WF-Req Info') {
      return true;
    }
    if (this.workFlowHistory?.length === 0) {
      return true;
    }
    return false; // Ensures function always returns a boolean
  }

  handleMapErp(): boolean {
    if (this.handleButtons() === 'PQRep') {
      return false;
    } else if (this.handleStatus() === 'WF-Req Info') {
      return true;
    } else if (this.handleStatus() !== 'WF-Req Info') {
      if (this.handleStatus() === 'WF-Approved') {
        if (this.workFlowHistory?.length !== 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
    return false
  }

  handleassignEntity(): boolean {
    if (this.handleButtons() === 'PQRep') {
      return false;
    } else if (this.handleStatus() === 'WF-Req Info') {
      return true;
    } else if (this.handleStatus() !== 'WF-Req Info') {
      if (this.handleStatus() === 'WF-Approved') {
        if (this.childPQAttachmentmapErp?.length !== 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
    return false
  }

  handleNotifySupplier(): boolean {
    if (this.handleButtons() === 'PQRep') {
      return false;
    } else if (this.handleStatus() === 'WF-Req Info') {
      return true;
    } else if (this.handleStatus() !== 'WF-Req Info') {
      if (this.handleStatus() === 'WF-Approved') {
        if (this.notifiySupplier !== true) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
    return false
  }

}

interface Column {
  field: string;
  header: string;
  minWidth?: string;
  sortfield?: boolean;
  toolTip?: string;
  style?: any;
}

export interface Product {
  fname?: string;
  mname?: string;
  lname?: string;
  jTitle?: string;
  role?: number;
  email?: string;
  wPhone?: string;
  mPhone?: string;
  pContact?: string;
}
