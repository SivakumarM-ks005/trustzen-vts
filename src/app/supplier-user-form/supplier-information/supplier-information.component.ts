import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { map, Observable, startWith } from 'rxjs';
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
    managerCommLicId: 0,
    managerFirstName: '',
    managerMiddleName: '',
    managerLastName: '',
    managerRole: 0,
    managerJobTitle: '',
    supplierType: '',
    typeOfOwnership: ''
  };
  selectedSupplierTypeId!: number;
  selectedSupplierRoleId!: number;
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

    // this.GetSupplierManagement();
    this.loadSupplier();
    this.loadOwnershipTypes();
    this.loadSupplierTypes();
    this.loadSupplierRole();
    this.inItSupplierForm(this.supplier);
    this.activateRouter?.params?.subscribe((response) => {
      if (response.status === 'In-Progress') {
        this.supplierForm.disable();
      } else if (response.profile === 'manageprofile') {
        this.supplierForm.disable();
        this.supplierForm.get('issuedDate')?.enable();
        this.supplierForm.get('expiryDate')?.enable();
      }
    });
  }

  loadSupplier(): void {
    this.commonService.getSupplier(this.supplierId).subscribe({
      next: (data) => {
        this.supplier = data;
        localStorage.setItem('supplierClassification', data?.supplierClassification);
        localStorage.setItem('issuedDate', data.issuedDate);
        localStorage.setItem('expiryDate', data.expiryDate);
        this.tabValidCheckEmit.emit();
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

      issuedBy: [data?.issuedBy || '', Validators.required],
      typeOfOwnershipId: [data?.typeOfOwnershipId || '', Validators.required],

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

      },
      error: (err) => {
        console.error('Error fetching ownership types', err);
      }
    });
  }
  loadSupplierTypes(): void {
    this.commonService.getSupplierTypes().subscribe({
      next: (data) => {

      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  loadSupplierRole(): void {
    this.commonService.getSupplierRole().subscribe({
      next: (data) => {

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

