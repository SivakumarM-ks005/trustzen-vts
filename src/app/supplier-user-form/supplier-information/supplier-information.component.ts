import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { map, Observable, startWith } from 'rxjs';
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
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OnlyAllowedInputDirective, OnlyAllowedSymbolInputDirective } from '@app/core/directives/only-allowed-input.directive';
import { SupplierUserFormService } from '@app/core/services/supplier-management/supplier.user.form.service';
import { PreQualificationProcessComponent } from '@app/pre-qualification-process/pre-qualification-process.component';

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
    managerCommLicId: 0,
    managerFirstName: '',
    managerMiddleName: '',
    managerLastName: '',
    managerRole: 0,
    managerJobTitle: '',
    supplierType: '',
    typeOfOwnership: ''
  };

  supplierTypes: SupplierType[] = [];
  supplierRole: SupplierRole[] = [];
  selectedSupplierTypeId!: number;
  selectedSupplierRoleId!: number;

  ownershipTypes: OwnershipType[] = [];
  selectedOwnershipTypeId!: number;
  myControl = new FormControl('');
  options: string[] = ['Local Company', 'Overseas'];
  filteredOptions: Observable<string[]> | undefined;
  @Output() nextTabEmit = new EventEmitter();
  @Output() tabValidCheckEmit = new EventEmitter();
  maxDate = new Date();
  minDate: Date = new Date();
  @Output() dialogResult = new EventEmitter<boolean>();
  isSubmitted = false;
  isNext: boolean;
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  @Output() NextFlag = new EventEmitter<boolean>();
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

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.GetSupplierManagement();
    this.loadSupplier();
    this.loadOwnershipTypes();
    this.loadSupplierTypes();
    this.loadSupplierRole();
    this.inItSupplierForm(this.supplier);
    this.activateRouter?.params?.subscribe((response) => {
      if (response.status === 'In-Progress') {
        this.supplierForm.disable();
      } else if (response.profile === 'manageprofile') {
        this.profileStatus = response.profile;
        this.supplierForm.disable();
        this.supplierForm.get('issuedDate')?.enable();
        this.supplierForm.get('expiryDate')?.enable();
      }
    });
    // if (this.readonly)
    //   this.supplierForm.disable();
  }

  loadSupplier(): void {
    this.commonService.getSupplier(this.supplierId).subscribe({
      next: (data) => {
        this.supplier = data;
        localStorage.setItem('supplierClassification', data?.supplierClassification);
        localStorage.setItem('issuedDate',data.issuedDate);
        localStorage.setItem('expiryDate',data.expiryDate);
        this.tabValidCheckEmit.emit();
        this.populateFormWithSupplierData();
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  populateFormWithSupplierData(): void {
    if (this.supplier) {
      this.supplierForm.patchValue({
        supplierId: this.supplierId,
        loggedIn: 1,
        companyName: this.supplier.companyName,
        commercialLicenseNo: this.supplier.commercialLicenseNo,
        supplierClassification: this.supplier.supplierClassification,
        managerRole: this.supplier.role ? this.supplier.role : '',
        companyId: this.supplier.companyId,
        companyNameNative: this.supplier.companyNameNative,
        parentCompanyName: this.supplier.parentCompanyName,
        supplierTypeId: this.supplier.supplierTypeId,
        organizationWebsite: this.supplier.organizationWebsite,
        establishmentDate: this.parseDate(this.supplier.establishmentDate),
        commercialLicenseId: this.supplier.commercialLicenseId,
        issuedDate: this.parseDate(this.supplier.issuedDate),
        issuedBy: this.supplier.issuedBy,
        typeOfOwnershipId: this.supplier.typeOfOwnershipId ? this.supplier.typeOfOwnershipId : '',
        location: this.supplier.location,
        expiryDate: this.parseDate(this.supplier.expiryDate),
        managerCommLicId: this.supplier.managerCommLicId,
        managerFirstName: this.supplier.managerFirstName,
        managerMiddleName: this.supplier.managerMiddleName,
        managerLastName: this.supplier.managerLastName,
        managerJobTitle: this.supplier.managerJobTitle,
      });
    }
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
      managerCommLicId: [data?.managerCommLicId || ''],
      managerFirstName: [data?.managerFirstName || '', Validators.required],
      managerMiddleName: [data?.managerMiddleName || ''],
      managerLastName: [data?.managerLastName || '', Validators.required],
      managerRole: [data?.managerRole || '', Validators.required],
      managerJobTitle: [data?.managerJobTitle || '', Validators.required],
    });
    console.log(this.supplierForm);

  }
  loadOwnershipTypes(): void {
    this.commonService.getOwnershipTypes().subscribe({
      next: (data) => {
        this.ownershipTypes = data;
      },
      error: (err) => {
        console.error('Error fetching ownership types', err);
      }
    });
  }
  loadSupplierTypes(): void {
    this.commonService.getSupplierTypes().subscribe({
      next: (data) => {
        this.supplierTypes = data;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  loadSupplierRole(): void {
    this.commonService.getSupplierRole().subscribe({
      next: (data) => {
        this.supplierRole = data;
      },
      error: (err) => {
        console.error('Error fetching supplier role', err);
      }
    });
  }

  parseDate(dateString: string): Date | null {
    if (dateString === "0001-01-01T00:00:00" || !dateString) {
      return null; // Handle invalid or default date
    }
    return new Date(dateString); // Convert to Date object
  }

  onSubmit(isNextClick: boolean = false): void {
    this.isSubmitted = true;
    if (isNextClick && this.supplierForm.dirty && this.supplierForm.valid && this.supplier?.supplierTypeId && this.profileStatus === 'manageprofile' || !isNextClick && this.profileStatus === 'manageprofile') {
      this.preQualification();
    } else {
    
    if (isNextClick && this.supplierForm.dirty && this.supplierForm.valid && this.supplier?.supplierTypeId) {
      this.confirmatioPopUp(isNextClick);
    } else if (this.supplierForm.valid && !isNextClick) {

      this.supplierForm.value.supplierClassificationId = this.supplierForm.get('supplierClassificationId')?.setValue(this.supplier.supplierClassificationId);
      this.supplierForm.value.expiryDate = moment(this.supplierForm.value.expiryDate).format('YYYY-MM-DDTHH:mm:ssZ');
      this.supplierForm.value.establishmentDate = moment(this.supplierForm.value.establishmentDate).format('YYYY-MM-DDTHH:mm:ssZ');
      this.supplierForm.value.issuedDate = moment(this.supplierForm.value.issuedDate).format('YYYY-MM-DDTHH:mm:ssZ');
      const supplierData = this.supplierForm.value;

      this.commonService.saveSupplierInformation(supplierData).subscribe(
        response => {
          if (this.supplier?.supplierTypeId) {
            this.adminService.showMessage('Data on the form has been updated successfully');
          } else {
            this.adminService.showMessage('Data on the form has been saved successfully');
          }
          this.supplierForm.reset();
          this.loadSupplier();
          if (isNextClick) {
            setTimeout(() => {
              this.nextTabEmit.emit();
            }, 1000);
          }
        }
      );
    } else if (isNextClick && !this.supplierForm.dirty) {

      if (this.supplier?.supplierTypeId) {
        this.nextTabEmit.emit();
      } else {
        this.ValidationCheck();
      }
    } else if (this.supplierForm.valid) {
      if (isNextClick) {
        this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
      } else {
        this.adminService.showMessage('Please fill in all mandatory fields before save');
      }
    }
  }
  }



  ValidationCheck() {
    this.isSubmitted = true;
  }

  // Method to check invalid fields dynamically
  // checkInvalidFields() {
  //   const controls = this.supplierForm.controls;

  //   // Loop through each form control to check for missing or invalid fields
  //   for (const controlName in controls) {
  //     const control = controls[controlName];

  //     // If control is invalid and dirty (i.e., touched by the user)
  //     if (control.invalid && (control.value === null || control.value === undefined || control.value === '')) {
  //       const controlLabel = this.getControlLabel(controlName); // Optionally get the control's label for better messaging
  //       this.adminService.showMessage(`Field ${controlLabel} is required.`);
  //     }
  //   }
  // }

  // getControlLabel(controlName: string): string {
  //   // Explicitly define the type of the object
  //   const controlLabels: { [key: string]: string } = {
  //     companyName: 'Company Name',
  //     supplierClassification: 'Supplier Classification',
  //     organizationWebsite: 'Organization Website',
  //     commercialLicenseNo: 'Commercial License Number',
  //     issuedDate: 'Issued Date',
  //     issuedBy: 'Issued By',
  //     typeOfOwnershipId: 'Type of Ownership',
  //     location: 'Location',
  //     expiryDate: 'Expiry Date',
  //     managerFirstName: 'Manager First Name',
  //     managerLastName: 'Manager Last Name',
  //     managerRole: 'Manager Role',
  //     managerJobTitle: 'Manager Job Title',
  //     // Add more field names as necessary
  //   };

  //   return controlLabels[controlName] || controlName; // Default to the control name if it's not found
  // }

  confirmatioPopUp(isNextClick: boolean = false): void {

    const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: true,
      width: '35%',
      height: '40%',
      position: {
        top: 'calc(10vw + 20px)',
      },
      panelClass: 'confirmdialog',
      data: {
        parentDialogRef: this.commonService.dataLostModalConfig,  // Passing the parent dialog reference
        checkBtnValue: isNextClick ? "next" : ""
      },
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isNextClick) {
          // this.onSubmit()
          this.nextTabEmit.emit();
        } else {
          this.dialogResult.emit(true);
        }

        // this.onSubmit();

      } else {
        if (isNextClick) {
          return;
          // this.nextTabEmit.emit();

        } else {
          this.dialogResult.emit(true);
        }

      }
    });

  }

  preQualification(): void {

    const cancelDialogRef = this.dialog.open(PreQualificationProcessComponent, {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: true,
      width: '35%',
      height: '40%',
      position: {
        top: 'calc(10vw + 20px)',
      },
      panelClass: 'confirmdialog',
      data: {
        parentDialogRef: this.commonService.dataLostModalConfig,  // Passing the parent dialog reference
        moduleName: 'Supplier Information'
      },
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const supplierDatas = {
          supplierId: this.supplierId,
          loggedIn: 1,
          companyId: this.supplier?.companyId,
          companyName: this.supplier?.companyName,
          companyNameNative: this.supplier?.companyNameNative,
          parentCompanyName: this.supplier?.parentCompanyName,
          supplierClassification: this.supplier?.supplierClassification,
          supplierClassificationId: this.supplier.supplierClassificationId,
          supplierTypeId: this.supplier?.supplierTypeId,
          organizationWebsite: this.supplier?.organizationWebsite,
          commercialLicenseId: this.supplier?.commercialLicenseId,
          commercialLicenseNo: this.supplier?.commercialLicenseNo,
          establishmentDate: moment(this.supplierForm.value.establishmentDate).format('YYYY-MM-DDTHH:mm:ssZ'),
          issuedDate: moment(this.supplierForm.value.issuedDate).format('YYYY-MM-DDTHH:mm:ssZ'),
          issuedBy: this.supplier?.issuedBy,
          typeOfOwnershipId: this.supplier?.typeOfOwnershipId,
          location: this.supplier?.location,
          expiryDate: moment(this.supplierForm.value.expiryDate).format('YYYY-MM-DDTHH:mm:ssZ'),
          managerCommLicId: this.supplier?.managerCommLicId,
          managerFirstName: this.supplier?.managerFirstName,
          managerMiddleName: this.supplier?.managerMiddleName,
          managerLastName: this.supplier?.managerLastName,
          managerRole: this.supplier?.managerRole,
          managerJobTitle: this.supplier?.managerJobTitle,
        }
        
        this.commonService.saveSupplierInformation(supplierDatas).subscribe(
          response => {
            this.adminService.showMessage('Data on the form has been updated successfully');
            this.nextTabEmit.emit(10);
          }
        )

      } else {
        const supplierDatas = {
          supplierId: this.supplierId,
          loggedIn: 1,
          companyId: this.supplier?.companyId,
          companyName: this.supplier?.companyName,
          companyNameNative: this.supplier?.companyNameNative,
          parentCompanyName: this.supplier?.parentCompanyName,
          supplierClassification: this.supplier?.supplierClassification,
          supplierClassificationId: this.supplier.supplierClassificationId,
          supplierTypeId: this.supplier?.supplierTypeId,
          organizationWebsite: this.supplier?.organizationWebsite,
          commercialLicenseId: this.supplier?.commercialLicenseId,
          commercialLicenseNo: this.supplier?.commercialLicenseNo,
          establishmentDate: moment(this.supplierForm.value.establishmentDate).format('YYYY-MM-DDTHH:mm:ssZ'),
          issuedDate: moment(this.supplierForm.value.issuedDate).format('YYYY-MM-DDTHH:mm:ssZ'),
          issuedBy: this.supplier?.issuedBy,
          typeOfOwnershipId: this.supplier?.typeOfOwnershipId,
          location: this.supplier?.location,
          expiryDate: moment(this.supplierForm.value.expiryDate).format('YYYY-MM-DDTHH:mm:ssZ'),
          managerCommLicId: this.supplier?.managerCommLicId,
          managerFirstName: this.supplier?.managerFirstName,
          managerMiddleName: this.supplier?.managerMiddleName,
          managerLastName: this.supplier?.managerLastName,
          managerRole: this.supplier?.managerRole,
          managerJobTitle: this.supplier?.managerJobTitle,
        }
        
        this.commonService.saveSupplierInformation(supplierDatas).subscribe(
          response => {
            this.adminService.showMessage('Data on the form has been updated successfully');
          })

      }
    });

  }

  resetForm() {
    this.supplierForm.reset();
  }

  ClearValues(): boolean {
    if (this.supplierForm.valid) {
      this.SaveDraftFlag.emit(true)
    } else {
      this.SaveDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.supplierForm);
  }

  GetSupplierManagement() {
    this.SupplierUserForm.GetSupplierManagement().subscribe(res => {
      if (res) {
        this.SupplierManagement = res;
        this.tooltipValueForLicense = (this.SupplierManagement?.complianceRenewalBank?.captureBusinessLicenses && this.SupplierManagement?.licenseCertificate?.length > 0) ? this.SupplierManagement?.licenseCertificate[0]?.displayLabel : "Commercial License Number";
        this.checkLicenseCertificateAdmin = this.SupplierManagement?.complianceRenewalBank?.captureBusinessLicenses && this.SupplierManagement?.licenseCertificate?.length > 0;
        if (this.checkLicenseCertificateAdmin) {
          this.checkEstablishDateAdmin = this.SupplierManagement?.licenseCertificate[0]?.establishDate;
          this.checkIssueDateAdmin = this.SupplierManagement?.licenseCertificate[0]?.issueDate;
          this.checkExpiryDateAdmin = this.SupplierManagement?.licenseCertificate[0]?.expiryDate;
          this.checkIssueByAdmin = this.SupplierManagement?.licenseCertificate[0]?.issueBy;  // String
          this.checkIssueLocationAdmin = this.SupplierManagement?.licenseCertificate[0]?.issueLocation;
        }
      }
    })
  }

  NextButtonValidation(): boolean {
    if (this.supplier?.supplierTypeId) {
      this.NextFlag.emit(true)
    } else {
      this.NextFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.supplierForm);
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
  managerCommLicId: number,
  managerFirstName: string,
  managerMiddleName: string,
  managerLastName: string,
  managerRole: number,
  managerJobTitle: string
}
interface SupplierType {
  supplierTypeId: number;
  supplierName: string;
}

interface SupplierRole {
  roleId: number;
  roleName: string;
}
interface OwnershipType {
  typeOwnershipId: number;
  typeOwnershipName: string;
}
