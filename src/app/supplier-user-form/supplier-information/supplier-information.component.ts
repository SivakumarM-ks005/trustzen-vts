import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { Observable } from 'rxjs';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormField, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { OnlyAllowedSymbolInputDirective } from '@app/core/directives/only-allowed-input.directive';
import { SupplierUserFormService } from '@app/core/services/supplier-management/supplier.user.form.service';

@Component({
  selector: 'app-supplier-information',
  templateUrl: './supplier-information.component.html',
  styleUrl: './supplier-information.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, OnlyAllowedSymbolInputDirective, MatFormField, MatLabel, MatInput, MatTooltip, NgIf, MatError, MatAutocompleteTrigger, MatAutocomplete, MatOption, MatSelect, NgFor, MatDatepickerInput, MatHint, MatDatepickerToggle, MatSuffix, MatDatepicker, AsyncPipe]
})
export class SupplierInformationComponent implements OnInit {

  @Input() readonly: boolean = false;
  @Input() supplierId: number;
  supplierForm!: FormGroup;
  supplier: Supplier = {
    companyName: '',
    commercialLicenseNo: '',
    supplierClassification: '',
    supplierClassificationId: 0,
    firstName: '',
    middleName: '',
    lastName: '',
    roleName: '',
    role: 0,
    mobile: '',
    email: '',
    companyId: 0,
    companyNameNative: '',
    parentCompanyName: '',
    supplierTypeId: 0,
    organizationWebsite: '',
    commercialLicenseId: 0,
    establishmentDate: '',
    issuedDate: '',
    issuedBy: '',
    typeOfOwnershipId: 0,
    location: '',
    expiryDate: '',
    supplierType: '',
    typeOfOwnership: ''
  };


  selectedSupplierTypeId!: number;
  selectedSupplierRoleId!: number;

  selectedOwnershipTypeId!: number;
  myControl = new FormControl('');
  options: string[] = ['Local Company', 'Overseas'];
  filteredOptions: Observable<string[]> | undefined;
  maxDate = new Date();
  minDate: Date = new Date();
  isSubmitted = false;
  isNext: boolean;
  SupplierManagement: any;
  tooltipValueForLicense: any;
  checkEstablishDateAdmin: boolean = true;
  checkLicenseCertificateAdmin: any = false;
  checkIssueDateAdmin: boolean = true;
  checkExpiryDateAdmin: boolean = true;
  checkIssueLocationAdmin: boolean = true;
  checkIssueByAdmin: any;
  profileStatus: any;

  constructor(private fb: FormBuilder,
    public commonService: CommonService,
    private adminService: AdminService,
    public activateRouter: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    public SupplierUserForm: SupplierUserFormService
  ) { }

  ngOnInit() {
    this.inItSupplierForm(this.supplier);
  }

  inItSupplierForm(data?: Supplier) {
    this.supplierForm = this.fb.group({
      supplierId: this.supplierId,
      loggedIn: 1,
      companyId: [data?.companyId || ''],
      companyName: [data?.companyName || '', Validators.required],
      companyNameNative: [data?.companyNameNative || ''],
      parentCompanyName: [data?.parentCompanyName || ''],
      supplierClassification: [data?.supplierClassification || '', Validators.required],
      supplierClassificationId: [0],
      supplierTypeId: [data?.supplierTypeId || '', Validators.required],
      organizationWebsite: [data?.organizationWebsite || ''],
      commercialLicenseId: [data?.commercialLicenseId || ''],
      commercialLicenseNo: [data?.commercialLicenseNo || '', Validators.required],
      establishmentDate: [new Date(), this.checkLicenseCertificateAdmin ? (this.checkEstablishDateAdmin ? Validators.required : Validators.nullValidator) : Validators.required],//[data?.establishmentDate || '', Validators.required],
      issuedDate: [data?.issuedDate || '', this.checkLicenseCertificateAdmin ? (this.checkIssueDateAdmin ? Validators.required : Validators.nullValidator) : Validators.required],
      issuedBy: [data?.issuedBy || '', Validators.required],
      typeOfOwnershipId: [data?.typeOfOwnershipId || '', Validators.required],
      location: [data?.location || '', this.checkLicenseCertificateAdmin ? (this.checkIssueLocationAdmin ? Validators.required : Validators.nullValidator) : Validators.required],
      expiryDate: [data?.expiryDate || '', this.checkLicenseCertificateAdmin ? (this.checkExpiryDateAdmin ? Validators.required : Validators.nullValidator) : Validators.required],
    });
    console.log(this.supplierForm);

  }

  onSubmit(isNextClick: boolean = false): void {
    this.isSubmitted = true;
    if (isNextClick && this.supplierForm.dirty && this.supplierForm.valid && this.supplier?.supplierTypeId && this.profileStatus === 'manageprofile' || !isNextClick && this.profileStatus === 'manageprofile') {
    }
  }

}

export interface Supplier {
  companyName: string;
  commercialLicenseNo: string;
  supplierClassification: string;
  supplierClassificationId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  roleName: string;
  role: number;
  mobile: string;
  email: string;
  companyId: number;
  companyNameNative: string;
  parentCompanyName: string,
  supplierTypeId: number,
  organizationWebsite: string,
  commercialLicenseId: number,
  establishmentDate: string,
  issuedDate: string,
  issuedBy: string,
  supplierType: string,
  typeOfOwnership: string,
  typeOfOwnershipId: number,
  location: string,
  expiryDate: string,
}



