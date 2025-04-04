import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { LoginService } from '../../core/services/login/login.service';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { PreQualificationProcessComponent } from '@app/pre-qualification-process/pre-qualification-process.component';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrl: './bank-details.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, MatButton, MatTooltip, MatFormField, MatLabel, MatInput, MatError, MatSelect, MatOption, NgFor, MatCheckbox]
})
export class BankDetailsComponent implements OnInit {
  @Input() supplierId: number;
  BankForm: FormGroup;
  bankDetails: SupplierBank[] = [];
  finalSaveBankData: any[] = [];
  editFlag: boolean = false;
  BankCountryList: BankCountrylist[] = [];
  BankStateList: BankState[] = [];
  BankCityList: BankCity[] = [];
  BankCurrencyList: BankCurrency[] = [];
  isOtherCitySelected: boolean = false;
  userData: any | null;
  previousTabClick: boolean = false;
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  @Output() tabValidCheckEmit = new EventEmitter();
  defaultBank: boolean = false;
  disableStatusBased: boolean = true;
  AccNoMinchar: any;
  AccNomaxChar: any;
  IbanminChar: any;
  IbanmaxChar: any;
  SwiftminChar: any;
  SwiftmaxChar: any;
  BsbminChar: any;
  BsbmaxChar: any;
  RouteminChar: any;
  RoutemaxChar: any;
  AccManantory: any;
  IbanManantory: any;
  SwiftManantory: any;
  BsbManantory: any;
  RouteManantory: any;
  BankCityListForCorrespondanceBank: BankCity[] = [];
  BankStateListForCorrespondanceBank: BankState[] = [];
  BankCountryListForCorrespondanceBank: BankCountrylist[] = [];
  BankCurrencyListForCorrespondanceBank: BankCurrency[] = [];
  isSubmitted = false;
  @Output() NextFlag = new EventEmitter<boolean>();
  profileStatus: any;

  constructor(private fb: FormBuilder,
    private loginservice: LoginService,
    public supplierUserFormService: SupplierUserFormService,
    public adminService: AdminService,
    public commonService: CommonService,
    private dialog: MatDialog,
    public activateRouter: ActivatedRoute
  ) {

  }
  ngOnInit() {
    const storedData: any = localStorage.getItem('loginDetails');
    this.userData = JSON.parse(storedData);
    this.GetAdminSupplierBankDetails();
    this.GetSupplierBank();
    this.initForm();
    this.getCountry();
    this.getCurrency();
    this.activateRouter?.params?.subscribe((response) => {

      if (response.status === 'In-Progress') {
        this.BankForm.disable();
        this.disableStatusBased = false;
      } else if (response.profile === 'manageprofile') {
        this.profileStatus = response.profile;
      }

    });
  }
  GetAdminSupplierBankDetails(bank?: any) {
    this.supplierUserFormService.GetSupplierManagement().subscribe(res => {
      if (res) {
        console.log(res.complianceRenewalBank.accManantory);

        this.AccNoMinchar = res.complianceRenewalBank.accNominChar || 0;
        this.AccNomaxChar = res.complianceRenewalBank.accNomaxChar || 0;
        this.AccManantory = res.complianceRenewalBank.accManantory || false;
        this.IbanManantory = res.complianceRenewalBank.ibanManantory || false;
        this.IbanminChar = res.complianceRenewalBank.ibanminChar || 0;
        this.IbanmaxChar = res.complianceRenewalBank.ibanmaxChar || null;
        this.SwiftManantory = res.complianceRenewalBank.swiftManantory || false;
        this.SwiftminChar = res.complianceRenewalBank.swiftminChar || 0;
        this.SwiftmaxChar = res.complianceRenewalBank.swiftmaxChar || null;
        this.BsbManantory = res.complianceRenewalBank.bsbManantory || false;
        this.BsbminChar = res.complianceRenewalBank.bsbminChar || 0;
        this.BsbmaxChar = res.complianceRenewalBank.bsbmaxChar || null;
        this.RouteManantory = res.complianceRenewalBank.routeManantory || false;
        this.RouteminChar = res.complianceRenewalBank.routeminChar || 0;
        this.RoutemaxChar = res.complianceRenewalBank.routemaxChar || null;
        this.initForm(bank);
      }
    })
  }
  initForm(bank?: any) {
    this.BankForm = this.fb.group({
      bankId: [bank?.bankId || 0],
      supplierId: [bank?.supplierId || 0],
      loggedIn: [bank?.loggedIn || 0],
      bankName: [bank?.bankName || '', Validators.required],
      branch: [bank?.branch || '', Validators.required],
      currencyId: [bank?.currencyId || null, Validators.required],
      countryId: [bank?.countryId || null, Validators.required],
      stateId: [bank?.stateId || null, Validators.required],
      cityId: [bank?.cityId || null, Validators.required],
      currencyName: [bank?.currency || ''],
      cityName: [bank?.city || ''],
      stateName: [bank?.state || ''],
      countryName: [bank?.country || ''],

      accountNumber: [

        bank?.accountNumber || '',
        [
          ...(this.AccManantory ? [Validators.required] : []),
          ...(this.AccManantory ? [Validators.minLength(this.AccNoMinchar)] : []),
          ...(this.AccManantory ? [Validators.maxLength(this.AccNomaxChar)] : []),
        ],
      ],

      swiftCodeBIC: [
        bank?.swiftCodeBIC || '',
        [
          ...(this.SwiftManantory ? [Validators.required] : []),
          ...(this.SwiftManantory ? [Validators.minLength(this.SwiftminChar)] : []),
          ...(this.SwiftManantory ? [Validators.maxLength(this.SwiftmaxChar)] : []),
        ],
      ],
      iban: [
        bank?.iban || '',
        [
          ...(this.IbanManantory ? [Validators.required] : []),
          ...(this.IbanManantory ? [Validators.minLength(this.IbanminChar)] : []),
          ...(this.IbanManantory ? [Validators.maxLength(this.IbanmaxChar)] : []),
        ],
      ],

      bsb: [
        bank?.bsb || null,
        [
          ...(this.BsbManantory ? [Validators.required] : []),
          ...(this.BsbManantory ? [Validators.minLength(this.BsbminChar)] : []),
          ...(this.BsbManantory ? [Validators.maxLength(this.BsbmaxChar)] : []),
        ],
      ],
      routing: [
        bank?.routing || null,
        [
          ...(this.RouteManantory ? [Validators.required] : []),
          ...(this.RouteManantory ? [Validators.minLength(this.RouteminChar)] : []),
          ...(this.RouteManantory ? [Validators.maxLength(this.RoutemaxChar)] : []),
        ],
      ],
      ifscCode: [bank?.ifscCode || null],
      correspondentBank: [bank?.correspondentBank || false],
      defaultBank: [bank?.defaultBank || false],
    });

    this.checkCorresBank(bank?.correspondentBankObject);
  }

  // checkInvalidFields() {
  //   const controls = this.BankForm.controls;

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
  //     bankName: 'Bank Name',
  //     branch: 'Branch',
  //     currencyId: 'Currency',
  //     countryId: 'Country',
  //     stateId: 'State',
  //     cityId: 'City',
  //     accountNumber: 'Account Number',
  //     swiftCodeBIC: 'Swift Code / BIC',
  //     iban: 'IBAN',
  //     bsb : 'BSB',
  //     routing: 'Routing',

  //     // Add more field names as necessary
  //   };

  //   return controlLabels[controlName] || controlName; // Default to the control name if it's not found
  // }

  updateDefaultBankStatus() {
    const defaultBankControl = this.BankForm.get('defaultBank');
    if (this.bankDetails.length === 0) {
      defaultBankControl?.setValue(true);
    }
  }
  GetSupplierBank() {
    this.loginservice.GetSupplierBank(this.supplierId).subscribe(response => {
      if (response.length !== 0) {
        this.bankDetails = response;
      }
      this.tabValidCheckEmit.emit();
      // this.updateDefaultBankStatus();
    });
  }
  getCountry(): void {
    this.loginservice.getCountry().subscribe(data => {
      if (data) {
        this.BankCountryList = data;
      }
    });
  }

  getCurrency(): void {
    this.loginservice.GetCurrencyDetails().subscribe(data => {
      if (data) {
        this.BankCurrencyList = data;
      }
    });
  }
  getStates(countryId: number): void {
    this.BankStateList = [];
    this.loginservice.GetCountryBaseaState(countryId).subscribe((data) => {
      this.BankStateList = data;


    });
  }

  getCities(stateId: number): void {
    this.BankCityList = [];
    this.loginservice.GetStatebaseCity(stateId).subscribe((data) => {
      this.BankCityList = data;

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
        moduleName: 'Supplier Bank'
      },
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        const combinedData = {
          ...this.BankForm.value
        };
        this.finalSaveBankData = [combinedData];
        if (this.editFlag) {
          const index = this.bankDetails.findIndex(b => b.bankId === this.BankForm.value.bankId);
          if (index !== -1) {
            this.bankDetails[index] = { ...this.BankForm.value };
            // debugger
            this.BankCountryList.forEach(ele => {
              if (this.bankDetails[index].countryId == ele.countryId) {
                this.bankDetails[index].country = ele.countryName;
              }
            });
            this.BankCityList.forEach(ele => {
              if (this.bankDetails[index].cityId == ele.cityId) {
                this.bankDetails[index].city = ele.cityName;
              }
            });
            this.BankStateList.forEach(ele => {
              if (this.bankDetails[index].stateId == ele.stateId) {
                this.bankDetails[index].state = ele.stateName;
              }
            });
            this.BankCurrencyList.forEach(ele => {
              if (this.bankDetails[index].currencyId == ele.currencyId) {
                this.bankDetails[index].currency = ele.currencyName;
              }
            });

            //Correspondance details functionality
            if (this.bankDetails[index]?.correspondentBank) {
              //get state details
              this.BankStateListForCorrespondanceBank.forEach(ele => {
                if (this.bankDetails[index]?.correspondentBankObject?.stateId == ele.stateId) {
                  this.bankDetails[index].correspondentBankObject.state = ele.stateName;
                }
              })

              //get city details 
              this.BankCityListForCorrespondanceBank.forEach(ele => {
                if (this.bankDetails[index]?.correspondentBankObject?.cityId == ele.cityId) {
                  this.bankDetails[index].correspondentBankObject.city = ele.cityName;
                }
              });

              this.BankCountryListForCorrespondanceBank.forEach(ele => {
                if (this.bankDetails[index]?.correspondentBankObject?.countryId == ele.countryId) {
                  this.bankDetails[index].correspondentBankObject.country = ele.countryName;
                }
              });
              this.BankCurrencyListForCorrespondanceBank.forEach(ele => {
                if (this.bankDetails[index]?.correspondentBankObject?.currencyId == ele.currencyId) {
                  this.bankDetails[index].correspondentBankObject.currency = ele.currencyName;
                }
              });
            }

            if (this.finalSaveBankData.length > 0) {
              this.saveBankDetails(this.finalSaveBankData, false);
            }
          }
        } else {
          this.BankStateList.forEach(ele => {
            if (combinedData.stateId == ele.stateId) {
              combinedData.state = ele.stateName;
            }
          })
          this.BankCityList.forEach(ele => {
            if (combinedData.cityId == ele.cityId) {
              combinedData.city = ele.cityName;
            }
          });
          this.BankCountryList.forEach(ele => {
            if (combinedData.countryId == ele.countryId) {
              combinedData.country = ele.countryName;
            }
          });
          this.BankCurrencyList.forEach(ele => {
            if (combinedData.currencyId == ele.currencyId) {
              combinedData.currency = ele.currencyName;
            }
          });

          //Correspondance details functionality
          if (combinedData?.correspondentBank) {
            //get state details
            this.BankStateListForCorrespondanceBank.forEach(ele => {
              if (combinedData?.correspondentBankObject?.stateId == ele.stateId) {
                combinedData.correspondentBankObject.state = ele.stateName;
              }
            })

            //get city details 
            this.BankCityListForCorrespondanceBank.forEach(ele => {
              if (combinedData?.correspondentBankObject?.cityId == ele.cityId) {
                combinedData.correspondentBankObject.city = ele.cityName;
              }
            });

            this.BankCountryListForCorrespondanceBank.forEach(ele => {
              if (combinedData?.correspondentBankObject?.countryId == ele.countryId) {
                combinedData.correspondentBankObject.country = ele.countryName;
              }
            });
            this.BankCurrencyListForCorrespondanceBank.forEach(ele => {
              if (combinedData?.correspondentBankObject?.currencyId == ele.currencyId) {
                combinedData.correspondentBankObject.currency = ele.currencyName;
              }
            });
          }

          this.bankDetails.push(combinedData);
          if (this.finalSaveBankData.length > 0) {
            this.saveBankDetails(this.finalSaveBankData, false);
          }
        }
        this.nextTabEmit.emit(6);
      } else {
        const combinedData = {
          ...this.BankForm.value
        };
        this.finalSaveBankData = [combinedData];
        if (this.editFlag) {
          const index = this.bankDetails.findIndex(b => b.bankId === this.BankForm.value.bankId);
          if (index !== -1) {
            this.bankDetails[index] = { ...this.BankForm.value };
            // debugger
            this.BankCountryList.forEach(ele => {
              if (this.bankDetails[index].countryId == ele.countryId) {
                this.bankDetails[index].country = ele.countryName;
              }
            });
            this.BankCityList.forEach(ele => {
              if (this.bankDetails[index].cityId == ele.cityId) {
                this.bankDetails[index].city = ele.cityName;
              }
            });
            this.BankStateList.forEach(ele => {
              if (this.bankDetails[index].stateId == ele.stateId) {
                this.bankDetails[index].state = ele.stateName;
              }
            });
            this.BankCurrencyList.forEach(ele => {
              if (this.bankDetails[index].currencyId == ele.currencyId) {
                this.bankDetails[index].currency = ele.currencyName;
              }
            });

            //Correspondance details functionality
            if (this.bankDetails[index]?.correspondentBank) {
              //get state details
              this.BankStateListForCorrespondanceBank.forEach(ele => {
                if (this.bankDetails[index]?.correspondentBankObject?.stateId == ele.stateId) {
                  this.bankDetails[index].correspondentBankObject.state = ele.stateName;
                }
              })

              //get city details 
              this.BankCityListForCorrespondanceBank.forEach(ele => {
                if (this.bankDetails[index]?.correspondentBankObject?.cityId == ele.cityId) {
                  this.bankDetails[index].correspondentBankObject.city = ele.cityName;
                }
              });

              this.BankCountryListForCorrespondanceBank.forEach(ele => {
                if (this.bankDetails[index]?.correspondentBankObject?.countryId == ele.countryId) {
                  this.bankDetails[index].correspondentBankObject.country = ele.countryName;
                }
              });
              this.BankCurrencyListForCorrespondanceBank.forEach(ele => {
                if (this.bankDetails[index]?.correspondentBankObject?.currencyId == ele.currencyId) {
                  this.bankDetails[index].correspondentBankObject.currency = ele.currencyName;
                }
              });
            }

            if (this.finalSaveBankData.length > 0) {
              this.saveBankDetails(this.finalSaveBankData, false);
            }
          }
        } else {
          this.BankStateList.forEach(ele => {
            if (combinedData.stateId == ele.stateId) {
              combinedData.state = ele.stateName;
            }
          })
          this.BankCityList.forEach(ele => {
            if (combinedData.cityId == ele.cityId) {
              combinedData.city = ele.cityName;
            }
          });
          this.BankCountryList.forEach(ele => {
            if (combinedData.countryId == ele.countryId) {
              combinedData.country = ele.countryName;
            }
          });
          this.BankCurrencyList.forEach(ele => {
            if (combinedData.currencyId == ele.currencyId) {
              combinedData.currency = ele.currencyName;
            }
          });

          //Correspondance details functionality
          if (combinedData?.correspondentBank) {
            //get state details
            this.BankStateListForCorrespondanceBank.forEach(ele => {
              if (combinedData?.correspondentBankObject?.stateId == ele.stateId) {
                combinedData.correspondentBankObject.state = ele.stateName;
              }
            })

            //get city details 
            this.BankCityListForCorrespondanceBank.forEach(ele => {
              if (combinedData?.correspondentBankObject?.cityId == ele.cityId) {
                combinedData.correspondentBankObject.city = ele.cityName;
              }
            });

            this.BankCountryListForCorrespondanceBank.forEach(ele => {
              if (combinedData?.correspondentBankObject?.countryId == ele.countryId) {
                combinedData.correspondentBankObject.country = ele.countryName;
              }
            });
            this.BankCurrencyListForCorrespondanceBank.forEach(ele => {
              if (combinedData?.correspondentBankObject?.currencyId == ele.currencyId) {
                combinedData.correspondentBankObject.currency = ele.currencyName;
              }
            });
          }

          this.bankDetails.push(combinedData);
          if (this.finalSaveBankData.length > 0) {
            this.saveBankDetails(this.finalSaveBankData, false);
          }
        }
      }
    });

  }

  AddUpdateBank(isNextClick: boolean = false) {
    this.isSubmitted = true;
    if (this.bankDetails.length > 0) {
      this.defaultBank = this.bankDetails.some((item: any) => item.defaultBank === true);
    }

    if (!isNextClick && this.profileStatus === 'manageprofile') {
      this.preQualification();
    }else{

    if (isNextClick && this.bankDetails?.length !== 0 && this.editFlag && this.BankForm.dirty && this.BankForm.valid) {
      this.confirmatioPopUp(isNextClick);
    } else if (!isNextClick && this.BankForm.valid) {
      const combinedData = {
        ...this.BankForm.value
      };
      this.finalSaveBankData = [combinedData];
      if (this.editFlag) {
        const index = this.bankDetails.findIndex(b => b.bankId === this.BankForm.value.bankId);
        if (index !== -1) {
          this.bankDetails[index] = { ...this.BankForm.value };
          // debugger
          this.BankCountryList.forEach(ele => {
            if (this.bankDetails[index].countryId == ele.countryId) {
              this.bankDetails[index].country = ele.countryName;
            }
          });
          this.BankCityList.forEach(ele => {
            if (this.bankDetails[index].cityId == ele.cityId) {
              this.bankDetails[index].city = ele.cityName;
            }
          });
          this.BankStateList.forEach(ele => {
            if (this.bankDetails[index].stateId == ele.stateId) {
              this.bankDetails[index].state = ele.stateName;
            }
          });
          this.BankCurrencyList.forEach(ele => {
            if (this.bankDetails[index].currencyId == ele.currencyId) {
              this.bankDetails[index].currency = ele.currencyName;
            }
          });

          //Correspondance details functionality
          if (this.bankDetails[index]?.correspondentBank) {
            //get state details
            this.BankStateListForCorrespondanceBank.forEach(ele => {
              if (this.bankDetails[index]?.correspondentBankObject?.stateId == ele.stateId) {
                this.bankDetails[index].correspondentBankObject.state = ele.stateName;
              }
            })

            //get city details 
            this.BankCityListForCorrespondanceBank.forEach(ele => {
              if (this.bankDetails[index]?.correspondentBankObject?.cityId == ele.cityId) {
                this.bankDetails[index].correspondentBankObject.city = ele.cityName;
              }
            });

            this.BankCountryListForCorrespondanceBank.forEach(ele => {
              if (this.bankDetails[index]?.correspondentBankObject?.countryId == ele.countryId) {
                this.bankDetails[index].correspondentBankObject.country = ele.countryName;
              }
            });
            this.BankCurrencyListForCorrespondanceBank.forEach(ele => {
              if (this.bankDetails[index]?.correspondentBankObject?.currencyId == ele.currencyId) {
                this.bankDetails[index].correspondentBankObject.currency = ele.currencyName;
              }
            });
          }

          if (this.finalSaveBankData.length > 0) {
            this.saveBankDetails(this.finalSaveBankData, isNextClick);
          }
        }
      } else {
        this.BankStateList.forEach(ele => {
          if (combinedData.stateId == ele.stateId) {
            combinedData.state = ele.stateName;
          }
        })
        this.BankCityList.forEach(ele => {
          if (combinedData.cityId == ele.cityId) {
            combinedData.city = ele.cityName;
          }
        });
        this.BankCountryList.forEach(ele => {
          if (combinedData.countryId == ele.countryId) {
            combinedData.country = ele.countryName;
          }
        });
        this.BankCurrencyList.forEach(ele => {
          if (combinedData.currencyId == ele.currencyId) {
            combinedData.currency = ele.currencyName;
          }
        });

        //Correspondance details functionality
        if (combinedData?.correspondentBank) {
          //get state details
          this.BankStateListForCorrespondanceBank.forEach(ele => {
            if (combinedData?.correspondentBankObject?.stateId == ele.stateId) {
              combinedData.correspondentBankObject.state = ele.stateName;
            }
          })

          //get city details 
          this.BankCityListForCorrespondanceBank.forEach(ele => {
            if (combinedData?.correspondentBankObject?.cityId == ele.cityId) {
              combinedData.correspondentBankObject.city = ele.cityName;
            }
          });

          this.BankCountryListForCorrespondanceBank.forEach(ele => {
            if (combinedData?.correspondentBankObject?.countryId == ele.countryId) {
              combinedData.correspondentBankObject.country = ele.countryName;
            }
          });
          this.BankCurrencyListForCorrespondanceBank.forEach(ele => {
            if (combinedData?.correspondentBankObject?.currencyId == ele.currencyId) {
              combinedData.correspondentBankObject.currency = ele.currencyName;
            }
          });
        }

        this.bankDetails.push(combinedData);
        if (this.finalSaveBankData.length > 0) {
          this.saveBankDetails(this.finalSaveBankData, isNextClick);
        }
      }
    } else if (isNextClick && !this.BankForm.valid) {
      if (this.bankDetails?.length !== 0) {
        this.nextTabEmit.emit();
      } else {
        this.isSubmitted = true;
        this.BankForm.markAllAsTouched();
      }
      return;
    } else {
      if (this.BankForm.valid) {
        if (isNextClick) {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        } else {
          this.adminService.showMessage('Please fill in all mandatory fields before save');
        }
      }
    }
  }
  }

  ClearValues(): boolean {
    // this.SaveDraftFlag.emit(this.commonService.CommonClearValues(this.BankForm));
    if (this.BankForm.valid) {
      this.SaveDraftFlag.emit(true)
    } else {
      this.SaveDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.BankForm);
  }


  removeBank(i: number) {
    const bank = this.bankDetails[i]
    const bankId = bank.bankId;
    if (bankId !== 0 && bankId !== null && bankId !== undefined) {
      this.supplierUserFormService.deleteBankDetails(bankId, this.userData.supplierId, this.userData.userId).subscribe((res: any) => {
        if (res.success) {
          this.bankDetails.splice(i, 1);
          this.adminService.showMessage(res.message);
          this.GetSupplierBank();
        } else {
          this.adminService.showMessage(res.message);
        }
      })
    }
    else {
      this.bankDetails.splice(i, 1);
    }

  }

  NextButtonValidation() {
    if (this.bankDetails?.length !== 0) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false);
    }
  }

  EditBank(data: any, i: number, el: HTMLElement) {
    el.scrollIntoView();
    this.editFlag = true;
    this.getStates(data.countryId);
    this.getCities(data.stateId);
    this.initForm(data)
    this.activateRouter?.params?.subscribe((response) => {

      if (response.status === 'In-Progress') {
        this.BankForm.disable();
        this.disableStatusBased = false;
      }

    });
  }
  saveBankDetails(bankDetails: any, isNextClick: boolean = false) {
    if (this.bankDetails.length > 0) {
      this.defaultBank = this.bankDetails.some((item: any) => item.defaultBank === true);
    }
    this.BankForm.markAllAsTouched();
    if (bankDetails.length > 0) {
      bankDetails[0].supplierId = this.supplierId;
      if (bankDetails[0]?.correspondentBank) {
        bankDetails[0].correspondentBankObject.supplierId = this.supplierId;
      }
      bankDetails[0].loggedIn = this.userData.userId;
      this.loginservice.SaveBankDetails(bankDetails).subscribe((response) => {
        if (response.success) {
          this.BankForm.clearValidators();
          if (this.editFlag) {
            this.adminService.showMessage('Data on the form has been updated successfully');
          } else {
            this.adminService.showMessage('Data on the form has been saved successfully');
          }
          this.BankForm.reset();
          this.editFlag = false;
          this.GetSupplierBank();
          if (isNextClick) {
            if (this.bankDetails.length > 0 && this.defaultBank == false) {
              this.adminService.showMessage('Please select at least one bank as the default bank to proceed.');
              return;
            } else {
              setTimeout(() => {
                this.nextTabEmit.emit();
              }, 1000);
            }
          }
          if (this.previousTabClick) {
            if (this.bankDetails.length > 0 && this.defaultBank == false) {
              this.adminService.showMessage('Please select at least one bank as the default bank to proceed.');
              return;
            } else {
              setTimeout(() => {
                this.dialogResult.emit(true);
              }, 1000);
            }
          }
          this.finalSaveBankData = [];
        }
        else {
          this.adminService.showMessage(response.message);
        }
      });
    } else {
      this.adminService.showMessage('Please fill in all mandatory fields before save!.');
    }
  }

  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {
    if (this.bankDetails.length > 0) {
      this.defaultBank = this.bankDetails.some((item: any) => item.defaultBank === true);
    }
    const financialFields = Object.values(this.BankForm.controls).some(control => control.dirty || control.value);
    if (financialFields) {
      const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent,
        {
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
            // this.BankForm.markAllAsTouched();
            // this.AddUpdateBank();
            this.nextTabEmit.emit();
            return;
          } else {
            this.previousTabClick = true;
            this.dialogResult.emit(true);
            // this.AddUpdateBank();
          }
        } else {
          //New condition for previous No Btn
          if (isPreviousClick) {
            return;
          }
          if (isNextClick) {
            return;
            // if (this.bankDetails.length > 0 && this.defaultBank == false) {
            //   this.adminService.showMessage('Please select at least one bank as the default bank to proceed.');
            //   return;
            // } else {
            //   this.nextTabEmit.emit();
            // }
          }
          else {
            // if (this.bankDetails.length > 0 && this.defaultBank == false) {
            //   this.adminService.showMessage('Please select at least one bank as the default bank to proceed.');
            //   return;
            // } else {
            this.dialogResult.emit(true);
            // }
          }
        }
      });
    } else {
      if (isNextClick) {
        if (this.bankDetails.length > 0 && this.defaultBank == false) {
          this.adminService.showMessage('Please select at least one bank as the default bank to proceed.');
          return;
        } else if (this.bankDetails.length > 0) {
          this.nextTabEmit.emit();
        } else {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        }
      }
      else {
        // if (this.bankDetails.length > 0 && this.defaultBank == false) {
        //   this.adminService.showMessage('Please select at least one bank as the default bank to proceed.');
        //   return;
        // } else if (this.bankDetails.length == 0) {
        //   this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        // } else {
        this.BankForm.reset();
        this.dialogResult.emit(true);
        // }
      }
    }
  }

  checkbank() {
    this.bankDetails?.forEach(data => {
      if (this.editFlag && !this.BankForm.get('defaultBank')?.value && data?.defaultBank && this.BankForm.get('accountNumber')?.value === data?.accountNumber) {
        this.adminService.showMessage('Please select at least one address as Default Bank to proceed.');
      }
    })
  }

  resetForm() {
    this.BankForm.removeControl('correspondentBankObject');
    this.BankForm.reset();
    this.editFlag = false;
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numeric keys (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  deletePopUp(ind: number) {
    const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, this.commonService.deletetModalConfig);
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeBank(ind);
      } else {
        this.dialog.closeAll();
      }
    });
  }

  enableBankButton() {
    if (this.editFlag == false) {
      const bankFields = Object.entries(this.BankForm.controls)
        .filter(([key]) => key !== 'defaultBank')
        .some(([_, control]) => control.value);
      const defaultBankControl = this.BankForm.get('defaultBank');

      if (bankFields) {
        if (this.bankDetails.length === 0) {
          defaultBankControl?.setValue(true);
        }
      } else {
        if (this.bankDetails.length === 0) {
          defaultBankControl?.setValue(false);
        }
      }
    }
  }

  checkCorBan(event: MatCheckboxChange): void {
    if (event?.checked) this.checkCorresBank(); else this.BankForm.removeControl('correspondentBankObject');
  }

  checkCorresBank(bank?: any) {
    if (this.BankForm.controls['correspondentBank'].value) {
      this.getCountryForCorrespondanceBank();
      this.getCurrencyForCorrespondanceBank();
      this.BankForm.addControl('correspondentBankObject', this.fb.group({
        bankId: [bank?.bankId || 0],
        supplierId: [bank?.supplierId || 0],
        loggedIn: [bank?.loggedIn || 0],
        bankName: [bank?.bankName || '', Validators.required],
        branch: [bank?.branch || '', Validators.required],
        currencyId: [bank?.currencyId || null, Validators.required],
        countryId: [bank?.countryId || null, Validators.required],
        stateId: [bank?.stateId || null, Validators.required],
        cityId: [bank?.cityId || null, Validators.required],
        currencyName: [bank?.currency || ''],
        cityName: [bank?.city || ''],
        stateName: [bank?.state || ''],
        countryName: [bank?.country || ''],

        accountNumber: [
          bank?.accountNumber || '',
          [
            ...(this.AccManantory ? [Validators.minLength(this.AccNoMinchar)] : []),
            ...(this.AccManantory ? [Validators.maxLength(this.AccNomaxChar)] : []),
            ...(this.AccManantory ? [Validators.required] : []),
          ],
        ],

        swiftCodeBIC: [
          bank?.swiftCodeBIC || '',
          [
            ...(this.SwiftManantory ? [Validators.required] : []),
            ...(this.SwiftminChar ? [Validators.minLength(this.SwiftminChar)] : []),
            ...(this.SwiftmaxChar ? [Validators.maxLength(this.SwiftmaxChar)] : []),
          ],
        ],
        iban: [
          bank?.iban || '',
          [
            ...(this.IbanManantory ? [Validators.required] : []),
            ...(this.IbanminChar ? [Validators.minLength(this.IbanminChar)] : []),
            ...(this.IbanmaxChar ? [Validators.maxLength(this.IbanmaxChar)] : []),
          ],
        ],

        bsb: [
          bank?.bsb || null,
          [
            ...(this.BsbManantory ? [Validators.required] : []),
            ...(this.BsbminChar ? [Validators.minLength(this.BsbminChar)] : []),
            ...(this.BsbmaxChar ? [Validators.maxLength(this.BsbmaxChar)] : []),
          ],
        ],
        routing: [
          bank?.routing || null,
          [
            ...(this.RouteManantory ? [Validators.required] : []),
            ...(this.RouteminChar ? [Validators.minLength(this.RouteminChar)] : []),
            ...(this.RoutemaxChar ? [Validators.maxLength(this.RoutemaxChar)] : []),
          ],
        ],
        ifscCode: [bank?.ifscCode || null],
      }))
    } else {
      this.BankForm.removeControl('correspondentBankObject');
    }
  }

  getCountryForCorrespondanceBank(): void {
    this.loginservice.getCountry().subscribe(data => {
      if (data) {
        this.BankCountryListForCorrespondanceBank = data;
      }
    });
  }

  getCurrencyForCorrespondanceBank(): void {
    this.loginservice.GetCurrencyDetails().subscribe(data => {
      if (data) {
        this.BankCurrencyListForCorrespondanceBank = data;
      }
    });
  }

  getStatesForCorrespondanceBank(countryId: number): void {
    this.BankStateListForCorrespondanceBank = [];
    this.loginservice.GetCountryBaseaState(countryId).subscribe((data) => {
      this.BankStateListForCorrespondanceBank = data;
    });
  }

  getCitiesForCorrespondanceBank(stateId: number): void {
    this.BankCityListForCorrespondanceBank = [];
    this.loginservice.GetStatebaseCity(stateId).subscribe((data) => {
      this.BankCityListForCorrespondanceBank = data;
    });
  }
}

interface BankCountry {
  countryId: number;
  countryName: string;

}
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

interface BankCurrency {
  currencyId: number;
  currencyName: string;
  countryId: number;
}
export class SupplierBank {
  bankId: number = 0;
  supplierId: number = 0;
  loggedIn: number = 0;
  bankName: string = '';
  branch: string = '';
  currencyId: number = 0;
  currency: string = '';
  countryId: number = 0;
  country: string = '';
  stateId: number = 0;
  state: string = '';
  cityId: number = 0;
  city: string = '';
  accountNumber: string = '';
  swiftCodeBIC: string = '';
  iban: string = '';
  bsb: string = '';
  routing: string = '';
  ifscCode: string = '';
  correspondentBank: boolean = false;
  defaultBank: boolean = false;
  correspondentBankObject = {
    bankId: 0,
    supplierId: 0,
    loggedIn: 0,
    bankName: '',
    branch: '',
    currencyId: 0,
    currency: '',
    countryId: 0,
    country: '',
    stateId: 0,
    state: '',
    cityId: 0,
    city: '',
    accountNumber: '',
    swiftCodeBIC: '',
    iban: '',
    bsb: '',
    routing: '',
    ifscCode: '',
  }
}