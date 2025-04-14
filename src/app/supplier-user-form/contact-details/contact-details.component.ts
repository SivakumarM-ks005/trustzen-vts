import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor, UpperCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { LoginService } from '../../core/services/login/login.service';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { OnlyAllowedSymbolInputDirective } from '@app/core/directives/only-allowed-input.directive';
@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, UpperCasePipe, OnlyAllowedSymbolInputDirective, NgIf, MatButton, MatTooltip, MatFormField, MatLabel, MatSelect, MatOption, NgFor, MatError, MatInput, MatCheckbox]
})
export class ContactDetailsComponent implements OnInit {
  @Input() supplierId: number;
  contactForm: FormGroup;
  editFlag: boolean = false;
  finalSavedata: any[] = [];
  primarycontactDetails: ContactForm[] = [];
  SecondarycontactDetails: ContactForm[] = [];
  userData: any | null;
  readonlyMode: boolean = false;
  previousTabClick: boolean = false;
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  @Output() tabValidCheckEmit = new EventEmitter();
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  primaryContact: boolean;
  disableStatusBased: boolean = true;
  isSubmitted = false;
  @Output() NextFlag = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private loginservice: LoginService,
    public supplierUserFormService: SupplierUserFormService,
    public adminService: AdminService,
    public commonService: CommonService,
    private dialog: MatDialog,
    public activateRouter: ActivatedRoute
  ) {
    // Initializing with one contact form.
  }
  ngOnInit() {
    const storedData: any = localStorage.getItem('loginDetails');
    this.userData = JSON.parse(storedData);
    this.GetContactDetails();
    this.InitForms();
    this.DropDownSupplierRole();
    this.DropDownSuppliersalutation();

    this.activateRouter?.params?.subscribe((response) => {
      if (response.status === 'In-Progress') {
        this.contactForm.disable();
        this.disableStatusBased = false;
      }
    });
  }

  createContact() {
  }

  InitForms(contact?: any) {
    this.contactForm = this.fb.group({
      contactId: [contact?.contactId || 0],
      supplierId: [contact?.supplierId || 0],
      loggedIn: [contact?.loggedIn || 0],
      salutationName: [contact?.salutationName || ''],
      salutationId: [contact?.salutationId || null, Validators.required],
      firstName: [contact?.firstName || '', Validators.required],
      middleName: [contact?.middleName || ''],
      lastName: [contact?.lastName || '', Validators.required],
      jobTitle: [contact?.jobTitle || '', Validators.required],
      roleName: [contact?.roleName || ''],
      roleId: [contact?.roleId || null, Validators.required],
      email: [contact?.email || '', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneCode: [contact?.phoneCode || ''],
      phoneNumber: [contact?.phoneNumber || ''],
      mobileCode: [contact?.mobileCode || ''],
      phoneCodeCountryId: [contact?.phoneCodeCountryId || 0],
      mobileCodeCountryId: [contact?.mobileCodeCountryId || 0, Validators.required],
      mobileNumber: [contact?.mobileNumber || '', Validators.required],
      isPrimaryContact: [contact?.isPrimaryContact || false]
    });
  }
  DropDownSupplierRole(): void {
    this.loginservice.getSupplierRole().subscribe(data => {

    });
  }
  DropDownSuppliersalutation(): void {
    this.loginservice.GetSalutationDetails().subscribe(data => {

    });
  }

  GetContactDetails() {
    this.loginservice.GetSupplierContact(this.supplierId).subscribe(response => {
      if (response.length !== 0) {
        this.SecondarycontactDetails = response;
        if (this.SecondarycontactDetails.length === 1 && this.SecondarycontactDetails[0].firstContactFlag === true) {
          this.readonlyMode = true;
          this.InitForms(this.SecondarycontactDetails[0])

        }
      }
      this.tabValidCheckEmit.emit();
    });
  }

  checkprimaryContact() {
    this.SecondarycontactDetails?.forEach(data => {
      if (this.editFlag && !this.contactForm.get('isPrimaryContact')?.value && data?.isPrimaryContact && this.contactForm.get('jobTitle')?.value === data?.jobTitle) {
        this.adminService.showMessage('Please select at least one address as the Primary Contact to proceed.');
      }
    })
  }

  NextButtonValidation() {
    if (this.SecondarycontactDetails?.length !== 0) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false);
    }
  }
}


export class ContactForm {
  contactId: number = 0;
  supplierId: number = 0;
  loggedIn: number = 0;
  salutationId: number = 0;
  salutationName: string = '';
  firstName: string = '';
  middleName?: string;
  lastName: string = '';
  jobTitle: string = '';
  roleName?: string;
  roleId: number = 0;
  email: string = '';
  phoneCode?: string | null;
  phoneNumber?: string;
  mobileCode?: string;
  mobileNumber: string = '';
  phoneCodeCountryId: number = 0;
  mobileCodeCountryId: number = 0;
  isPrimaryContact: boolean = false;
  firstContactFlag: boolean = false;
}