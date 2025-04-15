import { Component, Input, Output, EventEmitter, signal, viewChild } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { CommonService } from '../../core/services/common.service';
import { CategoryAndScopeVm, ChildCategoryVm, ParentCategoryVm, SubCategoryVm } from '../../core/models/category-scope.model';
import { AttachmentDto } from '../../core/models/supplier-attachment.model';
import { LicenseActivityDto } from '../../core/models/licence-activities.model';
import { DocumentInfoDto, } from '../../core/models/file-info.model';
import { RelatedPartyDiscDto } from '../../core/models/related-party-disc.model';
import { SupplierDto } from '../../core/models/supplier.model';
import { LicenseCertificationDto } from '../../core/models/licence-certificates.model';
import { AdminService } from '../../core/services/admin/admin.service';
import { ComplianceCheckService } from '../../core/services/supplier-management/supplier-compliance-checklist.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { _ } from '@ngx-translate/core';
import { MatDialog} from '@angular/material/dialog';
import { NgIf, NgFor, DatePipe, NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { LoginService } from '../../core/services/login/login.service';
import { CategoryScopeService } from '../../core/services/supplier-management/category-scope.service';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { LicenceActivityService } from '../../core/services/supplier-management/licence-activity.service';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';


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
  userData: any | null;
  manAttachmentDetail: AttachmentDto[] = new Array<AttachmentDto>();
  optAttachmentDetail: AttachmentDto[] = new Array<AttachmentDto>();
  supplier: SupplierDto = new SupplierDto();
  optionalAttachFlag: boolean = true;
  manFileInfo: DocumentInfoDto[] = new Array<DocumentInfoDto>();
  optFileInfo: DocumentInfoDto[] = new Array<DocumentInfoDto>();
  licenseActivityList: LicenseActivityDto[] = new Array<LicenseActivityDto>();
  saveAllRelatedPartyVm: RelatedPartyDiscDto[] = new Array<RelatedPartyDiscDto>();
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
  }

}