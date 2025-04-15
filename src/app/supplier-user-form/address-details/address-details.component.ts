import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AdminService } from '../../core/services/admin/admin.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { LoginService } from '../../core/services/login/login.service';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { PreQualificationProcessComponent } from '@app/pre-qualification-process/pre-qualification-process.component';
interface BankCountrylist {
  countryId: number;
  countryName: string;
}
interface BankState {
  stateId: number;
  stateName: string;
}
interface BankCity {
  cityId: number;
  cityName: string;
}
interface addressTypeList {
  addressTypeId: number;
  addressTypeName: string;
}
interface taxTypeList {
  taxTypeId: number;
  taxTypeName: string;
}
interface AddedData {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressTypeId: number;
  addressType: string;
  cityId: number;
  cityName: string;
  countryId: number;
  countryName: string;
  stateId: number;
  stateName: string;
  deleteFlag: boolean;
  loggedIn: number;
  mainOffixe: boolean;
  poBox: string;
  registerAddressId: number;
  supplierId: number;
  zipCode: string;
  taxInfo: TaxDetail[];
}
interface TaxDetail {
  taxTypeId: number;
  taxType: string;
  registrationNumber: string;
  taxExemption: boolean;
}
@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrl: './address-details.component.scss',
  standalone: true,
  imports: [NgIf, MatButton, MatTooltip, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, NgFor, MatError, MatInput, MatCheckbox]
})
export class AddressDetailsComponent {
  @Input() supplierId: number;
  addedData: AddedData[] = [];
  countryList: BankCountrylist[] = [];
  addressTypeList: addressTypeList[] = [];
  taxTypeList: taxTypeList[] = [];
  stateList: BankState[] = [];
  cityList: BankCity[] = [];
  addressForm: FormGroup;
  taxForm: FormGroup;
  editFlag: boolean = false;
  getAddressFlag: boolean = false;
  userData: any | null;
  previousTabClick: boolean = false;
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  @ViewChild('deleteAddress') deleteAddress: any;
  alert = "Are you sure you want to delete the details on this card?";
  @Output() tabValidCheckEmit = new EventEmitter();
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  @Output() NextFlag = new EventEmitter<boolean>();
  country: any;
  enableAddTax: boolean = false;
  hasMainOffice: boolean = false;
  finalSaveAddressData: any[] = [];
  disableStatusBased: boolean = true;
  isSubmitted = false;
  matchingIds: boolean = false;
  @Output() commonValidation = new EventEmitter<string>();
  profileStatus: any;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private loginservice: LoginService,
    public commonService: CommonService,
    public supplierUserFormService: SupplierUserFormService,
    public adminService: AdminService,
    public activateRouter: ActivatedRoute
  ) {

  }

  ngOnInit() {
    const storedData: any = localStorage.getItem('loginDetails');
    this.userData = JSON.parse(storedData);
    this.getAddressType();
    this.getAddressDetails(this.supplierId);
    // this.inItAddressForm();
    this.inItTaxForm();
    this.getCountry();
    this.getTaxType();
    // this.checkAddressType();

    this.activateRouter?.params?.subscribe((response) => {
      console.log('response', response);
      if (response.status === 'In-Progress') {
        this.addressForm.disable();
        this.taxForm.get('taxDetails')?.disable();
        this.disableStatusBased = false;
      } else if (response.profile === 'manageprofile') {
        this.profileStatus = response.profile;
        this.addressForm.enable();
        this.taxForm.get('taxDetails')?.enable();
      }

    });
  }
  inItTaxForm(data?: any) {
    this.taxForm = this.fb.group({
      taxDetails: this.fb.array([]),
    });

    // Populate tax details if editing existing data
    if (data?.taxInfo && data.taxInfo.length > 0) {
      data.taxInfo.forEach((taxDetail: any) => {
        // this.addTaxDetail(taxDetail);
      });
    }

  }
  getCountry() {
    this.countryList = [];
    this.commonService.GetCountryDetails().subscribe((res) => {
      if (res) {
        this.countryList = res;
      }
    })
  }

  getState(countryId: number): void {
    this.stateList = [];
    this.cityList = [];
    this.country = this.countryList.find(c => c.countryId === countryId);
    localStorage.setItem('country', this.country?.countryName)
    this.loginservice.GetCountryBaseaState(countryId).subscribe((data) => {
      if (data) {
        this.stateList = data;
      }
    });
  }

  getCities(stateId: number): void {
    this.cityList = [];
    this.loginservice.GetStatebaseCity(stateId).subscribe((data) => {
      if (data) {
        this.cityList = data;
      }
    });
  }

  getAddressType() {
    this.countryList = [];
    this.commonService.getAddressType().subscribe((res) => {
      if (res) {
        this.addressTypeList = res;
      }
    })
  }

  checkAddressType() {
    this.matchingIds = this.addressTypeList
      .some(data1 => this.addedData.some(item2 => 'All-in-One Site' === item2?.addressType))
    if (this.matchingIds) {
      this.addressForm.disable();
      this.taxForm.disable();
    } else {
      this.addressForm.enable();
      this.taxForm.enable();
    }
  }

  getTaxType() {
    this.taxTypeList = [];
    this.commonService.getTaxType().subscribe((res) => {
      if (res) {
        this.taxTypeList = res;
      }
    })
  }

  getAddressDetails(supplierId: number) {
    this.getAddressFlag = true;
    this.supplierUserFormService.getAddressDetails(supplierId).subscribe((res: any) => {
      if (res) {
        if (res[0].firstTaxFalg == true) {
          this.inItTaxForm(res[0])
        } else {
          this.addedData = res;
        }
        this.checkAddressType();
      }
      this.tabValidCheckEmit.emit();
      // this.updateDefaultMainOfficeStatus();
    })
  }

}
