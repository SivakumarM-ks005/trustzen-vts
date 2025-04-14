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
    public adminService: AdminService,
    public activateRouter: ActivatedRoute
  ) {

  }
  ngOnInit() {
    const storedData: any = localStorage.getItem('loginDetails');
    this.userData = JSON.parse(storedData);
    this.inItAddressForm();
    this.inItTaxForm();
    this.getCountry();
  }

  inItAddressForm(data?: any) {
    this.addressForm = this.fb.group({
      addressTypeId: [data?.addressTypeId || '', Validators.required],
      addressLine1: [data?.addressLine1 || '', Validators.required],
      addressLine2: [data?.addressLine2 || ''],
      addressLine3: [data?.addressLine3 || ''],
      poBox: [data?.poBox || ''],
      countryId: [data?.countryId || '', Validators.required],
      stateId: [data?.stateId || '', Validators.required],
      cityId: [data?.cityId || '', Validators.required],
      zipCode: [data?.zipCode || ''],
      mainOffixe: [data?.mainOffixe || false],
      registerAddressId: [data?.registerAddressId || 0],
      supplierId: [0],
      loggedIn: [0],
      deleteFlag: [false]
    });

  }

  inItTaxForm(data?: any) {
    this.taxForm = this.fb.group({
      taxDetails: this.fb.array([]),
    });

    // Populate tax details if editing existing data
    if (data?.taxInfo && data.taxInfo.length > 0) {
      data.taxInfo.forEach((taxDetail: any) => {
        this.addTaxDetail(taxDetail);
      });
    }
    if (this.taxDetails.length === 0) {
      this.addTaxDetail();
    }
  }

  get taxDetails(): FormArray {
    return this.taxForm.get('taxDetails') as FormArray;
  }

  isReadOnly(i: number): boolean {

    if (i === 0 && this.addressForm.get('mainOffixe')?.value) {
      return true;
    } else {
      return false;
    }
  }
  // Method to add a tax detail entry to FormArray
  addTaxDetail(taxDetail?: any): void {

    const taxDetailForm = this.fb.group({
      taxTypeId: [taxDetail?.taxTypeId || null, Validators.required],
      registrationNumber: [taxDetail?.registrationNumber || null, Validators.required],
      taxExemption: [taxDetail?.taxExemption || false],
      taxDetailId: [taxDetail?.taxDetailId || 0],
      registerAddressId: [taxDetail?.registerAddressId || 0],
    });
    this.taxDetails.push(taxDetailForm);
  }
  getCountry() {
    this.countryList = [];
    this.commonService.GetCountryDetails().subscribe((res) => {
      if (res) {
        this.countryList = res;
      }
    })
  }
  onAddClick(isNextClick: boolean = false): void {
    this.isSubmitted = true;
    if (!isNextClick && this.profileStatus === 'manageprofile') {
    } else {
      if (this.addedData.length > 0) {
        this.hasMainOffice = this.addedData.some((item: any) => item.mainOffixe === true);
      }

      if (isNextClick && this.addedData?.length !== 0 && this.editFlag && ((this.addressForm?.dirty && this.addressForm.valid) || (this.taxForm?.dirty && this.taxForm.valid))) {

        this.confirmatioPopUp(isNextClick);
        return;
      } else if (this.addressForm.valid && this.taxForm.valid && !isNextClick) {
        const combinedData = {
          ...this.addressForm.value,
          taxInfo: this.taxForm.value.taxDetails,
        };
        this.finalSaveAddressData = [combinedData];
        if (this.editFlag) {
          const index = this.addedData.findIndex(
            (address) => address.registerAddressId === combinedData.registerAddressId
          );
          this.stateList.forEach(ele => {
            if (this.addedData[index].stateId == ele.stateId) {
              this.addedData[index].stateName = ele.stateName;
            }
          });
          this.cityList.forEach(ele => {
            if (this.addedData[index].cityId == ele.cityId) {
              this.addedData[index].cityName = ele.cityName;
            }
          });
          this.countryList.forEach(ele => {
            if (this.addedData[index].countryId == ele.countryId) {
              this.addedData[index].countryName = ele.countryName;
            }
          });
          this.addressTypeList.forEach(ele => {
            if (this.addedData[index].addressTypeId == ele.addressTypeId) {
              this.addedData[index].addressType = ele.addressTypeName;
            }
          });
          this.taxTypeList.forEach(ele => {
            this.addedData[index].taxInfo.forEach(ele1 => {
              if (ele1.taxTypeId == ele.taxTypeId) {
                ele1.taxType = ele.taxTypeName;
              }
            })
          });
        } else {
          this.stateList.forEach(ele => {
            if (combinedData.stateId == ele.stateId) {
              combinedData.stateName = ele.stateName;
            }
          })
          this.cityList.forEach(ele => {
            if (combinedData.cityId == ele.cityId) {
              combinedData.cityName = ele.cityName;
            }
          });
          this.countryList.forEach(ele => {
            if (combinedData.countryId == ele.countryId) {
              combinedData.countryName = ele.countryName;
            }
          });
          this.addressTypeList.forEach(ele => {
            if (combinedData.addressTypeId == ele.addressTypeId) {
              combinedData.addressType = ele.addressTypeName;
            }
          });
          this.taxTypeList.forEach(ele => {
            combinedData.taxInfo.forEach((ele1: { taxTypeId: number; taxType: string; }) => {
              if (ele1.taxTypeId == ele.taxTypeId) {
                ele1.taxType = ele.taxTypeName;
              }
            })
          });
        }
        this.saveAddressDetails(isNextClick);
        return
      }
      else if (isNextClick && !this.addressForm.valid && !this.taxForm.valid) {
        if (this.addedData.length !== 0) {
          this.nextTabEmit.emit();
        } else {
          this.isSubmitted = true;
          this.addressForm.markAllAsTouched();
          this.taxForm.markAllAsTouched();
          return
        }
      } else if (this.addressForm.valid && this.taxForm.valid) {
        if (isNextClick) {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        } else {
          this.adminService.showMessage('Please fill in all mandatory fields before save');
        }
      }
    }
  }

  saveAddressDetails(isNextClick: boolean = false) {
    this.isSubmitted = true;
    if (this.addedData.length > 0) {
      this.hasMainOffice = this.addedData.some((item: any) => item.mainOffixe === true);
    }
  }

  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {
    if (this.addedData.length > 0) {
      this.hasMainOffice = this.addedData.some((item: any) => item.mainOffixe === true);
    }
    const addressFields = Object.values(this.addressForm.controls).some(control => control.value);
    const taxFields = Object.values(this.taxForm.controls).some(control => control.value);
    if (addressFields || (taxFields && this.taxForm.dirty)) {
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
          checkBtnValue: isNextClick ? "next" : isPreviousClick ? "previous" : ""
        },
      })

    } else {
      if (isNextClick) {
        if (this.addedData.length > 0 && this.hasMainOffice == false) {
          this.adminService.showMessage('Please select at least one address as the main office to proceed.');
          return;
        } else if (this.addedData.length > 0) {
          this.nextTabEmit.emit();
        } else {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        }
      }
      else {
        this.addressForm.reset();
        this.taxForm.reset();
        this.dialogResult.emit(true);
        // }
      }
    }
  }

}
