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
export class FinalSubmissionComponent  {

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
}
