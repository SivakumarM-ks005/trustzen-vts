
import { Component, ElementRef, HostListener, inject, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressComponent } from '../../add-address/add-address.component';
import { ContactDetailsComponent } from '../../supplier-user-form/contact-details/contact-details.component';
import { BankDetailsComponent } from '../../supplier-user-form/bank-details/bank-details.component';
import { CategoryScopeManagementComponent } from '../category-scope-management/category-scope-management.component';
import { SupplierAttachmentComponent } from '../supplier-attachment/supplier-attachment.component';
import { AddContactDialogComponent } from '../../add-contact-dialog/add-contact-dialog.component';
import { ProductService } from '../productService';
import { MatAccordion } from '@angular/material/expansion';
import { AddressDetailsComponent } from '../address-details/address-details.component';
import { FinancialHealthDetailsComponent } from '../financial-health-details/financial-health-details.component'
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs';
import { ComplianceChecklistComponent } from '../compliance-checklist/compliance-checklist.component';
import { FinalSubmissionComponent } from '../../supplier-user-form/final-submission/final-submission.component'
import { ComplianceCheckService } from '../../core/services/supplier-management/supplier-compliance-checklist.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { SupplierInformationComponent } from '../supplier-information/supplier-information.component';
import { MatScreenNavigation } from '../../core/models/master-screen-navigation.model';
import { PqQuestionnariesComponent } from '../pq-questionnaries/pq-questionnaries.component';
import { RegActivitiesCertificateComponent } from '../reg-activities-certificate/reg-activities-certificate.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PqAssesmentListComponent } from '../pq-assesment-list/pq-assesment-list.component';
import { DialogSeekClarificationComponent } from '../../dialogs/dialog-seek-clarification/dialog-seek-clarification.component';
import { DialogSupplierAssignEntityComponent } from '../../dialogs/dialog-supplier-assign-entity/dialog-supplier-assign-entity.component';
import { DialogSupplierManualMapComponent } from '../../dialogs/dialog-supplier-manual-map/dialog-supplier-manual-map.component';
import { ActivatedRoute } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { ContactDetailsComponent as ContactDetailsComponent_1 } from '../contact-details/contact-details.component';
import { BankDetailsComponent as BankDetailsComponent_1 } from '../bank-details/bank-details.component';
import { SupplierFormPreviewComponent } from '../supplier-form-preview/supplier-form-preview.component';
import { FinalSubmissionComponent as FinalSubmissionComponent_1 } from '../final-submission/final-submission.component';
import { DialogInitiateApprovalComponent } from '../../dialogs/dialog-initiate-approval/dialog-initiate-approval.component';
import { LoginService } from '../../core/services/login/login.service';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { DateTimeService } from '../../core/date-time/date-time.service';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';
import { PreviousAlrtComponent } from '../../previous-alrt/previous-alrt.component';

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
  selector: 'app-pq-buyer-user',
  templateUrl: './pq-buyer-user.component.html',
  styleUrl: './pq-buyer-user.component.scss',
  providers: [ProductService],
  standalone: true,
  imports: [MatTabGroup, NgIf, MatTab, MatTabLabel, SupplierInformationComponent, MatButton, AddressDetailsComponent, ContactDetailsComponent_1, FinancialHealthDetailsComponent, BankDetailsComponent_1, CategoryScopeManagementComponent, PqQuestionnariesComponent, RegActivitiesCertificateComponent, SupplierAttachmentComponent, SupplierFormPreviewComponent, FinalSubmissionComponent_1, PqAssesmentListComponent]
})
export class PQBuyerUserComponent implements OnInit {

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
  tabCheckValues: MatScreenNavigation[] = new Array<MatScreenNavigation>();
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
  ) {
    this.userName = this.commonService.userName;
    // this.supplierId = this.commonService.SupplierId;
  }
  ngOnInit() {

    this.activateRouter?.params?.subscribe((response) => {

      this.statusData = response?.status;
      this.supId = response?.id

      localStorage.setItem('supId', response?.id)

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
          this.getMapErp();
          this.assignEntitys();
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


  getMapErp() {
    this.commonService.getMapErp(this.userIds).subscribe({
      next: (data: any) => {
        this.childPQAttachmentmapErp = data;
      console.log('childPQAttachmentmapErp',this.childPQAttachmentmapErp);
      
      }
    })
  }

  assignEntitys() {
    this.supplierAttact.GetassignEntity().subscribe({
      next: (data) => {
        this.assignedEntities = data.map((item: { entityName: any; }) => item.entityName);

      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  getScreenCompleteDetails(): void {

    this.supplierUserFormService.getSupplierFormSaveDetails(this.supplierId).subscribe({
      next: (data) => {
        this.tabCheckValues = data;
        this.getComplianceFlags();
      },
      error: (err) => {
        console.error('Error fetching supplier save details', err);
      }
    });

  }

  getComplianceFlags() {
    this.supplierUserFormService.GetSupplierManagement().subscribe(res => {
      if (res.complianceRenewalBank) {
        if (!res.complianceRenewalBank.captureLicensedActivities &&
          !res.complianceRenewalBank.captureBusinessLicenses &&
          !res.complianceRenewalBank.captureRelatedPartyInformation) {
          this.disableComplianceTab = true;
        }
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

  goToPreviousRegActivitities() {
    this.regActivitiesCertificate.goToPreviousMaster();
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
    // this.childCategoryScope.addCategories(isNextClick);
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

  goto(buttonControlFlag: boolean, comp: string) {
    if (buttonControlFlag) {
      this.addressDetails.saveAddressDetails();
      this.gotoNextTab();
    } else if (!buttonControlFlag) {
      switch (comp) {
        case 'addressDetails':
          this.addressDetails.confirmatioPopUp();
          return;
        case 'contactDetails':
          // this.Contact.confirmatioPopUp();
          return;
        case 'financialHealth':
          // this.financialHealth.confirmatioPopUp();
          return;
        case 'bankDetails':
          // this.Bank.confirmatioPopUp();
          return;
        case 'categoryAndScope':
          // this.childCategoryScope.confirmatioPopUp();
          return;
        case 'compliance':
          this.pqquestionaries.savePQquestionnaries(false);
          return;
        case 'attachment':
          this.childAttachment.confirmatioPopUp();
          return;
        default:
          this.gotoPreviousTab();
          return;
      }
    }
  }

  tabClick(tab: any) {
    if (this.loggedDetails.roleId !== 5) {
      if (tab.index > 0) {
        let decreaseIndex = 1;
        if (tab.index === 10) {
          decreaseIndex = 2;
        }
        let tabValid = this.tabCheckValues.find(x => x.index === tab.index - decreaseIndex)
        if (tabValid?.isValid) {
          this.currentTabIndex = tab.index;
        } else {
          this.adminService.showMessage('Please complete ' + tabValid?.screenName)
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
  //       console.error('Error fetching supplier types', err);
  //     }
  //   });
  // }

  approval(id: any) {
    this.childPQApproval.getApprovalWFHistory('Qualified', id);
    // this.adminService.showMessage('Approved successfully');
  }

  reject(id: any) {
    this.childPQApproval.getApprovalWFHistory('Reject', id);
    // this.adminService.showMessage('Rejected successfully');
  }

  request(id: any) {
    this.childPQApproval.getApprovalWFHistory('Request for Information', id);
    // this.adminService.showMessage('Request for Information successfully');
  }

  seekClarification() {
    const dialogRef = this.dialog.open(DialogSeekClarificationComponent, {
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
      data: {
        supplierId: this.supId, // Example value
      },
      panelClass: 'popUpMiddle',
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.childPQAttachment.getSeekClarification();
    });
  }

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

  supplierManualMap() {
    const dialogRef = this.dialog.open(DialogSupplierManualMapComponent, {
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
        supplierId: this.supId, // Example value
      },
      panelClass: 'popUpMiddle',
    });

    dialogRef.afterClosed().subscribe(result => {
       if(result === false){
        this.getMapErp();
       }
       
    });
  }
  supplierAssignEntity() {
    const dialogRef = this.dialog.open(DialogSupplierAssignEntityComponent, {
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
        supplierId: this.supId, // Example value
      },
      panelClass: 'popUpMiddle',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === false){
        this.getSupplierDetails();
      }
      console.log(result);
      
   });
  }
  initiateApproval() {
    const dialogRef = this.dialog.open(DialogInitiateApprovalComponent, {
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
        supplierId: this.supId, // Example value
      },
      panelClass: 'popUpMiddle',
    });

    dialogRef.afterClosed().subscribe(result => {
    if(result === false){
      this.getWFHistory();
    }
    });
  }

  getWFHistory() {
    this.supplierAttact.GetWorkFlowDetails(this.supId).subscribe({
      next: (data) => {
        this.workFlowHistory = data.workflowHistory;
        console.log('eorkflow',this.workFlowHistory);
        

      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  gotoPreviousTab() {
    if (this.tabGroup?.selectedIndex !== null) {
      const nextIndex = this.tabGroup.selectedIndex - 1;
      this.tabGroup.selectedIndex = nextIndex; // Move to the next tab
    }
  }
  gotoNextTab() {
    if (this.tabGroup?.selectedIndex !== null) {
      const nextIndex = this.tabGroup.selectedIndex + 1;
      this.tabGroup.selectedIndex = nextIndex; // Move to the next tab
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
    console.log('result',result);
    
    this.SaveDraftFlag = result;
  }

  loadSupplier() {
    this.commonService.getSupplier(this.supplierId).subscribe({
      next: (data) => {
        this.supplier = data;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
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
