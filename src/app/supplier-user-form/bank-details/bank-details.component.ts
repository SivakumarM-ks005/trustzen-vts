import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
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
  finalSaveBankData: any[] = [];
  editFlag: boolean = false;
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

  updateDefaultBankStatus() {
    const defaultBankControl = this.BankForm.get('defaultBank');

  }
  GetSupplierBank() {
    this.loginservice.GetSupplierBank(this.supplierId).subscribe(response => {
      if (response.length !== 0) {
      }
      this.tabValidCheckEmit.emit();
      // this.updateDefaultBankStatus();
    });
  }
  getCountry(): void {
    this.loginservice.getCountry().subscribe(data => {
      if (data) {
      }
    });
  }

  getCurrency(): void {
    this.loginservice.GetCurrencyDetails().subscribe(data => {
      if (data) {
      }
    });
  }
  getStates(countryId: number): void {
    this.loginservice.GetCountryBaseaState(countryId).subscribe((data) => {


    });
  }

  getCities(stateId: number): void {
    this.loginservice.GetStatebaseCity(stateId).subscribe((data) => {

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

      } else {

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
      }
    });
  }

  getCurrencyForCorrespondanceBank(): void {
    this.loginservice.GetCurrencyDetails().subscribe(data => {
      if (data) {
      }
    });
  }

  getStatesForCorrespondanceBank(countryId: number): void {
    this.loginservice.GetCountryBaseaState(countryId).subscribe((data) => {
    });
  }

  getCitiesForCorrespondanceBank(stateId: number): void {
    this.loginservice.GetStatebaseCity(stateId).subscribe((data) => {
    });
  }
}


