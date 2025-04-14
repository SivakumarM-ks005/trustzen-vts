import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatFormField, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { CurrencyMaskDirective } from '../../core/directives/format-currency.directive';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatBadge } from '@angular/material/badge';
import { LoginService } from '../../core/services/login/login.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { AllowNumberOnlyDirective } from '../../core/directives/allowNumberOnly.directive';
interface FinancialCurrency {
  currencyId: number;
  currencyName: string;
  countryId: number;
}
interface BankCountrylist {
  countryId: number;
  countryName: string;

}

@Component({
  selector: 'app-financial-health-details',
  templateUrl: './financial-health-details.component.html',
  styleUrl: './financial-health-details.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, MatExpansionModule, MatFormField, MatLabel, MatSelect, MatTooltip, MatOption, MatError, NgFor, MatInput, CurrencyMaskDirective, MatIconButton, MatIcon, MatDatepickerInput, MatHint, MatDatepickerToggle,
    AllowNumberOnlyDirective, MatSuffix, MatDatepicker, MatCheckbox, MatBadge]
})

export class FinancialHealthDetailsComponent implements OnInit {
  @Input() supplierId: number;
  financialForm!: FormGroup;
  creditLimitError: any | null = null;
  exposureLimitError: any | null = null;
  userData: any | null;
  FinCurrencyList: FinancialCurrency[] = [];
  BankCountryList: BankCountrylist[] = [];
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  previousTabClick: boolean = false;
  maxDate = new Date();
  minDate = new Date();
  @Output() tabValidCheckEmit = new EventEmitter();
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  creditLimitFlag: boolean = false;
  exposureLimitFlag: boolean = false;
  attachToggle = false;
  disableStatusBased: boolean = true;
  Mandatefinancestatement: boolean = false;
  systemParameter: any;
  status: any;
  financialData: any;
  isSubmitted = false;
  @Output() NextFlag = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private loginservice: LoginService,
    private SupplierUserForm: SupplierUserFormService,
    public adminService: AdminService,
    public commonService: CommonService,
    private dialog: MatDialog,
    public activateRouter: ActivatedRoute
  ) {
    const storedData: any = localStorage.getItem('loginDetails');
    this.userData = JSON.parse(storedData);
    this.financialForm = this.fb.group({
      supplierId: [0],
      loggedId: [0],
      businessCreditInfos: this.fb.group({
        businessCapId: [null],
        experienceId: [null, [Validators.required, this.invalidValueValidator(0)]],
        currencyId: [null, [Validators.required, this.invalidValueValidator(0)]],
        aggregateValueProjects: [null],
        maxValueOfProjectUndertake: [null],
        creditLimit: [null],
        creditExposureLimit: [null],
        projectLimit: [null]
      })
      ,

      projectDetailsInfos: this.fb.array([]),
      assetLiabilitieInfos: this.fb.array([]),
      financialHealthInfo: this.fb.group({
        financialHealthId: [null],
        netProfitLast3Year: [false],
        financialHealthDocsInfo: this.fb.array([])
      })
    });

    // this.initForm();
  }
  ngOnInit() {
    this.getCurrency();
    this.getCountry();
    this.SupplierUserForm.GetSysParameterGeneral().subscribe(res => {
      if (res) {

        this.systemParameter = res;
      }
    })
    // this.getSyatemParameter();
    this.GetFinancialBusinessDetails();
    this.GetSupplierManagement();
    this.activateRouter?.params?.subscribe((response) => {
      if (response.status === 'In-Progress') {
        this.status = response.status;
        this.financialForm.disable();
        this.financialForm.get('projectDetailsInfos')?.disable();
        this.disableStatusBased = false;
      }
    });
  }

  click() {
    console.log(this.financialForm.get('assetLiabilitieInfos')?.value);

  }

  GetSupplierManagement() {
    this.SupplierUserForm.GetSupplierManagement().subscribe(res => {
      if (res) {
        this.Mandatefinancestatement = res.general.mandateFinancialStatementSubmission;
        if (this.Mandatefinancestatement) {
          this.financialForm.get('financialHealthInfo')?.get('financialHealthDocsInfo')?.setValidators(Validators.required);
          this.financialForm.get('financialHealthInfo')?.get('financialHealthDocsInfo')?.updateValueAndValidity();
        }
      }
    })
  }

  getSyatemParameter() {
    this.SupplierUserForm.GetSysParameterGeneral().subscribe(res => {
      if (res) {
        this.systemParameter = res;
      }
    })
  }

  GetFinancialBusinessDetails() {
    this.SupplierUserForm.GetFinancialBusinessDetails(this.supplierId).subscribe(data => {
      if (data) {
        this.financialData = data;
        // Patch non-array fields
        this.financialForm.patchValue({
          // supplierId: this.userData.supplierId,
          // loggedId: this.userData.userId,
          businessCreditInfos: data.businessCreditInfos,
          assetLiabilitieInfos: data?.assetLiabilitieInfos,
          financialHealthInfo: {
            ...data.financialHealthInfo,
            financialHealthDocsInfo: []
          }
        });

        // Handle projectDetailsInfos as FormArray
        const projectDetailsArray = this.financialForm.get('projectDetailsInfos') as FormArray;
        projectDetailsArray.clear(); // Clear any existing controls

        // Populate data if available, otherwise add an empty form group
        if (data.projectDetailsInfos && data.projectDetailsInfos.length > 0) {
          data.projectDetailsInfos.forEach((projectDetail: any) => {
            projectDetailsArray.push(this.createProjectDetailFormGroup(projectDetail));
          });
        } else {
          projectDetailsArray.push(this.createProjectDetailFormGroup({})); // Add an empty group
        }
        this.activateRouter?.params?.subscribe((response) => {
          if (response.status === 'In-Progress') {
            this.financialForm.disable();
            this.financialForm.get('projectDetailsInfos')?.disable();
            this.disableStatusBased = false;
          }
        });

        const financialHealthDocsInfoArray = this.financialForm.get('financialHealthInfo.financialHealthDocsInfo') as FormArray;
        financialHealthDocsInfoArray.clear();
        if (data.financialHealthInfo?.financialHealthDocsInfo && data.financialHealthInfo.financialHealthDocsInfo.length > 0) {
          data.financialHealthInfo.financialHealthDocsInfo.forEach((doc: any) => {
          });
        }
        // else {
        //   financialHealthDocsInfoArray.push(this.createFinancialHealthDocFormGroup({}));
        // }
        this.tabValidCheckEmit.emit();
      } else {
        // If no data is returned, initialize with a single empty group        
        const projectDetailsArray = this.financialForm.get('projectDetailsInfos') as FormArray;
        projectDetailsArray.clear();
        projectDetailsArray.push(this.createProjectDetailFormGroup({}));

        const financialHealthDocsInfoArray = this.financialForm.get('financialHealthInfo.financialHealthDocsInfo') as FormArray;
        financialHealthDocsInfoArray.clear();
      }
    });
  }

  invalidValueValidator(invalidValue: any) {
    return (control: any): ValidationErrors | null => {
      return control.value === invalidValue ? { invalidValue: true } : null;
    };
  }

  // Helper method to create a FormGroup for project details
  createProjectDetailFormGroup(projectDetail: any): FormGroup {
    return this.fb.group({
      projectDetailsId: [projectDetail.projectDetailsId || null],
      projectStatusId: [projectDetail.projectStatusId || 0, [Validators.required, this.invalidValueValidator(0)]],
      customerName: [projectDetail.customerName || null, Validators.required],
      projectDescription: [projectDetail.projectDescription || null, Validators.required],
      startDate: [projectDetail.startDate || null, Validators.required],
      endDate: [projectDetail.endDate || null],
      countryId: [projectDetail.countryId || null, Validators.required],
      currencyId: [projectDetail.currencyId || null],
      value: [projectDetail.value || null]
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
        this.FinCurrencyList = data;
      }
    });
  }
  get projectDetailsInfos(): FormArray {
    return this.financialForm.get('projectDetailsInfos') as FormArray;
  }



  NextButtonValidation() {
    if (this.financialData?.businessCreditInfos?.experienceName) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false);
    }
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numeric keys (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

}



