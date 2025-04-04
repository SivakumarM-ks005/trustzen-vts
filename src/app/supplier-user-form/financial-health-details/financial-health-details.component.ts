import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import moment from 'moment';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ActivatedRoute } from '@angular/router';
import { MatFormField, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { CurrencyMaskDirective } from '../../core/directives/format-currency.directive';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
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
    this.addAssetLiabilityRow('Assets');
    this.addAssetLiabilityRow('Liabilities');

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
            financialHealthDocsInfoArray.push(this.createFinancialHealthDocFormGroup(doc));
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
        financialHealthDocsInfoArray.push(this.createFinancialHealthDocFormGroup({}));
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

  // checkFormValidation(form: FormGroup | FormArray): boolean {
  //   let isValid = true;

  //   const validateControl = (control: AbstractControl, controlName?: string) => {
  //     if (control.invalid && control.errors) {
  //       if (control.errors['required']) {
  //         const label = this.getControlLabel(controlName || 'Field');
  //         this.adminService.showMessage(`${label} is required`);
  //         isValid = false;
  //       }
  //       if (control.errors['invalidValue']) {
  //         const label = this.getControlLabel(controlName || 'Field');
  //         this.adminService.showMessage(`${label} cannot be 0`);
  //         isValid = false;
  //       }
  //     }
  //   };

  //   const traverseForm = (formGroup: FormGroup | FormArray) => {
  //     if (formGroup instanceof FormGroup) {
  //       Object.keys(formGroup.controls).forEach((controlKey) => {
  //         const control = formGroup.get(controlKey); // This might return null
  //         if (control) { // Ensure control is not null
  //           if (control instanceof FormGroup || control instanceof FormArray) {
  //             traverseForm(control); // Recursively validate nested forms/arrays
  //           } else {
  //             validateControl(control, controlKey);
  //           }
  //         }
  //       });
  //     } else if (formGroup instanceof FormArray) {
  //       formGroup.controls.forEach((control, index) => {
  //         if (control instanceof FormGroup || control instanceof FormArray) {
  //           traverseForm(control); // Recursively validate nested forms/arrays
  //         } else {
  //           validateControl(control, `Item ${index + 1}`);
  //         }
  //       });
  //     }
  //   };


  //   traverseForm(form);
  //   return isValid; // Returns true if the form is valid, false otherwise
  // }


  // getControlLabel(controlName: string): string {
  //   const controlLabels: { [key: string]: string } = {
  //     supplierId: 'Supplier ID',
  //     loggedId: 'Logged ID',
  //     businessCapId: 'Business Cap ID',
  //     experienceId: 'Experience',
  //     currencyId: 'Currency',
  //     aggregateValueProjects: 'Aggregate Value of Projects',
  //     maxValueOfProjectUndertake: 'Maximum Value of Projects Undertaken',
  //     creditLimit: 'Credit Limit',
  //     creditExposureLimit: 'Credit Exposure Limit',
  //     projectLimit: 'Project Limit',
  //     projectDetailsId: 'Project Details ID',
  //     projectStatusId: 'Project Status',
  //     customerName: 'Customer Name',
  //     projectDescription: 'Project Description',
  //     startDate: 'Start Date',
  //     endDate: 'End Date',
  //     countryId: 'Country',
  //     value: 'Project Value',
  //     financialHealthId: 'Financial Health ID',
  //     netProfitLast3Year: 'Net Profit for the Last 3 Years',
  //     financialHealthDocsInfo: 'Financial Health Documents',
  //   };

  //   return controlLabels[controlName] || controlName; // Fallback to the control name if no label is found
  // }


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

  addProjectDetailsRow() {
    this.projectDetailsInfos.markAllAsTouched();
    const projectDetailsFormGroup = this.fb.group({
      projectDetailsId: [0],
      projectStatusId: [null, Validators.required],
      customerName: [null, Validators.required],
      projectDescription: [null, Validators.required],
      startDate: [null, Validators.required],
      //endDate: [null],
      endDate: [{ value: null, disabled: true }],
      countryId: [null, Validators.required],
      currencyId: [null],
      value: [null],
    });

    projectDetailsFormGroup.get('startDate')?.valueChanges.subscribe((startDate) => {
      const endDateControl = projectDetailsFormGroup.get('endDate');

      if (startDate) {
        const startDateValue = new Date(startDate);
        endDateControl?.enable();
        // endDateControl?.setValidators([
        //   Validators.required,
        //   (control) => {
        //     const endDateValue = new Date(control.value);
        //     return endDateValue >= startDateValue ? null : { invalidEndDate: true };
        //   },
        // ]);
      } else {
        endDateControl?.disable();
      }

      endDateControl?.updateValueAndValidity();
    });
    if (this.projectDetailsInfos.valid) {
      this.projectDetailsInfos.push(projectDetailsFormGroup);
    }
  }


  removeProjectDetailsRow(index: number) {
    const project = this.projectDetailsInfos.at(index);
    const projectDetailsId = project?.get('projectDetailsId')?.value;
    if (projectDetailsId !== 0) {
      this.SupplierUserForm.DeleteProjectDetails(projectDetailsId, this.userData.supplierId, this.userData.userId).subscribe((res: any) => {
        if (res.success) {
          this.projectDetailsInfos.removeAt(index);
          this.adminService.showMessage(res.message);
        } else {
          this.adminService.showMessage(res.message);
        }
      })
    }
    else {
      this.projectDetailsInfos.removeAt(index);
    }

  }

  get assetLiabilitieInfos(): FormArray {
    return this.financialForm.get('assetLiabilitieInfos') as FormArray;
  }
  // Method to add a row dynamically

  addAssetLiabilityRow(type: string): void {
    const group = this.fb.group({
      assetsLiabId: [null],
      description: [type],
      fromDateYear1: [null, Validators.required],
      toDateYear1: [{ value: null, disabled: true }, Validators.required],
      valueYear1: [null, Validators.required],
      fromDateYear2: [null],
      toDateYear2: [{ value: null, disabled: true }],
      valueYear2: [null],
      fromDateYear3: [null],
      toDateYear3: [{ value: null, disabled: true }],
      valueYear3: [null],
    });

    this.assetLiabilitieInfos.push(group);


    this.handleDateChanges(group, 'fromDateYear1', 'toDateYear1');
    this.handleDateChanges(group, 'fromDateYear2', 'toDateYear2');
    this.handleDateChanges(group, 'fromDateYear3', 'toDateYear3');
  }
  ClearValues(): boolean {
    // this.SaveDraftFlag.emit(this.commonService.CommonClearValues(this.financialForm));
    if (this.financialForm.valid) {
      this.SaveDraftFlag.emit(true)
    } else {
      this.SaveDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.financialForm);
  }
  handleDateChanges(group: FormGroup, fromDateControl: string, toDateControl: string): void {
    group.get(fromDateControl)?.valueChanges.subscribe((fromDate) => {
      const toDate = group.get(toDateControl);
      if (fromDate) {
        toDate?.enable();
        // toDate?.setValidators([
        //   Validators.required,
        //   (control) => this.endDateValidator(control, fromDate),
        // ]);
      } else {
        // Disable To Date when From Date is not selected
        toDate?.disable();
        toDate?.clearValidators();
      }
      toDate?.updateValueAndValidity();
    });
  }

  endDateValidator(control: any, fromDate: Date) {
    if (control.value && control.value < fromDate) {
      return { invalidEndDate: true };
    }
    return null;
  }


  downloadDoc(data: any): void {
    if (data.folderPath && data.folderPath !== '0') {
      // Call the service to download the file
      this.SupplierUserForm.downloadFile(data.folderPath).subscribe({
        next: (fileData: Blob) => {
          // Create a Blob URL and trigger the download in the browser
          const downloadUrl = window.URL.createObjectURL(fileData);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = data.folderPath.split('/').pop();  // Extract the file name from path
          link.click();
          window.URL.revokeObjectURL(downloadUrl);  // Clean up the object URL
        },
        error: (err) => {
          console.error('Download failed', err);
        }
      });
    }
  }


  get financialHealthDocsArray(): FormArray {
    return this.financialForm.get('financialHealthInfo.financialHealthDocsInfo') as FormArray;
  }
  createFinancialHealthDocFormGroup(doc: any): FormGroup {
    return this.fb.group({
      finDocId: [doc.finDocId || null],
      financialHealthId: [doc.financialHealthId || null],
      documentTypeId: [doc.documentTypeId || null],
      document: [doc.document || null],
      fileName: [doc.fileName || null],
      folderPath: [doc.folderPath || null],
      fileType: [doc.fileType || null],
    });
  }
  onFileSelect(event: any) {
    this.attachToggle = false;
    const file = event.target.files[0];

    if (file) {
      const financialHealthDocsInfoArray = this.financialForm.get('financialHealthInfo.financialHealthDocsInfo') as FormArray;

      // Check if the file already exists in the FormArray by its file name
      const existingDocIndex = financialHealthDocsInfoArray.controls.findIndex(
        (docGroup: AbstractControl) => {
          const group = docGroup as FormGroup;
          return group.get('fileName')?.value === file.name;
        }
      );

      if (existingDocIndex === -1) {
        // File doesn't exist, so add it to the array
        const financialDocsInfo = {
          finDocId: null,
          financialHealthId: this.financialForm.get('financialHealthInfo.financialHealthId')?.value,
          documentTypeId: 0,
          document: file,
          fileName: file.name,
          folderPath: '',
          fileType: file.type,
        };

        financialHealthDocsInfoArray.push(this.createFinancialHealthDocFormGroup(financialDocsInfo));
      } else {
        const message = `The file ${file.name} already exists.`;
        this.adminService.showMessage(message);
      }
    }
    this.toggleAttach();
  }

  removeDocument(data: any, index: number) {
    const value = data.value[index]
    const financialHealthDocsInfoArray = this.financialForm.get('financialHealthInfo.financialHealthDocsInfo') as FormArray;
    if (value.finDocId === null || value.finDocId === 0 || value.finDocId === undefined) {
      financialHealthDocsInfoArray.removeAt(index);
    } else {
      this.SupplierUserForm.DeleteFinancialDocumet(value.finDocId, value.financialHealthId, this.userData.userId).subscribe(res => {
        if (res.success) {
          financialHealthDocsInfoArray.removeAt(index);
          this.adminService.showMessage(res.message);
        } else {
          this.adminService.showMessage(res.message);
        }
      })
    }

  }
  saveFinancialandBusiness(isNextClick: boolean = false) {
    this.isSubmitted = true;
    this.financialForm.markAllAsTouched();
    this.validateLimitForm();

    if (isNextClick && this.financialForm?.dirty && this.financialForm.valid && this.financialData?.businessCreditInfos?.experienceName) {
      this.confirmatioPopUp(isNextClick);
    } else if (this.financialForm.valid && !this.creditLimitError && !this.exposureLimitError && !isNextClick) {
      const dto = this.financialForm.value;
      dto.supplierId = this.userData.supplierId;
      dto.loggedId = this.userData.userId;
      dto.businessCreditInfos = {
        ...dto.businessCreditInfos, // Preserve existing properties
        aggregateValueProjects: dto.businessCreditInfos.aggregateValueProjects
          ? this.roundNumber(dto.businessCreditInfos.aggregateValueProjects)
          : null,
        maxValueOfProjectUndertake: dto.businessCreditInfos.maxValueOfProjectUndertake
          ? this.roundNumber(dto.businessCreditInfos.maxValueOfProjectUndertake)
          : null

      }
      if (dto.projectDetailsInfos && Array.isArray(dto.projectDetailsInfos)) {
        dto.projectDetailsInfos.forEach((project: any) => {
          if (project.startDate) {
            project.startDate = moment(project.startDate).format('YYYY-MM-DDTHH:mm:ssZ');
            project.endDate = (project.endDate === 'Invalid date' || project.endDate === undefined || project.endDate === null) ? null : moment(project.endDate).format('YYYY-MM-DDTHH:mm:ssZ');
            project.value = project.value ? this.roundNumber(project?.value) : null;
          }
        });
      }
      if (dto.assetLiabilitieInfos && Array.isArray(dto.assetLiabilitieInfos)) {
        dto.assetLiabilitieInfos.forEach((asset: any) => {
          console.log('asset', asset);

          if (asset.fromDateYear1 && asset.toDateYear1) {
            asset.fromDateYear1 = moment(asset.fromDateYear1).format('YYYY-MM-DDTHH:mm:ssZ');
            asset.toDateYear1 = (asset.toDateYear1 === 'Invalid date' || asset.toDateYear1 === null) ? null : moment(asset.toDateYear1).format('YYYY-MM-DDTHH:mm:ssZ');
            asset.valueYear1 = asset.valueYear1 ? this.roundNumber(asset.valueYear1) : null;
            asset.fromDateYear2 = (asset.fromDateYear2 === 'Invalid date' || asset.fromDateYear2 === null) ? null : moment(asset.fromDateYear2).format('YYYY-MM-DDTHH:mm:ssZ');
            asset.toDateYear2 = (asset.toDateYear2 === 'Invalid date' || asset.toDateYear2 === undefined || asset.toDateYear2 === null) ? null : moment(asset.toDateYear2).format('YYYY-MM-DDTHH:mm:ssZ');

            asset.valueYear2 = asset.valueYear2 ? this.roundNumber(asset.valueYear2) : null;
            asset.fromDateYear3 = (asset.fromDateYear3 === 'Invalid date' || asset.fromDateYear3 === null) ? null : moment(asset.fromDateYear3).format('YYYY-MM-DDTHH:mm:ssZ');
            asset.toDateYear3 = (asset.toDateYear3 === 'Invalid date' || asset.toDateYear3 === undefined || asset.toDateYear3 === null) ? null : moment(asset.toDateYear3).format('YYYY-MM-DDTHH:mm:ssZ');

            asset.valueYear3 = asset.valueYear3 ? this.roundNumber(asset.valueYear3) : null
          }
        });
      }
      const formData = new FormData();

      const financialHealthDocsInfoArray = this.financialForm.get('financialHealthInfo.financialHealthDocsInfo') as FormArray;
      financialHealthDocsInfoArray.controls.forEach((doc: any) => {
        const document = doc.get('document')?.value;
        if (document) {
          formData.append('FinaHealthList_', document, document.name);
        }
      });

      formData.append('FinancialAndBusiness', JSON.stringify(dto));

      this.SupplierUserForm.SaveFinacialAndBusiness(formData).subscribe(res => {
        if (res.success) {
          this.financialForm.clearValidators();
          if (this.financialData?.businessCreditInfos?.experienceName) {
            this.adminService.showMessage('Data on the form has been updated successfully');
          } else {
            this.adminService.showMessage('Data on the form has been saved successfully');
          }
          this.financialForm.reset();
          this.GetFinancialBusinessDetails();
          if (isNextClick) {
            setTimeout(() => {
              this.nextTabEmit.emit();
            }, 1000);
          }
          if (this.previousTabClick) {
            setTimeout(() => {
              this.dialogResult.emit(true);
            }, 1000);
          }
        } else {
          this.adminService.showMessage(res.message);
        }
      }

      );
    } else if (isNextClick && !this.financialForm.dirty) {
      if (this.financialData?.businessCreditInfos?.experienceName) {
        this.nextTabEmit.emit();
      } else {
        this.isSubmitted = true;
      }
    } else {
      if (this.financialForm?.valid) {
        if (isNextClick) {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        } else {
          this.adminService.showMessage('Please fill in all mandatory fields before save');
        }
      }
    }
  }

  fixNumberFormat(wrongNumber: string): number {
    // Step 1: Remove all dots except the last one
    let parts = wrongNumber.split(",");
    let integerPart = parts[0].replace(/\./g, ""); // Remove all dots from integer part
    let decimalPart = parts[1] || "00"; // Keep decimal part if exists

    // Step 2: Join integer and decimal parts properly
    let fixedNumber = `${integerPart}.${decimalPart}`;

    // Step 3: Convert to a proper number
    return parseFloat(fixedNumber);
  }

  NextButtonValidation() {
    if(this.financialData?.businessCreditInfos?.experienceName){
      this.NextFlag.emit(true);
    }else{
      this.NextFlag.emit(false);
    }
  }

  private roundNumber(value: string): string {
    // Remove commas first
    if (!value) return '';

    // Step 1: Normalize decimal separator (convert to a standard format)
    let normalizedValue = value.replace(this.systemParameter.decimalSymbol, this.systemParameter.decimalSymbol);

    // Step 2: Remove grouping symbols (e.g., commas)
    let numericValue = normalizedValue.replace(new RegExp(`[${this.systemParameter.digitGroupingsymb}]`, 'g'), '');

    if (this.systemParameter.digitGroupingsymb === ',') {
      let roundedValue = Number(numericValue).toFixed(this.systemParameter.noOfDigitsAftDec);
      let formattedValue = this.formatAndSetValue(roundedValue.replace(this.systemParameter.decimalSymbol, this.systemParameter.decimalSymbol));

      return formattedValue;
    } else {

      const correctNumber = this.fixNumberFormat(numericValue);
      let roundedValue = Number(correctNumber).toLocaleString('de-DE', { minimumFractionDigits: 2 });
      let formattedValue = this.formatAndSetValue(roundedValue.replace(this.systemParameter.decimalSymbol, this.systemParameter.decimalSymbol));

      return formattedValue;
    }

  }

  private formatAndSetValue(data: string) {

    let value = data?.replace(new RegExp(`[${this.systemParameter.digitGroupingsymb}]`, 'g'), '');

    if (value) {

      if (this.systemParameter?.digitGrouping === '12,34,56,789') {
        value = this.formatIndianNumber(value);
      } else if (this.systemParameter?.digitGrouping === '123,456,789') {
        value = this.formatWesternNumber(value);
      } else if (this.systemParameter?.digitGrouping === '123456,789') {
        value = this.formatCustomNumber(value);
      } else {
        value = value;
      }
    }

    return value;

  }

  private formatIndianNumber(value: string): string {
    if (!value) return '';
    const groupingSymbol = this.systemParameter.digitGroupingsymb || ',';
    let [integerPart, decimalPart] = value.split(`${this.systemParameter.decimalSymbol}`);
    integerPart = integerPart.replace(/(\d+)(\d{3})$/, (match, p1, p2) => {
      return p1.replace(/\B(?=(\d{2})+(?!\d))/g, groupingSymbol) + groupingSymbol + p2;
    });
    return decimalPart !== undefined ? `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart}` : integerPart;
  }

  private formatWesternNumber(value: string): string {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, `${this.systemParameter.digitGroupingsymb}`);
  }

  private formatCustomNumber(value: string): string {
    if (!value) return '';
    const groupingSymbol = this.systemParameter?.digitGroupingsymb || ',';
    value = value.replace(new RegExp(`[${groupingSymbol}]`, 'g'), '');
    let [integerPart, decimalPart] = value.split(this.systemParameter?.decimalSymbol || '.');
    integerPart = integerPart.replace(/(\d+)(\d{3})$/, (_, p1, p2) => {
      return p1 + groupingSymbol + p2;
    });
    return decimalPart !== undefined ? `${integerPart}${this.systemParameter?.decimalSymbol}${decimalPart}` : integerPart;
  }

  // validateLimitForm() {
  //   // Get form controls
  //   const creditLimitControl = this.financialForm.get('businessCreditInfos.creditLimit');
  //   const exposureLimitControl = this.financialForm.get('businessCreditInfos.creditExposureLimit');
  //   const projectLimitControl = this.financialForm.get('businessCreditInfos.projectLimit');

  //   // Convert values to numbers safely
  //   const parseValue = (value: any): number | null => {
  //     if (value == null || value === '') return null; // Handle null/undefined/empty cases
  //     if (typeof value === 'string') value = value.replace(/,/g, ''); // Remove commas if string
  //     const num = Number(value);
  //     return isNaN(num) ? null : num; // Convert to number or return null if invalid
  //   };

  //   const creditLimit = parseValue(creditLimitControl?.value);
  //   const exposureLimit = parseValue(exposureLimitControl?.value);
  //   const projectLimit = parseValue(projectLimitControl?.value);

  //   // Reset errors only for the specific field
  //   // if (controlName === 'creditLimit') {
  //   creditLimitControl?.setErrors(null);
  //   if (creditLimit !== null && exposureLimit !== null && creditLimit <= exposureLimit) {
  //     creditLimitControl?.setErrors({ exceedsExposure: true });
  //   }
  //   if (creditLimit !== null && projectLimit !== null && creditLimit <= projectLimit) {
  //     creditLimitControl?.setErrors({ exceedsProject: true });
  //   }
  //   // }

  //   // if (controlName === 'creditExposureLimit') {
  //   exposureLimitControl?.setErrors(null);
  //   if (exposureLimit !== null && projectLimit !== null && exposureLimit <= projectLimit) {
  //     exposureLimitControl?.setErrors({ exceedsProject: true });
  //   }
  //   if (creditLimit !== null && exposureLimit !== null && creditLimit <= exposureLimit) {
  //     exposureLimitControl?.setErrors({ exceedsCredit: true });
  //   }
  //   // }

  //   // if (controlName === 'projectLimit') {
  //   projectLimitControl?.setErrors(null);
  //   if (exposureLimit !== null && projectLimit !== null && exposureLimit <= projectLimit) {
  //     projectLimitControl?.setErrors({ exceedsExposure: true });
  //   }
  //   if (creditLimit !== null && projectLimit !== null && creditLimit <= projectLimit) {
  //     projectLimitControl?.setErrors({ exceedsCredit: true });
  //   }
  //   // }
  // }


  validateLimitForm() {
    // Get form controls
    const creditLimitControl = this.financialForm.get('businessCreditInfos.creditLimit');
    const exposureLimitControl = this.financialForm.get('businessCreditInfos.creditExposureLimit');
    const projectLimitControl = this.financialForm.get('businessCreditInfos.projectLimit');

    // Convert values to numbers safely
    const parseValue = (value: any): number | null => {
      if (value == null || value === '') return null; // Handle null/undefined/empty cases
      if (typeof value === 'string') value = value.replace(/,/g, ''); // Remove commas if string
      const num = Number(value);
      return isNaN(num) ? null : num; // Convert to number or return null if invalid
    };

    const creditLimit = parseValue(creditLimitControl?.value);
    const exposureLimit = parseValue(exposureLimitControl?.value);
    const projectLimit = parseValue(projectLimitControl?.value);

    // Reset errors for all fields before setting new ones
    creditLimitControl?.setErrors(null);
    exposureLimitControl?.setErrors(null);
    projectLimitControl?.setErrors(null);

    // Validation logic

    // Credit Limit validation
    // if (creditLimit !== null && exposureLimit !== null && creditLimit < exposureLimit) {

    //   creditLimitControl?.setErrors({ exceedsExposure: true });
    // }
    // if (creditLimit !== null && projectLimit !== null && creditLimit < projectLimit) {
    //   creditLimitControl?.setErrors({ exceedsProject: true });
    // }

    // Exposure Limit validation
    // if (exposureLimit !== null && projectLimit !== null && exposureLimit < projectLimit) {
    //   exposureLimitControl?.setErrors({ exceedsProject: true });
    // }
    if (creditLimit !== null && exposureLimit !== null && creditLimit < exposureLimit) {
      exposureLimitControl?.setErrors({ exceedsCredit: true });
    }

    // Project Limit validation
    if (exposureLimit !== null && projectLimit !== null && exposureLimit < projectLimit) {
      projectLimitControl?.setErrors({ exceedsExposure: true });
    }
    // if (creditLimit !== null && projectLimit !== null && creditLimit < projectLimit) {
    //   projectLimitControl?.setErrors({ exceedsCredit: true });
    // }
  }


  // validateLimitForm() {
  //   // Get form controls
  //   const creditLimitControl = this.financialForm.get('businessCreditInfos.creditLimit');
  //   const exposureLimitControl = this.financialForm.get('businessCreditInfos.creditExposureLimit');
  //   const projectLimitControl = this.financialForm.get('businessCreditInfos.projectLimit');

  //   const creditLimit = creditLimitControl?.value ? parseInt(creditLimitControl.value.replace(/,/g, '')) : null;
  //   const exposureLimit = exposureLimitControl?.value ? parseInt(exposureLimitControl.value.replace(/,/g, '')) : null;
  //   const projectLimit = projectLimitControl?.value ? parseInt(projectLimitControl.value.replace(/,/g, '')) : null;

  //   // Reset errors
  //   creditLimitControl?.setErrors(null);
  //   exposureLimitControl?.setErrors(null);
  //   projectLimitControl?.setErrors(null);

  //   // Validation logic
  //   if (creditLimit !== null && exposureLimit !== null && creditLimit <= exposureLimit) {
  //     creditLimitControl?.setErrors({ exceedsExposure: true });
  //   }
  //   if (exposureLimit !== null && projectLimit !== null && exposureLimit <= projectLimit) {
  //     exposureLimitControl?.setErrors({ exceedsProject: true });
  //   }
  //   if (creditLimit !== null && projectLimit !== null && creditLimit <= projectLimit) {
  //     creditLimitControl?.setErrors({ exceedsProject: true });
  //   }
  // }
  // validateLimitForm() {
  //   const creditLimit = this.financialForm.get('businessCreditInfos.creditLimit')?.value === '' ? null : this.financialForm.get('businessCreditInfos.creditLimit')?.value;
  //   const exposureLimit = this.financialForm.get('businessCreditInfos.creditExposureLimit')?.value === '' ? null : this.financialForm.get('businessCreditInfos.creditExposureLimit')?.value;
  //   const projectLimit = this.financialForm.get('businessCreditInfos.projectLimit')?.value === '' ? null : this.financialForm.get('businessCreditInfos.projectLimit')?.value;


  //   this.creditLimitError = null;
  //   this.exposureLimitError = null;
  //   if (creditLimit === null && exposureLimit === null && projectLimit === null) {
  //     this.creditLimitError = null;
  //     this.exposureLimitError = null;
  //   } else {
  //     // Add null checks before performing comparisons
  //     if (creditLimit !== null && exposureLimit !== null && parseInt(creditLimit) <= parseInt(exposureLimit)) {
  //       // this.creditLimitError = 'Credit Limit must be greater than Credit Exposure Limit';
  //       this.creditLimitFlag = true;
  //       return;
  //     }

  //     else if (exposureLimit !== null && projectLimit !== null && parseInt(exposureLimit) <= parseInt(projectLimit)) {
  //       // this.exposureLimitError = 'Credit Exposure Limit must be greater than Project Limit';
  //       this.exposureLimitFlag = true;
  //       return;
  //     }
  //     else if (creditLimit !== null && projectLimit !== null && parseInt(creditLimit) <= parseInt(projectLimit)) {
  //       // this.creditLimitError = 'Credit Limit must be greater than Project Limit';
  //       this.creditLimitFlag = true;
  //       return;
  //     }
  //   }
  // }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numeric keys (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = window.atob(base64); // Decodes Base64 to binary string
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen); // Creates a byte array to hold the binary data

    // Loop through the binary string and convert it to a byte array
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }

    return bytes; // Returns the byte array (Uint8Array)
  }

  saveByteArray(filename: string, byte: Uint8Array): void {
    const blob = new Blob([byte], { type: 'application/octet-stream' });

    // Create a link element for file download
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';

    // Create a URL for the blob and set it as the href
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;

    // Trigger the download
    a.click();

    // Cleanup
    URL.revokeObjectURL(url); // Release the URL object
    a.remove(); // Remove the link element from the DOM
  }

  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {
    const financialFields = Object.values(this.financialForm.controls).some(control => control.dirty || control.value);

    if (financialFields && this.financialForm.dirty) {
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
            // this.saveFinancialandBusiness();
            this.nextTabEmit.emit();
            return;
          } else {
            this.previousTabClick = true;
            this.dialogResult.emit(true);
            // this.saveFinancialandBusiness();
          }
        } else {
          //New condition for previous No Btn
          if (isPreviousClick) {
            return;
          }
          if (isNextClick) {
            return;
            // this.nextTabEmit.emit();
          } else {
            this.dialogResult.emit(true);
          }
        }
      });
    } else {
      if (isNextClick) {
        this.nextTabEmit.emit();
      } else {
        this.financialForm.reset();
        this.dialogResult.emit(true);
      }
    }
  }
  resetForm() {
    this.financialForm.reset();
  }

  endDateValidate(i: number) {
    const projectDetailsArray = this.financialForm.get('projectDetailsInfos') as FormArray;
    const group = projectDetailsArray.at(i) as FormGroup;
    const projectStatusId = group.get('projectStatusId')?.value;
    const endDateControl = group.get('endDate');
    if (projectStatusId === 2) {
      endDateControl?.setValidators([Validators.required]);
    } else {
      endDateControl?.clearValidators();
    }
    endDateControl?.updateValueAndValidity();
  }

  onBlur(event: Event): void {
    if (this.systemParameter?.noOfDigitsAftDec === '3') {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/,/g, '');
      let [integerPart, decimalPart] = value.split('.');
      decimalPart = '000';
      const formattedIntegerPart = this.formatIndianNumber(integerPart);
      let formattedDecimalPart = this.systemParameter?.decimalSymbol === '.' ? '.' + decimalPart.slice(0, 3) : ',' + decimalPart.slice(0, 3);
      const formattedValue = formattedIntegerPart + formattedDecimalPart;
      input.value = formattedValue;
      this.financialForm.get('aggregateValueProjects')?.setValue(formattedValue);
    } else if (this.systemParameter?.noOfDigitsAftDec === '2') {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/,/g, '');
      let [integerPart, decimalPart] = value.split('.');
      decimalPart = '00';
      const formattedIntegerPart = this.formatIndianNumber(integerPart);
      let formattedDecimalPart = this.systemParameter?.decimalSymbol === '.' ? '.' + decimalPart.slice(0, 2) : ',' + decimalPart.slice(0, 2);
      const formattedValue = formattedIntegerPart + formattedDecimalPart;
      input.value = formattedValue;
      this.financialForm.get('aggregateValueProjects')?.setValue(formattedValue);
    } else if (this.systemParameter?.noOfDigitsAftDec === '1') {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/,/g, '');
      let [integerPart, decimalPart] = value.split('.');
      decimalPart = '0';
      const formattedIntegerPart = this.formatIndianNumber(integerPart);
      let formattedDecimalPart = this.systemParameter?.decimalSymbol === '.' ? '.' + decimalPart.slice(0, 1) : ',' + decimalPart.slice(0, 1);
      const formattedValue = formattedIntegerPart + formattedDecimalPart;
      input.value = formattedValue;
      this.financialForm.get('aggregateValueProjects')?.setValue(formattedValue);
    } else {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/,/g, '');
      let [integerPart, decimalPart] = value.split('.');
      decimalPart = '';
      const formattedIntegerPart = this.formatIndianNumber(integerPart);
      let formattedDecimalPart = this.systemParameter?.decimalSymbol === '.' ? '' + decimalPart.slice(0, 0) : '' + decimalPart.slice(0, 0);
      const formattedValue = formattedIntegerPart + formattedDecimalPart;
      input.value = formattedValue;
      this.financialForm.get('aggregateValueProjects')?.setValue(formattedValue);
    }
  }

  formatNumber(event: Event): void {

    if (this.systemParameter?.digitGrouping === '12,34,56,789') {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/,/g, '');
      const formattedIntegerPart = this.formatIndianNumber(value);
      const formattedValue = formattedIntegerPart;
      input.value = formattedValue;
      this.financialForm.get('aggregateValueProjects')?.setValue(formattedValue);
    } else if (this.systemParameter?.digitGrouping === '123,456,789') {
      const input = event.target as HTMLInputElement;
      const value = input.value.replace(/,/g, ''); // Remove existing commas
      const formattedValue = this.formatWesternNumber(value);
      input.value = formattedValue;
      this.financialForm.get('aggregateValueProjects')?.setValue(formattedValue);
    } else if (this.systemParameter?.digitGrouping === '123456,789') {
      const input = event.target as HTMLInputElement;
      const value = input.value.replace(/,/g, ''); // Remove existing commas
      const formattedValue = this.formatCustomNumber(value);
      input.value = formattedValue;
      this.financialForm.get('aggregateValueProjects')?.setValue(formattedValue);
    }
  }

  // private formatIndianNumber(value: string): string {
  //   if(this.systemParameter?.digitGroupingsymb === ','){
  //   if (!value) return '';
  //   let lastThree = value.slice(-3);
  //   let otherNumbers = value.slice(0, -3);
  //   if (otherNumbers !== '') lastThree = ',' + lastThree;
  //   return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  //   }else{
  //     if (!value) return '';
  //     let lastThree = value.slice(-3);
  //     let otherNumbers = value.slice(0, -3);
  //     if (otherNumbers !== '') lastThree = '.' + lastThree;
  //     return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, '.') + lastThree;
  //   }
  // }

  // private formatWesternNumber(value: string): string {
  //   if (!value) return '';
  //   // Regex to add commas every 3 digits from the right
  //   return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // }

  // private formatCustomNumber(value: string): string {
  //   if (!value) return '';

  //   // Split the number into the first 6 digits and the rest
  //   let firstPart = value.slice(0, 6);
  //   let secondPart = value.slice(6);

  //   // Format the second part (add commas every 3 digits)
  //   secondPart = secondPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  //   // Combine the two parts with a comma separator
  //   return firstPart + (secondPart ? ',' + secondPart : '');
  // }

  toggleAttach() {
    this.attachToggle = !this.attachToggle;
  }

  closeAttach() {
    this.attachToggle = !this.attachToggle;
  }

}



