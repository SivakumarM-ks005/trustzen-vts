import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { LicenceCertificatesComponent } from './licence-certificates/licence-certificates.component';
import { LicenceActivitiesComponent } from './licence-activities/licence-activities.component';
import { RelatedPartyDiscComponent } from './related-party-disc/related-party-disc.component';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';

@Component({
    selector: 'app-reg-activities-certificate',
    templateUrl: './reg-activities-certificate.component.html',
    styleUrl: './reg-activities-certificate.component.scss',
    standalone: true,
    imports: [MatTabGroup, MatTab, LicenceActivitiesComponent, LicenceCertificatesComponent, RelatedPartyDiscComponent]
})
export class RegActivitiesCertificateComponent implements OnInit {
  @Input() supplierId: number;
  @Input() userId: number;
  links: any = [];
  licensedActivitiesAndSubActivities: boolean = false;
  businessLicensesAndCertificates: boolean = false;
  relatedPartyInformation: boolean = false;
  showActivity: boolean = false;
  showLicense: boolean = false;
  showRelated: boolean = false;
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  @Output() tabValidCheckEmit = new EventEmitter();
  @ViewChild('tabGroupReg') tabGroupReg!: MatTabGroup;
  @ViewChild(LicenceActivitiesComponent) childActivity: LicenceActivitiesComponent;
  @ViewChild(LicenceCertificatesComponent) childLicense: LicenceCertificatesComponent;
  @ViewChild(RelatedPartyDiscComponent) childRelatedParty: RelatedPartyDiscComponent;
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  @Output() NextFlag = new EventEmitter<boolean>();

  constructor(private supplierUserFormService: SupplierUserFormService) { }
  ngOnInit() {
    this.getFlags();
  }
  getFlags() {
    this.supplierUserFormService.GetSupplierManagement().subscribe(res => {
      if (res.complianceRenewalBank) {
        this.licensedActivitiesAndSubActivities = res.complianceRenewalBank.captureLicensedActivities;
        this.businessLicensesAndCertificates = res.complianceRenewalBank.captureBusinessLicenses;
        this.relatedPartyInformation = res.complianceRenewalBank.captureRelatedPartyInformation;
        let activityScreen = {
          id: 1, name: 'Licensed Activities and Sub-Activities', showHide: false,
          isShow: this.licensedActivitiesAndSubActivities, compName: 'activity'
        }
        this.links.push(activityScreen);
        let licenseScreen = {
          id: 2, name: 'Business Licenses and Certificates', showHide: false,
          isShow: this.businessLicensesAndCertificates, compName: 'certificate'
        }
        this.links.push(licenseScreen);
        let relatedScreen = {
          id: 3, name: 'Related Party Disclosures', showHide: false,
          isShow: this.relatedPartyInformation, compName: 'relatedParty'
        }
        this.links.push(relatedScreen);
        this.links = this.links.filter((xe: any) => xe.isShow);
        this.links[0].showHide = true;
      }
    });
  }

  getNextFlag(data: any){
   const pageName = data;
   this.NextFlag.emit(pageName)
    
  }
  previousTab() {
    if (this.tabGroupReg.selectedIndex === 0) {
      this.dialogResult.emit(true);
    } if (this.tabGroupReg.selectedIndex === 2) {
      this.tabGroupReg.selectedIndex = 1;
    }
    else {
      this.tabGroupReg.selectedIndex = 0;
    }
  }
  nextTab(data: any) {
    console.log(data);
    if(data){
      this.nextTabEmit.emit(3);
    }else{
    if ((this.links.length - 1) === this.tabGroupReg.selectedIndex) {
      this.nextTabEmit.emit();
    } else {
      if (this.tabGroupReg?.selectedIndex !== null) {
        this.links.forEach((ln: any) => {
          ln.showHide = false;
        });
        this.links[this.tabGroupReg.selectedIndex].showHide = true;
        const nextIndex = (this.tabGroupReg.selectedIndex + 1);
        this.tabGroupReg.selectedIndex = nextIndex; // Move to the next tab
      }
    }
  }
  }

  tabClick(tab: any) {
    this.links.forEach((ln: any) => {
      ln.showHide = false;
    });
    this.links[tab.index].showHide = true;
  }
  goPageUp(el: HTMLElement){
    el.scrollIntoView();
  }
}
