import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import moment from 'moment';

@Component({
  selector: 'app-final-submission',
  templateUrl: './final-submission.component.html',
  styleUrl: './final-submission.component.scss',
  standalone: true,
  imports: [MatCheckbox, FormsModule, ReactiveFormsModule]
})
export class FinalSubmissionComponent implements OnInit {

  acknowledgmentControlStandardDeclaration = new FormControl();
  acknowledgmentControlConflictOfInterest = new FormControl();
  acknowledgmentControlLitigations = new FormControl();
  userData: any | null;
  @Input() supplierId: number;
  @Input() supplierManagementDet: any;
  @Output() dialogResult = new EventEmitter<boolean>();
  supplier: any;
  status: any;

  constructor(
    private SupplierUserForm: SupplierUserFormService,
    public route: Router,
    public adminService: AdminService,
    public common: CommonService,
    public activateRouter: ActivatedRoute
  ) {
  }

  ngOnInit() {

    this.activateRouter?.params?.subscribe((response) => {

      if (response.profile === 'manageprofile') {
        this.status = response.profile;
      }

    });

    const storedData: any = localStorage.getItem('loginDetails');
    if (JSON.parse(storedData)?.supplierCompletedFlag) {
      this.acknowledgmentControlStandardDeclaration = new FormControl(true);
      this.acknowledgmentControlStandardDeclaration.disable();
      this.acknowledgmentControlConflictOfInterest = new FormControl(true);
      this.acknowledgmentControlConflictOfInterest.disable();
      this.acknowledgmentControlLitigations = new FormControl(true);
      this.acknowledgmentControlLitigations.disable();
    } else {
      this.acknowledgmentControlStandardDeclaration = new FormControl(false);
      this.acknowledgmentControlConflictOfInterest = new FormControl(false);
      this.acknowledgmentControlLitigations = new FormControl(false);
    }
    this.userData = JSON.parse(storedData);
  }

  SaveFinalSubmission() {
    if (this.status === 'manageprofile') {
      this.common.getSupplier(this.supplierId).subscribe({
        next: (data) => {
          
          if(moment(localStorage.getItem('expiryDate')).format('YYYY-MM-DDTHH:mm:ssZ') !== moment(data.expiryDate).format('YYYY-MM-DDTHH:mm:ssZ')){
            this.adminService.showMessage('Updated Commercial/Trade License');
       
          }else if(moment(localStorage.getItem('issuedDate')).format('YYYY-MM-DDTHH:mm:ssZ') !== moment(data.issuedDate).format('YYYY-MM-DDTHH:mm:ssZ')){
            this.adminService.showMessage('Updated Commercial/Trade License');

          }
        }
      })
    } else {
      //Check standard declaration
      if (this.supplierManagementDet?.complianceRenewalBank?.captureStandardDeclaration && !this.acknowledgmentControlStandardDeclaration.value) {
        this.adminService.showMessage("Please ensure all required options are checked to complete the form and proceed");
        return;
      }
      //Check Declaration of Conflict of Interest
      if (this.supplierManagementDet?.complianceRenewalBank?.captureConflictOfInterest && !this.acknowledgmentControlConflictOfInterest.value) {
        this.adminService.showMessage("Please ensure all required options are checked to complete the form and proceed");
        return;
      }
      //Check Ongoing/Previous Litigations
      if (this.supplierManagementDet?.complianceRenewalBank?.captureOngoingLitigations && !this.acknowledgmentControlLitigations.value) {
        this.adminService.showMessage("Please ensure all required options are checked to complete the form and proceed");
        return;
      }
      // if (this.acknowledgmentControlStandardDeclaration.value) {
      const comFlag = true;
      this.SupplierUserForm.SupplierFinalSubmission(comFlag, this.supplierId, this.userData.userId).subscribe(res => {
        if (res === true) {
          this.adminService.showMessage('Final submission saved successfully');
          this.route.navigate(['/krya/dashboard'], { skipLocationChange: true, replaceUrl: true });
        } else {
          this.adminService.showMessage("Final submission failed");
        }
      })
    }
    // } else {
    //   this.adminService.showMessage("Please check the acknowledgment box to proceed");
    // }
  }

  // confirmatioPopUp(): void {
  //   const isAcknowledgmentDirtyOrFilled = this.acknowledgmentControl.dirty || this.acknowledgmentControl.value;

  //   if (isAcknowledgmentDirtyOrFilled) {
  //     this.common.openCancelDialog(this.acknowledgmentControl, null, this.dialogResult);
  //   } else {
  //     this.acknowledgmentControl.reset();
  //     this.dialogResult.emit(true);
  //   }
  // }

}
