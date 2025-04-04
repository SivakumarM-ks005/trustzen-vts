import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin/admin.service';
import { debug } from 'console';
import { CommonService } from '../../core/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
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
import { OnlyAllowedInputDirective, OnlyAllowedSymbolInputDirective } from '@app/core/directives/only-allowed-input.directive';
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
  suppliersalutation: Salutation[] = [];
  supplierRole: Role[] = [];
  supplierPhoneCode: countryPhcode[] = [];
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
    //this.addContact();
    this.DropDownSupplierRole();
    this.DropDownSuppliersalutation();
    this.DropDowncountryCode();
    // if(this.SecondarycontactDetails.length === 0){
    // this.saveUpdateContact();
    // }else{
    //   this.isSubmitted = false;
    // }
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
    // if (this.readonlyMode) {
    //   // Disable all fields except `mobileNumber` and `isPrimaryContact`
    //   Object.keys(this.contactForm.controls).forEach((field) => {
    //     if (field !== 'contactId' && field !== 'supplierId' && field !== 'loggedIn' && field !== 'phoneCode' && field !== 'isPrimaryContact' && field !== 'phoneNumber' && field !== 'phoneCodeCountryId'  ) {
    //       this.contactForm.get(field)?.disable();
    //     }
    //   });
    // } else {
    //   this.contactForm.enable();
    // }
  }

  // getControlLabel(controlName: string): string {
  //   // Explicitly define the type of the object
  //   const controlLabels: { [key: string]: string } = {
  //     salutationId: 'Salutation Name',
  //     firstName: 'First Name',
  //     lastName: 'Last Name',
  //     jobTitle: 'Job Title',
  //     roleId : 'Role',
  //     email : 'Email',
  //     mobileCode: 'Mobile Code',
  //     mobileNumber: 'Mobile Phone'
  //     // Add more field names as necessary
  //   };

  //   return controlLabels[controlName] || controlName; // Default to the control name if it's not found
  // }

  DropDowncountryCode(): void {
    this.loginservice.getCountry().subscribe(data => {
      if (data) {
        this.supplierPhoneCode = data;
      }
    });
  }
  DropDownSupplierRole(): void {
    this.loginservice.getSupplierRole().subscribe(data => {
      if (data) {
        this.supplierRole = data;
      }
    });
  }
  DropDownSuppliersalutation(): void {
    this.loginservice.GetSalutationDetails().subscribe(data => {
      if (data) {
        this.suppliersalutation = data;
      }
    });
  }
  onCountryCodeChange(selectedCode: string, contactForm: FormGroup): void {
    const selectedCountry = this.supplierPhoneCode.find(
      (country) => country.landNumberCode === selectedCode
    );
    if (selectedCountry) {
      contactForm.get('phoneCodeCountryId')?.setValue(selectedCountry.countryId);
    }
  }
  onCountryMobilePhoneChange(selectedCode: string, contactForm: FormGroup) {
    const selectedCountry = this.supplierPhoneCode.find(
      (country) => country.mobileCode === selectedCode
    );
    if (selectedCountry) {
      contactForm.get('mobileCodeCountryId')?.setValue(selectedCountry.countryId);
    }
  }
  GetContactDetails() {
    this.loginservice.GetSupplierContact(this.supplierId).subscribe(response => {
      if (response.length !== 0) {
        //this.primarycontactDetails = [response[0]];
        //this.SecondarycontactDetails = response.slice(1);
        this.SecondarycontactDetails = response;
        if (this.SecondarycontactDetails.length === 1 && this.SecondarycontactDetails[0].firstContactFlag === true) {
          this.readonlyMode = true;
          this.InitForms(this.SecondarycontactDetails[0])
          this.saveUpdateContact();
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
    if(this.SecondarycontactDetails?.length !== 0){
      this.NextFlag.emit(true);
    }else{
      this.NextFlag.emit(false);
    }
  }

  saveUpdateContact(isNextClick: boolean = false) {
    this.isSubmitted = true;
    if (this.SecondarycontactDetails.length > 0) {
      this.primaryContact = this.SecondarycontactDetails.some((item: any) => item.isPrimaryContact === true);
    }
    if (isNextClick && this.SecondarycontactDetails?.length !== 0 && this.editFlag && this.contactForm.dirty && this.contactForm.valid) {
      this.confirmatioPopUp(isNextClick);
      return;
    } else if (this.contactForm.valid && !isNextClick) {
      this.contactForm.markAllAsTouched();

      const combinedData = {
        ...this.contactForm.value
      }
      if (this.SecondarycontactDetails[0].contactId === this.contactForm.value.contactId || this.SecondarycontactDetails[0].firstContactFlag === true) {
        this.SecondarycontactDetails[0].salutationId = this.contactForm.value.salutationId;
        this.SecondarycontactDetails[0].firstName = this.contactForm.value.firstName;
        this.SecondarycontactDetails[0].middleName = this.contactForm.value.middleName;
        this.SecondarycontactDetails[0].lastName = this.contactForm.value.lastName;
        this.SecondarycontactDetails[0].jobTitle = this.contactForm.value.jobTitle;
        this.SecondarycontactDetails[0].roleId = this.contactForm.value.roleId;
        this.SecondarycontactDetails[0].email = this.contactForm.value.email;
        this.SecondarycontactDetails[0].phoneCodeCountryId = this.contactForm.value.phoneCodeCountryId;
        this.SecondarycontactDetails[0].phoneNumber = this.contactForm.value.phoneNumber;
        this.SecondarycontactDetails[0].mobileCode = this.contactForm.value.mobileCode;
        this.SecondarycontactDetails[0].mobileNumber = this.contactForm.value.mobileNumber;
        this.SecondarycontactDetails[0].isPrimaryContact = this.contactForm.value.isPrimaryContact;
        this.SecondarycontactDetails[0].supplierId = this.userData.supplierId;
        this.SecondarycontactDetails[0].loggedIn = this.userData.userId;
        this.finalSavedata = [this.SecondarycontactDetails[0]];
      }
      else {
        this.finalSavedata = [combinedData];
      }
      if (this.editFlag) {
        const index = this.SecondarycontactDetails.findIndex(b => b.contactId === this.contactForm.value.contactId);
        if (index !== -1) {
          if (this.SecondarycontactDetails[0].contactId !== this.contactForm.value.contactId) {
            this.SecondarycontactDetails[index] = { ...this.contactForm.value };
          }
          this.supplierRole.forEach(ele => {
            if (this.SecondarycontactDetails[index].roleId == ele.roleId) {
              this.SecondarycontactDetails[index].roleName = ele.roleName;
            }
          });
          this.suppliersalutation.forEach(ele => {
            if (this.SecondarycontactDetails[index].salutationId == ele.salutationId) {
              this.SecondarycontactDetails[index].salutationName = ele.salutationName;
            }
          });

          if (this.finalSavedata.length > 0) {
            this.saveContactDetails(this.finalSavedata, isNextClick);
          }
        }

      } else {
        this.supplierRole.forEach(ele => {
          if (combinedData.roleId == ele.roleId) {
            combinedData.roleName = ele.roleName;
          }
        })
        this.suppliersalutation.forEach(ele => {
          if (combinedData.salutationId == ele.salutationId) {
            combinedData.salutationName = ele.salutationName;
          }
        });
        if (this.SecondarycontactDetails[0].contactId !== this.contactForm.value.contactId && this.SecondarycontactDetails[0].firstContactFlag !== true) {
          this.SecondarycontactDetails.push(combinedData);
        }

        if (this.finalSavedata.length > 0) {
          this.saveContactDetails(this.finalSavedata, isNextClick);
        }
      }
    } else if (isNextClick && !this.contactForm.valid) {
      
      if (this.SecondarycontactDetails?.length !== 0) {
        this.nextTabEmit.emit();
      } else {
        this.contactForm.markAllAsTouched();
        this.isSubmitted = true;
        return;
      }
    } else {
      if (this.contactForm.valid) {
        if (isNextClick) {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        } else {
          this.adminService.showMessage('Please fill in all mandatory fields before save');
        }
      }
    }
  }

  // checkInvalidFields() {
  //   const controls = this.contactForm.controls;

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

  resetForm(): void {
    this.editFlag = false;
    this.readonlyMode = false;
    this.InitForms();
    this.contactForm.reset();
    this.contactForm.clearValidators()
  }
  EditContact(el: HTMLElement, data?: any, index?: number) {
    el.scrollIntoView();
    this.editFlag = true;
    this.readonlyMode = index === 0;
    this.InitForms(data)
    this.activateRouter?.params?.subscribe((response) => {

      if (response.status === 'In-Progress') {
        this.contactForm.disable();
        this.disableStatusBased = false;
      }

    });
  }
  removeContact(index: number) {

    const contact = this.SecondarycontactDetails[index]
    const contactId = contact.contactId;
    if (contactId !== 0 && contactId !== null && contactId !== undefined) {
      this.supplierUserFormService.deleteContactDetails(contactId, this.userData.supplierId, this.userData.userId).subscribe((res: any) => {
        if (res.success) {
          this.SecondarycontactDetails.splice(index, 1);
          this.adminService.showMessage(res.message);
          this.GetContactDetails();
        } else {
          this.adminService.showMessage(res.message);
        }
      })
    }
    else {
      this.SecondarycontactDetails.splice(index, 1);
    }

  }

  saveContactDetails(contactDetails: any, isNextClick: boolean = false) {
    if (this.SecondarycontactDetails.length > 0) {
      this.primaryContact = this.SecondarycontactDetails.some((item: any) => item.isPrimaryContact === true);
    }
    this.contactForm.markAllAsTouched();
    if (contactDetails.length > 0) {
      contactDetails[0].supplierId = this.userData.supplierId;
      contactDetails[0].loggedIn = this.userData.userId;
      this.loginservice.SaveContactDetails(contactDetails).subscribe(response => {
        if (response.success) {
          this.isSubmitted = false;
          this.contactForm.clearValidators();
          if (this.editFlag) {
            this.adminService.showMessage('Data on the form has been updated successfully');
          } else {
            this.adminService.showMessage('Data on the form has been saved successfully');
          }
          this.resetForm();
          //if(this.SecondarycontactDetails.length !== 1){
          this.GetContactDetails();
          if (isNextClick) {
            if (this.SecondarycontactDetails.length > 0 && this.primaryContact == false) {
              this.adminService.showMessage('Please select at least one contact as the primary contact to proceed');
              return;
            } else {
              setTimeout(() => {
                this.nextTabEmit.emit();
              }, 1000);
            }
          }
          if (this.previousTabClick) {
            if (this.SecondarycontactDetails.length > 0 && this.primaryContact == false) {
              this.adminService.showMessage('Please select at least one contact as the primary contact to proceed');
              return;
            } else {
              setTimeout(() => {
                this.dialogResult.emit(true);
              }, 1000);
            }
          }
          //}
          this.finalSavedata = [];
        }
        else {
          this.adminService.showMessage(response.message);
          this.finalSavedata = [];
        }

      })
    }
    else {
      this.adminService.showMessage('Please fill in all mandatory fields before save!.');
    }

  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numeric keys (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }


  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {
    if (this.SecondarycontactDetails.length > 0) {
      this.primaryContact = this.SecondarycontactDetails.some((item: any) => item.isPrimaryContact === true);
    }
    const contactFields = Object.values(this.contactForm.controls).some(control => control.dirty || control.value);
    if (contactFields) {
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
      // this.commonService.dataLostModalConfig);
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (isNextClick) {
            // this.contactForm.markAllAsTouched();
            // this.saveUpdateContact();
            this.nextTabEmit.emit();
            return;
          } else {
            this.previousTabClick = true;
            this.dialogResult.emit(true);
            // this.saveUpdateContact();
          }
        } else {
          //New condition for previous No Btn
          if (isPreviousClick) {
            return;
          }
          if (isNextClick) {
            return
            // if (this.SecondarycontactDetails.length > 0 && this.primaryContact == false) {
            //   this.adminService.showMessage('Please select at least one contact as the primary contact to proceed');
            //   return;
            // } else {
            //   this.nextTabEmit.emit();
            // }
          }
          else {
            // if (this.SecondarycontactDetails.length > 0 && this.primaryContact == false) {
            //   this.adminService.showMessage('Please select at least one contact as the primary contact to proceed');
            //   return;
            // } else {
            this.dialogResult.emit(true);
            // }
          }
        }
      });
    } else {
      if (isNextClick) {
        if (this.SecondarycontactDetails.length > 0 && this.primaryContact == false) {
          this.adminService.showMessage('Please select at least one contact as the primary contact to proceed');
          return;
        } else if (this.SecondarycontactDetails.length > 0 && this.SecondarycontactDetails.find(x => x.contactId > 0)) {
          this.nextTabEmit.emit();
        } else {
          this.adminService.showMessage('Enter all mandatory data.');
        }
      }
      else {
        // if (this.SecondarycontactDetails.length > 0 && this.primaryContact == false) {
        //   this.adminService.showMessage('Please select at least one contact as the primary contact to proceed');
        //   return;
        // } else if (this.SecondarycontactDetails.length == 0) {
        //   this.adminService.showMessage('Enter all mandatory data.');
        // } else {
        this.contactForm.reset();
        this.dialogResult.emit(true);
        // }
      }
    }
  }

  deletePopUp(ind: number) {
    const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, this.commonService.deletetModalConfig);
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeContact(ind);
      } else {
        this.dialog.closeAll();
      }
    });
  }

  ClearValues(): boolean {
    // this.SaveDraftFlag.emit(this.commonService.CommonClearValues(this.contactForm))
    if (this.contactForm.valid) {
      this.SaveDraftFlag.emit(true)
    } else {
      this.SaveDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.contactForm);
  }

  enablePrimaryContactButton() {
    if (this.editFlag == false) {
      const contactFields = Object.entries(this.contactForm.controls)
        .filter(([key]) => key !== 'isPrimaryContact')
        .some(([_, control]) => control.value);
      const defaultContactControl = this.contactForm.get('isPrimaryContact');

      if (contactFields) {
        if (this.SecondarycontactDetails.length === 0) {
          defaultContactControl?.setValue(true);
        }
      } else {
        if (this.SecondarycontactDetails.length === 0) {
          defaultContactControl?.setValue(false);
        }
      }
    }
  }
}

interface Salutation {
  salutationId: number;
  salutationName: string;
}

interface Role {
  roleId: number;
  roleName: string;
}
interface countryPhcode {
  countryId: number;
  countryName: string;
  landNumberCode: string;
  mobileCode: string;
  countryCode: string
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