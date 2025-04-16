import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { LoginService } from '../../core/services/login/login.service';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';

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
      } else if (response.profile === 'manageprofile') {
        this.profileStatus = response.profile;
      }

    });
  }
  GetAdminSupplierBankDetails(bank?: any) {
    this.supplierUserFormService.GetSupplierManagement().subscribe(res => {
      if (res) {
        console.log(res.complianceRenewalBank.accManantory);

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
        ],
      ],

      swiftCodeBIC: [
        bank?.swiftCodeBIC || '',
        [
        ],
      ],
      iban: [
        bank?.iban || '',
        [

        ],
      ],

      bsb: [
        bank?.bsb || null,
        [
        ],
      ],
      routing: [
        bank?.routing || null,
        [
        ],
      ],
      ifscCode: [bank?.ifscCode || null],
      correspondentBank: [bank?.correspondentBank || false],
      defaultBank: [bank?.defaultBank || false],
    });

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

}


