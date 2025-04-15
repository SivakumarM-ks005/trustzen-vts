import { Component, Input, Output, EventEmitter, signal, viewChild } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { CommonService } from '../../core/services/common.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { ComplianceCheckService } from '../../core/services/supplier-management/supplier-compliance-checklist.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { _ } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
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

  showPopup = false;
  popupImage: SafeResourceUrl | null = null;
  relatedPartyInformation: any;
  isOpen: boolean = true;

  constructor(public categoryScopeService: CategoryScopeService, public commonService: CommonService, public dialog: MatDialog,
    public supplierservice: ComplianceCheckService) { }

  ngOnInit() {
    const storedData: any = localStorage.getItem('loginDetails');
    // this.userData = JSON.parse(storedData);
  }

}