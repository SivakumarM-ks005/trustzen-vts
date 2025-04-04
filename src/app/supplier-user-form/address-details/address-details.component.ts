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
    this.inItAddressForm();
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
        moduleName: 'Supplier Address'
      },
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
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
        this.saveAddressDetails(false);
        this.nextTabEmit.emit(9);
      } else {
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
        this.saveAddressDetails(false);
      }
    });

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

  // checkInvalidFields() {
  //   const controls = this.addressForm.controls;

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
  //     addressTypeId: 'Address Type',
  //     addressLine1: 'Address Line1',
  //     countryId: 'Country',
  //     stateId: 'State/Province',
  //     cityId: 'City',
  //     // Add more field names as necessary
  //   };

  //   return controlLabels[controlName] || controlName; // Default to the control name if it's not found
  // }

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
  ClearValues(): boolean {
    // this.SaveDraftFlag.emit(this.commonService.CommonClearValues(this.addressForm, this.taxForm))

    if (this.addressForm.valid) {
      if (this.taxForm.valid) {
        this.SaveDraftFlag.emit(true)
      } else {
        this.SaveDraftFlag.emit(false)
      }
    } else {
      this.SaveDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.addressForm, this.taxForm);
  }

  unValidate(index: number): void {
    const taxDetailGroup = this.taxDetails.at(index) as FormGroup;
    if (taxDetailGroup.get('taxExemption')?.value) {
      taxDetailGroup.get('taxTypeId')?.clearValidators();
      taxDetailGroup.get('registrationNumber')?.clearValidators();
    } else {
      taxDetailGroup.get('taxTypeId')?.setValidators(Validators.required);
      taxDetailGroup.get('registrationNumber')?.setValidators(Validators.required);
    }
    taxDetailGroup.get('taxTypeId')?.updateValueAndValidity();
    taxDetailGroup.get('registrationNumber')?.updateValueAndValidity();
    this.taxDetails.updateValueAndValidity();
  }

  // Method to remove a tax detail entry
  // removeTaxDetail(index: number): void {
  //   this.taxDetails.removeAt(index);
  // }

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

  editAddress(data: any, i: number, el: HTMLElement) {

    el.scrollIntoView();
    this.editFlag = true;

    this.getState(data.countryId);
    this.getCities(data.stateId);
    this.inItAddressForm(data); // Initialize form with the data to be edited
    this.inItTaxForm(data);
    this.taxDetails.controls.forEach((_, index) => {
      this.unValidate(index);
    });
    this.taxForm.updateValueAndValidity();
    this.enableAddTaxButton();
    this.activateRouter?.params?.subscribe((response) => {
      if (response.status === 'In-Progress') {
        this.addressForm.disable();
        this.taxForm.get('taxDetails')?.disable();
        this.disableStatusBased = false;
      } else if (response.profile === 'manageprofile') {
        this.addressForm.enable();
        this.taxForm.get('taxDetails')?.enable();
      }

    });
  }

  // Save the form data and pass it back to the parent


  onAddClick(isNextClick: boolean = false): void {
    this.isSubmitted = true;
    if (!isNextClick && this.profileStatus === 'manageprofile') {
      this.preQualification();
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

  checkmainOffice() {
    this.addedData?.forEach(data => {
      if (this.editFlag && !this.addressForm.get('mainOffixe')?.value && data?.mainOffixe && this.addressForm.get('addressLine1')?.value === data?.addressLine1) {
        this.adminService.showMessage('Please select at least one address as the main office to proceed.');
      }
    })
  }

  saveAddressDetails(isNextClick: boolean = false) {
    this.isSubmitted = true;
    if (this.addedData.length > 0) {
      this.hasMainOffice = this.addedData.some((item: any) => item.mainOffixe === true);
    }
    // if (this.addressForm.invalid) {
    //   this.checkInvalidFields();
    //   return;
    // }
    //   else 
    // if(!this.hasMainOffice){
    //   this.adminService.showMessage('Please select at least one address as the main office to proceed.');
    // }
    if (this.finalSaveAddressData.length > 0) {
      this.finalSaveAddressData.forEach(ele => {
        ele.supplierId = this.supplierId;
        ele.loggedIn = this.userData.userId;
      });
      this.supplierUserFormService.saveAddressDetails(this.finalSaveAddressData).subscribe((res: any) => {
        if (res.success) {
          this.isSubmitted = false;
          this.addressForm.clearValidators();
          this.taxForm.clearValidators();
          if (this.editFlag) {
            this.adminService.showMessage('Data on the form has been updated successfully');
          } else {
            this.adminService.showMessage('Data on the form has been saved successfully');
          }
          this.resetForm();
          this.getAddressDetails(this.supplierId);
          if (isNextClick) {
            if (this.addedData.length > 0 && this.hasMainOffice == false) {
              this.adminService.showMessage('Please select at least one address as the main office to proceed.');
              return;
            } else {
              setTimeout(() => {
                this.nextTabEmit.emit();
              }, 1000);
            }
          }
          if (this.previousTabClick) {
            if (this.addedData.length > 0 && this.hasMainOffice == false) {
              this.adminService.showMessage('Please select at least one address as the main office to proceed.');
              return;
            } else {
              setTimeout(() => {
                this.dialogResult.emit(true);
              }, 1000);
            }
          }
        } else {
          this.adminService.showMessage(res.message);
        }
      })
    }
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
  deleteTaxandAddress(i: number) {
    const address = this.addedData[i];
    const registerAddressId = address.registerAddressId;
    const supplierId = address.supplierId;
    if (registerAddressId) {
      this.supplierUserFormService.deleteAddressDetails(registerAddressId, supplierId, this.userData.userId).subscribe((res: any) => {
        if (res.success) {
          this.addedData.splice(i, 1);
          this.adminService.showMessage(res.message);
          this.getAddressDetails(this.supplierId);
        } else {
          this.adminService.showMessage(res.message);
        }
      })
    }
    else {
      this.addedData.splice(i, 1);
    }
  }
  deleteTaxDetails(i: number, data: any) {
    const tax = data.value[i];
    if (tax.registerAddressId && tax.taxDetailId) {
      this.supplierUserFormService.deleteTaxDetails(tax.registerAddressId, tax.taxDetailId, this.userData.userId, this.supplierId).subscribe((res: any) => {
        if (res.success) {
          this.taxDetails.removeAt(i);
          this.adminService.showMessage(res.message);
        } else {
          this.adminService.showMessage(res.message);
        }
      });
    } else {
      this.taxDetails.removeAt(i);
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
      })//, this.commonService.dataLostModalConfig;
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (isNextClick) {
            // this.addressForm.markAllAsTouched();
            // this.taxForm.markAllAsTouched();
            // this.onAddClick();
            this.nextTabEmit.emit();
            // return;
          } else {
            this.dialogResult.emit(true);
            this.previousTabClick = true;
            // this.onAddClick();
          }
        } else {
          //New condition for previous No Btn
          if (isPreviousClick) {
            return;
          }
          if (isNextClick) {
            return;
            // if (this.addedData.length > 0 && this.hasMainOffice == false) {
            //   this.adminService.showMessage('Please select at least one address as the main office to proceed.');
            //   return;
            // } else {
            //   this.nextTabEmit.emit();
            // }
          }
          else {
            this.addressForm.markAllAsTouched();
            this.taxForm.markAllAsTouched();
            // if (this.addedData.length > 0 && this.hasMainOffice == false) {
            //   this.adminService.showMessage('Please select at least one address as the main office to proceed.');
            //   return;
            // } else {
            this.dialogResult.emit(true);
            // }
          }
        }
      });
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
        // if (this.hasMainOffice == false || this.addedData.length > 0) {
        //   this.adminService.showMessage('Please select at least one address as the main office to proceed.');
        //   return;
        // } else if (this.addedData.length == 0) {
        //   this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        // } else {
        this.addressForm.reset();
        this.taxForm.reset();
        this.dialogResult.emit(true);
        // }
      }
    }
  }

  NextButtonValidation() {
    if (this.addedData?.length !== 0) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false);
    }
  }

  resetForm() {
    this.addressForm.reset({
      addressTypeId: '',
      countryId: '',
      stateId: '',
      cityId: ''
    });
    this.taxForm.reset();
    this.taxDetails.clear();
    this.addTaxDetail();
    this.editFlag = false;
    this.stateList = [];
    this.cityList = [];
    this.enableAddTaxButton();
  }

  deletePopUp(ind: number) {
    const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, this.commonService.deletetModalConfig);
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTaxandAddress(ind);
      } else {
        this.dialog.closeAll();
      }
    });
  }

  enableAddTaxButton() {
    if (this.editFlag == false) {
      const addressFields = Object.entries(this.addressForm.controls)
        .filter(([key]) => key !== 'mainOffixe')
        .some(([_, control]) => control.value);
      const defaultAddressControl = this.addressForm.get('mainOffixe');

      if (addressFields) {
        if (this.addedData.length === 0) {
          defaultAddressControl?.setValue(true);
        }
      } else {
        if (this.addedData.length === 0) {
          defaultAddressControl?.setValue(false);
        }
      }
    }
    if (this.addressForm.valid) {
      this.enableAddTax = true;
    } else {
      this.enableAddTax = false;
    }
  }

  // openCancelDialog(): void {
  //   const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     disableClose: false,
  //     hasBackdrop: true,
  //     autoFocus: true,
  //     width: '25%',
  //     height: '40%',
  //     position: {
  //       top: 'calc(10vw + 20px)',
  //     },
  //     data: {
  //       flag: true,
  //     },
  //   });

  //   cancelDialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.addressForm.reset();
  //       this.taxForm.reset();
  //       this.dialogResult.emit(result);
  //     } else {
  //       this.dialogResult.emit(false);
  //     }
  //   });
  // }

}
