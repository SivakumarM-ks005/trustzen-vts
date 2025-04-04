import { Component, Input, Output, EventEmitter, signal, viewChild } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { CommonService } from '../../core/services/common.service';
import { CategoryAndScopeVm, ChildCategoryVm, CategoryDocTypeMas, ParentCategoryVm, SubCategoryVm } from '../../core/models/category-scope.model';
import { AttachmentDto } from '../../core/models/supplier-attachment.model';
import { ActivityVm, LicenseActivityDto, SubActivityVm } from '../../core/models/licence-activities.model';
import { DocumentInfoDto, FileInfoDto } from '../../core/models/file-info.model';
import { RelatedPartyDiscDto } from '../../core/models/related-party-disc.model';
import { SupplierDto } from '../../core/models/supplier.model';
import { LicenseCertificationDto } from '../../core/models/licence-certificates.model';
import { AdminService } from '../../core/services/admin/admin.service';
import { ComplianceCheckService } from '../../core/services/supplier-management/supplier-compliance-checklist.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { _ } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NgIf, NgFor, DatePipe, NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { LoginService } from '../../core/services/login/login.service';
import { CategoryScopeService } from '../../core/services/supplier-management/category-scope.service';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { LicenceActivityService } from '../../core/services/supplier-management/licence-activity.service';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';
import { TaxPayerComponent } from '../../dialogs/tax-payer/tax-payer.component'


@Component({
  selector: 'app-supplier-form-preview',
  templateUrl: './supplier-form-preview.component.html',
  styleUrl: './supplier-form-preview.component.scss',
  standalone: true,
  imports: [MatAccordion, MatExpansionPanel, NgClass, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription, NgIf, NgFor, MatTooltip, DatePipe]
})
export class SupplierFormPreviewComponent {

  @Input() supplierId: number;
  @Output() public taxPayerPQ = new EventEmitter();
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
  filterParentCategoryOptions: ParentCategoryVm[] = new Array<ParentCategoryVm>();
  filterSubCategoryOptions: SubCategoryVm[] = new Array<SubCategoryVm>();
  filterChildCategoryOptions: ChildCategoryVm[] = new Array<ChildCategoryVm>();
  savaAllCategoryAndScopeVm: CategoryAndScopeVm[] = new Array<CategoryAndScopeVm>();
  supplierContacts: SupplierContact[] = [];
  userData: any | null;
  financialBusinessDetails: FinancialBusinessDetails = new FinancialBusinessDetails();
  supplierBanks: SupplierBank[] = [];
  manAttachmentDetail: AttachmentDto[] = new Array<AttachmentDto>();
  optAttachmentDetail: AttachmentDto[] = new Array<AttachmentDto>();
  supplier: SupplierDto = new SupplierDto();
  optionalAttachFlag: boolean = true;
  manFileInfo: DocumentInfoDto[] = new Array<DocumentInfoDto>();
  optFileInfo: DocumentInfoDto[] = new Array<DocumentInfoDto>();
  licenseActivityList: LicenseActivityDto[] = new Array<LicenseActivityDto>();
  saveAllRelatedPartyVm: RelatedPartyDiscDto[] = new Array<RelatedPartyDiscDto>();
  addressDetailsData: AddedData[] = [];
  saveAllLicenseVm: LicenseCertificationDto[] = new Array<LicenseCertificationDto>();
  complianceData: any[] = [];
  pqQuestionnaries: any;
  showPopup = false;
  popupImage: SafeResourceUrl | null = null;
  licensedActivitiesAndSubActivities: any;
  businessLicensesAndCertificates: any;
  relatedPartyInformation: any;
  isOpen: boolean = true;
  FinCurrencyList: any;
  managementDetails: any;
  constructor(public categoryScopeService: CategoryScopeService, public commonService: CommonService, public dialog: MatDialog,
    private loginservice: LoginService, private SupplierUserForm: SupplierUserFormService,
    private attachmentService: SupplierAttachmentService, private licenceActivityService: LicenceActivityService
    , private adminService: AdminService, public supplierservice: ComplianceCheckService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const storedData: any = localStorage.getItem('loginDetails');
    this.userData = JSON.parse(storedData);
    this.getSupplierManagement();
    this.initStaticDropDown();
    this.getSupplierInformation();
    this.GetSupplierBank();
    this.getAddressDetails(this.supplierId);
    this.GetContactDetails();
    this.GetFinancialBusinessDetails();
    this.getCategoryScopeList();
    this.getAttachmentData();
    this.getLicenseActivityDetails();
    this.getPQquestionnaries();
    this.getRelatedPartyDetail();
    this.getAllLicenseCertificationList();
    this.getComplianceCheckListData(this.supplierId);
  }

  getCurrency(): void {
    this.loginservice.GetCurrencyDetails().subscribe(data => {
      if (data) {
        console.log('this.financialBusinessDetails', this.financialBusinessDetails);

        this.FinCurrencyList = data.filter((d: { currencyId: any; }) => {
          if (d.currencyId === this.financialBusinessDetails.businessCreditInfos.currencyId) {
            return this.financialBusinessDetails.businessCreditInfos.currencyId
          }
        }
        );
        console.log('this.FinCurrencyList', this.FinCurrencyList);

      }
    });
  }

  getSupplierManagement() {
    this.SupplierUserForm.GetSupplierManagement().subscribe(res => {
      this.managementDetails = res;
      if (res.complianceRenewalBank) {
        this.licensedActivitiesAndSubActivities = res.complianceRenewalBank.captureLicensedActivities;
        this.businessLicensesAndCertificates = res.complianceRenewalBank.captureBusinessLicenses;
        this.relatedPartyInformation = res.complianceRenewalBank.captureRelatedPartyInformation;
      }
    })
  }

  initStaticDropDown() {
  }
  getCategoryScopeList() {
    this.categoryScopeService.getCategoryAndScopeDetails(this.supplierId)
      .subscribe({
        next: res => {
          this.savaAllCategoryAndScopeVm = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  getAttachmentData() {
    this.attachmentService.getAttachmentDetails(this.supplierId)
      .subscribe({
        next: res => {
          if (res.mandatoryAttachment.length > 0) {
            this.manAttachmentDetail = res.mandatoryAttachment;
            this.manAttachmentDetail.forEach(item => {
              item.uploadedDate = new Date(item.uploadedDate);
            });
            // this.manFileInfo = res.mandatoryAttachment.fileInfo;
            this.optionalAttachFlag = res.optionalAttachFlag;
            if (this.optionalAttachFlag) {
              this.optAttachmentDetail = res.optionalAttachment;
              this.optAttachmentDetail.forEach(item => {
                item.uploadedDate = new Date(item.uploadedDate);
              });
              // this.optAttachmentDetail.uploadedDate = new Date(this.optAttachmentDetail.uploadedDate);
              // this.optFileInfo = res.optionalAttachment.fileInfo;
            }
          }
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  getLicenseActivityDetails() {
    this.licenceActivityService.getLicenseActivityDetails(this.supplierId)
      .subscribe({
        next: res => {
          this.licenseActivityList = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  getRelatedPartyDetail() {
    this.licenceActivityService.getRelatedPartyDiscDetail(this.supplierId)
      .subscribe({
        next: res => {
          if (res.length > 0) {
            this.saveAllRelatedPartyVm = res;
            this.saveAllRelatedPartyVm.forEach(item => {
              item.startDate = new Date(item.startDate);
            });
          }
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  getAllLicenseCertificationList() {
    this.licenceActivityService.getLicenseCertifications(this.supplierId)
      .subscribe({
        next: res => {
          res.forEach((item, index) => {
            item.startDate = new Date(item.startDate);
            item.expiryDate = new Date(item.expiryDate);
            // item.relatedParty.startDate = new Date(item.relatedParty.startDate);
          });
          this.saveAllLicenseVm = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  downloadFile(path: string) {
    this.commonService.downloadOrOpenFile(path);
  }
  GetContactDetails() {
    this.loginservice.GetSupplierContact(this.supplierId).subscribe(res => {
      if (res && res.length > 0) {
        this.supplierContacts = res.map((data: any) => ({
          salutation: data.salutationName ?? 'N/A',
          firstName: data.firstName ?? 'N/A',
          middleName: data.middleName ?? 'N/A',
          lastName: data.lastName ?? 'N/A',
          jobTitle: data.jobTitle ?? 'N/A',
          roleName: data.roleName ?? 'N/A',
          email: data.email ?? 'N/A',
          phoneNumber: data.phoneNumber ?? 'N/A',
          mobileCode: data.mobileCode ?? 'N/A',
          phoneCode: data.phoneCode ?? 'N/A',
          mobileNumber: data.mobileNumber ?? 'N/A',
          isPrimaryContact: data.isPrimaryContact || false
        }));
      } else {
      }
    }
    );
  }
  GetFinancialBusinessDetails() {
    this.SupplierUserForm.GetFinancialBusinessDetails(this.supplierId).subscribe(data => {
      if (data) {
        this.financialBusinessDetails = data;
        this.getCurrency();
      }
    });
  }
  GetSupplierBank() {
    this.loginservice.GetSupplierBank(this.supplierId).subscribe(res => {
      if (res && res.length > 0) {
        this.supplierBanks = res.map((item: any) => ({
          bankName: item.bankName,
          branch: item.branch,
          currency: item.currency,
          country: item.country,
          state: item.state,
          city: item.city,
          accountNumber: item.accountNumber,
          swiftCodeBIC: item.swiftCodeBIC,
          iban: item.iban,
          bSB: item.bsb,
          routing: item.routing,
          iFSCCode: item.ifscCode,
          correspondentBank: item.correspondentBank,
          defaultBank: item.defaultBank,
        }));
      } else {
      }
    }
    );
  }
  getAddressDetails(supplierId: number) {
    this.SupplierUserForm.getAddressDetails(supplierId).subscribe((res: any) => {
      if (res) {
        this.addressDetailsData = res;
        localStorage.setItem('country', res[0]?.countryName)
      }
    })
  }
  getSupplierInformation(): void {
    this.commonService.getSupplier(this.supplierId).subscribe({
      next: (data) => {
        this.supplier = data;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }
  getComplianceCheckListData(supplierId: number) {
    this.supplierservice.GetComplianceCheckListData(supplierId).subscribe({
      next: (data) => {
        this.complianceData = data;
      },
      error: (err) => {
        console.error('Error fetching compliance data', err);
      }
    });
  }

  getPQquestionnaries() {

    this.commonService.GetpqquetionariesSupplier(this.supplierId).subscribe({
      next: (responses: any) => {
        this.commonService.getpqQuestionnariesList().subscribe({
          next: (template: any) => {
            this.pqQuestionnaries = this.mergeTemplateAndResponses(template[0], responses);
          },
          error: (err: any) => {
            console.error('Error fetching Quetionnaries data', err);
          }
        })
      }
    })

  }


  mergeTemplateAndResponses(template: any, responses: any[]): any {
    // Iterate through sections in the template
    template.sections.forEach((templateSection: any) => {
      // Find corresponding section in responses
      const responseSection = responses
        .flatMap(response => response.sections)
        .find(responseSec => responseSec.sectionID === templateSection.sectionID);

      if (responseSection) {
        // Iterate through questions in the template section
        templateSection.questions.forEach((templateQuestion: any) => {
          // Find corresponding question in responses
          const responseQuestion = responseSection.questions.find(
            (respQues: any) => respQues.questionID === templateQuestion.questionID
          );

          if (responseQuestion) {
            // Merge question responses
            templateQuestion.userResponse = responseQuestion.userResponse || "";
            templateQuestion.userResponseOption = responseQuestion.userResponseOption || "";
            templateQuestion.attachmentPath = responseQuestion.attachmentPath || "";
            templateQuestion.attachmentBase64 = responseQuestion.attachmentBase64 || "";
            templateQuestion.attachmentNamePath = responseQuestion.attachmentNamePath || "";

            // Handle child questions and responses
            templateQuestion.childQuestion.forEach((templateChild: any) => {
              const responseChild = responseQuestion.childResponses.find(
                (respChild: any) => respChild.childQuestionID === templateChild.childQuestionID
              );

              if (responseChild) {
                templateChild.userResponse = responseChild.userResponse || "";
                templateChild.userResponseOption = responseChild.userResponseOption || "";
                templateChild.attachmentPath = responseChild.attachmentPath || "";
                templateChild.attachmentBase64 = responseChild.attachmentBase64 || "";
                templateChild.attachmentNamePath = responseChild.attachmentNamePath || "";
              }
            });
          }
        });
      }
    });

    return template;
  }

  // Method to open the popup with the image
  openImagePopup(base64Image: string): void {
    this.popupImage = this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    this.showPopup = true;
  }

  // Method to close the popup
  closePopup(): void {
    this.showPopup = false;
    this.popupImage = null;
  }

  parseDate(establishmentDate: string): any {
    throw new Error('Method not implemented.');
  }
  openAccordionAll() {
    this.isOpen = true;
  }
  closeAccordionAll() {
    this.isOpen = false;
  }


  taxPayer() {
    this.taxPayerPQ.emit();
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
}

export class SupplierBank {

  bankName: string;
  branch: string;
  currency: string;
  country: string;
  state: string;
  city: string;
  accountNumber: string;
  swiftCodeBIC?: string;
  iban: string;
  bSB?: string;
  routing?: string;
  iFSCCode?: string;
  correspondentBank: boolean;
  defaultBank: boolean;
}
export class SupplierContact {

  salutation: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  jobTitle: string;
  roleName?: string;
  email: string;
  phoneNumber?: string;
  mobileCode: string;
  phoneCode?: string;
  mobileNumber: string;
  isPrimaryContact: boolean;
}

export class FinancialHealthDocsInfo {
  fileName: string;
  fileType: string;
  finDocId: number;
  financialHealthId: number;
}

export class FinancialHealthInfo {
  netProfitLast3Year: boolean;
  isFinancialStatementRequired: boolean;
  financialHealthDocsInfo: FinancialHealthDocsInfo;
}

export class ProjectDetail {
  projectName: string;
  projectDescription: string;
  customerName: string;
  startDate: string;
  endDate: string;
  countryName: string;
  currencyCode: string;
  value: number;

}

export class BusinessCreditInfo {
  currencyId: any;
  experienceName: string;
  currencyCode: string;
  aggregateValueProjects: number;
  maxValueOfProjectUndertake: number;
  creditLimit: number;
  creditExposureLimit: number;
  projectLimit: number;
}
export class AssetLiabilitieInfo {
  description: string;
  fromDateYear1: string;
  fromDateYear2: string;
  valueYear1: string;
  fromDateYear3: string;
  toDateYear1: string;
  valueYear2: string;
  toDateYear2: string;
  toDateYear3: string;
  valueYear3: string;

}
export class FinancialBusinessDetails {
  businessCreditInfos: BusinessCreditInfo;
  assetLiabilitieInfos: AssetLiabilitieInfo[] = new Array<AssetLiabilitieInfo>();
  financialHealthInfo: any;
  projectDetailsInfos: ProjectDetail[] = new Array<ProjectDetail>();

}
interface AddedData {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressType: string;
  cityName: string;
  countryName: string;
  stateName: string;
  deleteFlag: boolean;
  mainOffixe: boolean;
  poBox: string;
  zipCode: string;
  taxInfo: TaxDetail[];
}
interface TaxDetail {
  taxType: string;
  registrationNumber: string;
  taxExemption: boolean;
}