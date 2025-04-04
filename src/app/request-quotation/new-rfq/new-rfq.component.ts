import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormsModule, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatIconButton, MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { OnlyAllowedInputDirective } from '@app/core/directives/only-allowed-input.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { LoginService } from '@app/core/services/login/login.service';
import { CommonService } from '@app/core/services/common.service';
import { RFQService } from '@app/core/services/rfq/rfq.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { AssignSupplierComponent } from '@app/dialogs/assign-supplier/assign-supplier.component';
import { AdminService } from '@app/core/services/admin/admin.service';
import { MatBadge } from '@angular/material/badge';
import { AssignSupplierComponent } from '@app/dialogs/assign-supplier/assign-supplier.component';
import { RestApiService } from '@app/services/rest-api.service';
import { catchError, of } from 'rxjs';
import { EntityHierarchyLevelsPipe } from '@app/core/pipes/entity-hierarchy-levels.pipe';
import { DialogInitiateApprovalComponent } from '@app/dialogs/dialog-initiate-approval/dialog-initiate-approval.component';
import { AllowNumberOnlyDirective } from '@app/core/directives/allowNumberOnly.directive';
import { AgGridUiComponent } from '@app/ui-components/ag-grid-ui/ag-grid-ui.component';
import { AllCommunityModule,ModuleRegistry,themeBalham, ColDef} from 'ag-grid-community'; 
import { AgGridModule } from 'ag-grid-angular';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-new-rfq',
  standalone: true,
  imports: [MatDialogTitle, UpperCasePipe, OnlyAllowedInputDirective, MatIconButton, MatDialogClose, MatTooltip, MatInputModule, MatIconModule, 
    MatButtonModule, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule,
    NgClass, MatFormField, MatCheckbox, MatLabel, MatSelect, MatOption, NgFor, NgIf, MatError, MatInput, MatDialogActions,
    MatIcon, MatButton, TranslatePipe, MatDatepickerModule, MatBadge, EntityHierarchyLevelsPipe, AllowNumberOnlyDirective, AgGridUiComponent,AgGridModule ],
  templateUrl: './new-rfq.component.html',
  styleUrl: './new-rfq.component.scss'
})
export class NewRfqComponent implements OnInit {

  @ViewChild('addSupplier') addSupplier: any;
   @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;
   public theme = themeBalham;
  rfqForm: FormGroup;
  isSubmitted = false;
  entityData: { entityId: number; entityCode: string; companyName: string; }[];
  sourceData: { sourceId: number; sourceName: string; }[];
  ratedType: ({ id: number; type: string; } | { id: number; type: string; })[];
  purchaseType: ({ id: number; type: string; } | { id: number; type: string; })[];
  validatityValue: { id: number; hourse: string; }[];
  FinCurrencyList: any;
  countryList: any;
  stateList: { [key: number]: any[] } = {}; // Object to store state lists per address index
  cityList: { [key: number]: any[] } = {};  // Object to store city lists per address index
  userData: any;
  inventoryItem: any;
  levelData: { id: number; name: string; }[];
  rfqId: any;
  levelData3: { id: number; name: string; }[];
  levelData2: { id: number; name: string; }[];
  levelData1: { id: number; name: string; }[];
  spendCategory: { id: number; name: string; }[];
  shipMethod: { id: number; name: string; }[];
  shipTerm: { id: number; name: string; }[];
  saveCategoryAndScopeVm: any;
  listOfFiles: any[][] = []; // 2D array to store files per row
  attachToggle: boolean[] = [];
  @ViewChild('fileInput') fileInput: ElementRef;
  purchaseClassification: any;
  sourcingList: any;
  documentSction: any;
  spendType: any;
  unitOfMeasure: any;
  participantTypes: ({ id: number; type: string } | { id: number; type: string; })[];
  sourcingTypes: ({ id: number; type: string } | { id: number; type: string; })[];
  entityLevelsLov: any = {
    entity: [],
    hierarchy: [],
    level1: '',
    level2: '',
    level3: '',
  };
  documentSupplierSction: any;
  pqformData: any;
  isDropdownDisabled = true;
  buyers: { id: number; name: string; }[];
  minDate = new Date();

  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private loginservice: LoginService,
    public commonService: CommonService,
    private rfqService: RFQService,
    private activateRouter: ActivatedRoute,
    private router: Router,
    public adminService: AdminService,
    private apiService: RestApiService,
  ) {
    this.initialForm();
  }

  ngOnInit(): void {
    const storedData: any = localStorage.getItem('loginDetails');
    this.userData = JSON.parse(storedData);
    this.unitofMeasure();
    this.getDocumentSection();
    // this.getEntityList();
    this.getCurrency();
    this.getCountry();
    this.getPurchaseClassification();
    this.getSourcingList();
    this.getSpendType();
    this.dropDownDatas();

    this.activateRouter.queryParams.subscribe(params => {
      if(params?.data){
      const data = JSON.parse(params['data']);
      this.pqformData = data;
      this.rfqId = 0;
      }
    });
    // this.SourcingRFQ.get('CreatedDate')?.disable();
    // this.SourcingRFQ.get('CreatedDate')?.setValue(new Date());
  }

  // getEntityList() {
  //   this.rfqService.getEntityList().subscribe(res => {
  //     this.entityData = res
  //   })
  // }

  unitofMeasure() {
    this.commonService.GetUnitofMeasure().subscribe(res => {
      this.unitOfMeasure = res;
    })
  }

  getPurchaseClassification() {
    this.rfqService.getpurchaseClassificationList().subscribe(res => {
      this.purchaseClassification = res.filter((item: { purchaseClassificationName: string; }) => item.purchaseClassificationName === "General");;
    })
  }

  getSourcingList() {
    this.rfqService.getsourcingList().subscribe(res => {
      this.sourcingList = res;
    })
  }

  getSpendType() {
    this.rfqService.getSpendType().subscribe(res => {
      this.spendType = res;
    })
  }

  getDocumentSection() {
    this.rfqService.getDocumentSection(3, 1).subscribe(res => {
      this.documentSction = res;
    })
    this.rfqService.getDocumentSection(3, 2).subscribe(res => {
      this.documentSupplierSction = res;
    })
  }

  setRFQForm(data: any) {
    this.updateForm(data);
  }

  checkInvalidFields(formGroup: FormGroup) {
    console.log(this.rfqForm.valid);
    
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      
      if (control instanceof FormControl && control.invalid) {
        console.log(`Field '${field}' is invalid:`, control.errors);
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        // this.checkInvalidFields(control);  // Recursively check nested forms
      }
    });
  }

  updateForm(data?: any) {

    // this.commonService.GetCityAllDetails().subscribe(res =>{
    //   this.cityList[0] = res,
    //   this.cityList[1] = res
    // })
    this.rfqForm = this.fb.group({

      SourcingRFQ: this.fb.group({
        // RfqId: 1001,
        rfqId: [data?.sourcingRFQ?.rfqId],
        entityid: [data?.sourcingRFQ?.entityid || '', Validators.required],
        level1: [data?.sourcingRFQ?.level1 || '', Validators.required],
        level2: [data?.sourcingRFQ?.level2 || '', Validators.required],
        level3: [data?.sourcingRFQ?.level3 || '', Validators.required],
        level4: [data?.sourcingRFQ?.level4 || '', Validators.required],
        source: [data?.sourcingRFQ?.source || '', Validators.required],
        prRefCode: [data?.sourcingRFQ?.prRefCode || ''],
        prDate: [data?.sourcingRFQ?.prDate || ''],
        prCreatedBy: [data?.sourcingRFQ?.prCreatedBy || ''],
        prApprovedValue: [data?.sourcingRFQ?.prApprovedValue || 0],
        ref: [{ value: data?.sourcingRFQ?.ref || '', disabled: true }],
        createdDate: [{ value: data?.sourcingRFQ?.createdDate || new Date(), disabled: true }],
        purchaseClarification: [data?.sourcingRFQ?.purchaseClarification || '', Validators.required],
        spendType: [data?.sourcingRFQ?.spendType || 0, Validators.required],
        buyer: [data?.sourcingRFQ?.buyer || '', Validators.required],
        rateType: [data?.sourcingRFQ?.rateType || '', Validators.required],
        shortName: [data?.sourcingRFQ?.shortName || '', Validators.required],
        description: [data?.sourcingRFQ?.description || '', Validators.required],
        sourcingType: [data?.sourcingRFQ?.sourcingType || 0, Validators.required],
        purchaseType: [data?.sourcingRFQ?.purchaseType || 0, Validators.required],
        participantType: [data?.sourcingRFQ?.participantType || '', Validators.required],
        itemLevelDiscount: [data?.sourcingRFQ?.itemLevelDiscount || false],
        itemLevelTax: [data?.sourcingRFQ?.itemLevelTax || false],
        incoOtherCost: [data?.sourcingRFQ?.incoOtherCost || false],
        forExCurrencyTxn: [data?.sourcingRFQ?.forExCurrencyTxn || false],
        allowPartialQtyResponse: [data?.sourcingRFQ?.allowPartialQtyResponse || false],
        validityofResponseNegotiable: [data?.sourcingRFQ?.validityofResponseNegotiable || false],
        witholdTaxApplicable: [data?.sourcingRFQ?.witholdTaxApplicable || false],
        changeItemShiptoSite: [data?.sourcingRFQ?.changeItemShiptoSite || false],
        changeItemNeedbyDate: [data?.sourcingRFQ?.changeItemNeedbyDate || false],
        approvedDate: [data?.sourcingRFQ?.approvedDate || '', Validators.required],
        publishDate: [data?.sourcingRFQ?.publishDate || '', Validators.required],
        clarificationDate: [data?.sourcingRFQ?.clarificationDate || '', Validators.required],
        responseDate: [data?.sourcingRFQ?.responseDate || '', Validators.required],
        submissionDueDate: [data?.sourcingRFQ?.submissionDueDate || '', Validators.required],
        responseOpenDate: [data?.sourcingRFQ?.responseOpenDate || '', Validators.required],
        awardProcessingDate: [data?.sourcingRFQ?.awardProcessingDate || '', Validators.required],
        awardDate: [data?.sourcingRFQ?.awardDate],
        needByDate: [data?.sourcingRFQ?.needByDate],
        expectedValidity: [data?.sourcingRFQ?.expectedValidity],
        validityValueId: [data?.sourcingRFQ?.validityValueId],
        functionalCurrencyId: [data?.sourcingRFQ?.functionalCurrencyId],
        transactionalCurrencyId: [data?.sourcingRFQ?.transactionalCurrencyId],
        spendCategoryId: [data?.sourcingRFQ?.spendCategoryId],
        notestoSupplier: [data?.sourcingRFQ?.notestoSupplier]
      }),

      RFQBillShipAddressTrans: this.fb.array([
        this.updateContactForm(data?.rfqBillShipAddressTrans[0]), // First Contact Field
        this.updateShipToAddressForm(data?.rfqBillShipAddressTrans[1]),  // Second Ship to Address Field
      ]),

      rfqBillOfQuantityTrans: this.fb.array([
      ]),

      RFQAssignSuppliersTrans: this.fb.array([
      ]),

      RFQShippingInfoTrans: this.fb.group({
        shippingInfoId: data?.rfqShippingInfoTrans?.shippingInfoId,
        shippingMethodId: data?.rfqShippingInfoTrans?.shippingMethodId,
        shippingTermId: data?.rfqShippingInfoTrans?.shippingTermId,
        description: data?.rfqShippingInfoTrans?.description,
        negotiable: data?.rfqShippingInfoTrans?.negotiable,
        rfqId: this.rfqId
      }),

      RFQDocumentSectionTrans: this.fb.array([
      ]),

      RFQSupplierDocumentSectionTrans: this.fb.array([
      ]),

    })

    const BillOfQualityTrans = this.rfqForm.get('rfqBillOfQuantityTrans') as FormArray;

    data?.rfqBillOfQuantityTrans.forEach((billqty: any) => {
      BillOfQualityTrans.push(this.fb.group({
        rfqBillOfQualityId: billqty?.rfqBillOfQualityId,
        code: billqty?.code,
        itemType: billqty?.itemType,
        description: billqty?.description,
        uomId: billqty?.uomId,
        quantity: billqty?.quantity,
        shiptoSite: billqty?.shiptoSite,
        needByDate: billqty?.needByDate,
        deleteFlag: billqty?.deleteFlag
        // RfqId: 1001
      }));
    })

    const AssignSuppliersTrans = this.rfqForm.get('RFQAssignSuppliersTrans') as FormArray;

    data?.rfqAssignSuppliersTrans.forEach((assign: any) => {
      AssignSuppliersTrans.push(this.fb.group({
        rfqSuppliersId: assign?.rfqSuppliersId,
        supplierId: assign?.supplierId,
        supplierCode: assign?.supplierCode,
        supplierName: assign?.supplierName,
        gradeId: assign?.gradeId,
        statusId: assign?.statusId,
        rfqId: this.rfqId
      }));
    })

    const DocumentSectionTrans = this.rfqForm.get('RFQDocumentSectionTrans') as FormArray;

    data?.rfqDocumentSectionTrans.forEach((document: any, index: number) => {
      console.log('document', document);

      DocumentSectionTrans.push(this.fb.group({
        documentSectionId: document?.shippingInfoId,
        docType: document?.docType,
        docName: document?.docName,
        docDescription: document?.docDescription,
        fileName: document?.fileName,
        fileType: document?.FileType,
        filebase64: document?.filebase64,
        uploadedBy: document?.uploadedBy,
        uploadedDate: document?.uploadedDate,
        filePath: document?.filePath,
        rfqId: this.rfqId
      }));
      const fileDetail = {

        name: document?.fileName,
        fileType: document?.fileType,
        filebase64: document?.filebase64,
        uploadedBy: document?.uploadedBy,
        uploadedDate: document?.uploadedDate,


      };
      this.listOfFiles[index] = this.listOfFiles[index] || [];
      if (fileDetail?.name) {
        this.listOfFiles[index].push(fileDetail);
      }

    })

    const SupplierDocumentSectionTrans = this.rfqForm.get('RFQSupplierDocumentSectionTrans') as FormArray;

    data?.rfqSupplierDocumentSectionTrans.forEach((section: any) => {
      SupplierDocumentSectionTrans.push(this.fb.group({
        supplierDocumentSectionId: section?.supplierDocumentSectionId,
        docName: section?.docName,
        docDescription: section?.docDescription,
        mandatory: section?.mandatory,
        optional: section?.optional,
        rfqId: this.rfqId
      }));
    })

  }

  initialForm(items?: any) {
    this.rfqForm = this.fb.group({

      SourcingRFQ: this.fb.group({
        // RfqId: 1001,
        entityid: ['', Validators.required],
        level1: ['', Validators.required],
        level2: ['', Validators.required],
        level3: ['', Validators.required],
        level4: ['', Validators.required],
        source: [this.pqformData?.PRdata?.purchaseRequisitionInfo?.sourceID ? 'Auto-Requisition' : 'Direct'],
        prRefCode: [''],
        prDate: [this.pqformData?.PRdata?.purchaseRequisitionInfo?.createdDate ? this.pqformData?.PRdata?.purchaseRequisitionInfo?.createdDate : ''],
        prCreatedBy: [''],
        prApprovedValue: [this.pqformData?.PRdata?.purchaseRequisitionInfo?.prApprovedValue ? this.pqformData?.PRdata?.purchaseRequisitionInfo?.prApprovedValue : 0],
        ref: [''],
        createdDate: [new Date()],
        purchaseClarification: [this.pqformData?.PRdata?.purchaseRequisitionInfo?.purchaseClassificationID ? this.pqformData?.PRdata?.purchaseRequisitionInfo?.purchaseClassificationID : '', Validators.required],
        spendType: [this.pqformData?.PRdata?.purchaseRequisitionInfo?.spendTypeID ? this.pqformData?.PRdata?.purchaseRequisitionInfo?.spendTypeID : 0, Validators.required],
        buyer: [this.pqformData?.Buyer ? this.pqformData?.Buyer : '', Validators.required],
        rateType: ['', Validators.required],
        shortName: [this.pqformData?.shortName ? this.pqformData?.shortName : '', Validators.required],
        description: ['', Validators.required],
        sourcingType: [0, Validators.required],
        purchaseType: [0, Validators.required],
        participantType: ['', Validators.required],
        itemLevelDiscount: [false],
        itemLevelTax: [false],
        incoOtherCost: [false],
        forExCurrencyTxn: [false],
        allowPartialQtyResponse: [false],
        validityofResponseNegotiable: [false],
        witholdTaxApplicable: [false],
        changeItemShiptoSite: [false],
        changeItemNeedbyDate: [false],
        approvedDate: ['', Validators.required],
        publishDate: ['', Validators.required],
        clarificationDate: ['', Validators.required],
        responseDate: ['', Validators.required],
        submissionDueDate: ['', Validators.required],
        responseOpenDate: ['', Validators.required],
        awardProcessingDate: ['', Validators.required],
        awardDate: ['', Validators.required],
        needByDate: ['', Validators.required],
        expectedValidity: ['', Validators.required],
        validityValueId: ['', Validators.required],
        functionalCurrencyId: [''],
        transactionalCurrencyId: [''],
        spendCategoryId: [''],
        notestoSupplier: ['']
      }),

      RFQBillShipAddressTrans: this.fb.array([
        this.createContactForm(), // First Contact Field
        this.createShipToAddressForm()  // Second Ship to Address Field
      ]),

      rfqBillOfQuantityTrans: this.fb.array([
      ]),

      RFQAssignSuppliersTrans: this.fb.array([
      ]),

      RFQShippingInfoTrans: this.fb.group({
        // ShippingInfoId: ['', Validators.required],
        shippingMethodId: [''],
        shippingTermId: [''],
        description: [''],
        negotiable: [false],
        // RfqId: 1001
      }),

      RFQDocumentSectionTrans: this.fb.array([
      ]),

      RFQSupplierDocumentSectionTrans: this.fb.array([
      ]),

    })

    const sectionQuestionsArray = this.rfqForm.get('rfqBillOfQuantityTrans') as FormArray;
    items?.forEach((item: any
    ) => {
      sectionQuestionsArray.push(this.fb.group({
        // RFQBillOfQualityId: 3001,
        code: [item?.partCode],
        itemType: [item?.itemType],
        description: [item?.description],
        uomId: [0],
        quantity: [''],
        shiptoSite: [],
        needByDate: [],
        deleteFlag: [true],
        // RfqId: 1001
      }));

    })

    const sectionDocumentArray = this.rfqForm.get('RFQDocumentSectionTrans') as FormArray;
    this.documentSction?.forEach((item: any
    ) => {
      sectionDocumentArray.push(this.fb.group({
        // RFQBillOfQualityId: 3001,
        docType: [item?.documentTypeMapId],
        docDescription: [''],
        fileName: [''],
        fileType: [''],
        filebase64: [''],
        docName: [item?.documentName],
        filePath: [''],
        uploadedBy: [item?.createdUserName],
        uploadedDate: []
        // RfqId: 1001
      }));
    })

    const sectionsupplierDocumentArray = this.rfqForm.get('RFQSupplierDocumentSectionTrans') as FormArray;
    this.documentSupplierSction?.forEach((item: any
    ) => {
      sectionsupplierDocumentArray.push(this.fb.group({
        // RFQBillOfQualityId: 3001,
        docName: [item?.documentName],
        docDescription: [''],
        mandatory: [],
        optional: [],
        // RfqId: 1001
      }));
    })

  }

  createContactForm(): FormGroup {
    return this.fb.group({
      // RFQBillShipAddressId: 2001,
      rfqAddressType: '1',
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      countryId: [0, Validators.required],
      stateId: [0, Validators.required],
      cityId: [0, Validators.required],
      postalCode: ['', Validators.required],
      sameBillAddressFlag: [false],
      // RfqId: 1001
    });
  }

  // Second item: Create a form with Ship to Address checkbox
  createShipToAddressForm(): FormGroup {
    return this.fb.group({
      // RFQBillShipAddressId: 2001,
      rfqAddressType: '2',
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      countryId: [0, Validators.required],
      stateId: [0, Validators.required],
      cityId: [0, Validators.required],
      postalCode: ['', Validators.required],
      sameBillAddressFlag: [false],
      // RfqId: 1001
    });
  }

  updateContactForm(data?: any): FormGroup {
    return this.fb.group({
      rfqBillShipAddressId: data?.rfqBillShipAddressId,
      rfqAddressType: '1',
      addressLine1: data?.addressLine1,
      addressLine2: data?.addressLine2,
      countryId: data?.countryId,
      stateId: data?.stateId,
      cityId: data?.cityId,
      postalCode: data?.postalCode,
      sameBillAddressFlag: data?.sameBillAddressFlag,
      rfqId: this.rfqId
    });
  }

  // Second item: Create a form with Ship to Address checkbox
  updateShipToAddressForm(data?: any): FormGroup {
    return this.fb.group({
      rfqBillShipAddressId: data?.rfqBillShipAddressId,
      rfqAddressType: '2',
      addressLine1: data?.addressLine1,
      addressLine2: data?.addressLine2,
      countryId: data?.countryId,
      stateId: data?.stateId,
      cityId: data?.cityId,
      postalCode: data?.postalCode,
      sameBillAddressFlag: data?.sameBillAddressFlag,
      rfqId: this.rfqId
    });
  }

  getCurrency(): void {
    this.loginservice.GetCurrencyDetails().subscribe(data => {
      if (data) {
        this.FinCurrencyList = data;
      }
    });
  }

  getCountry() {
    this.countryList = [];
    this.commonService.GetCountryDetails().subscribe((res) => {
      if (res) {
        this.countryList = res;
      }
    })
  }

  getState(index: number): void {
    const countryId = this.RFQBillShipAddressTrans.at(index).get('countryId')?.value;
    this.stateList[index] = []; // Reset state list for this address
    this.cityList[index] = []; // Reset city list for this address

    if (countryId) {
      this.loginservice.GetCountryBaseaState(countryId).subscribe((data) => {
        if (data) {
          this.stateList[index] = data; // Store state list per address
        }
      });
    }
  }


  // Get Cities based on selected state using index
  getCities(index: number): void {
    const stateId = this.RFQBillShipAddressTrans.at(index).get('stateId')?.value;
    this.cityList[index] = []; // Reset city list for this address

    if (stateId) {
      this.loginservice.GetStatebaseCity(stateId).subscribe((data) => {
        if (data) {
          this.cityList[index] = data; // Store city list per address
        }
      });
    }
  }

  get SourcingRFQ(): FormGroup {
    return this.rfqForm.get('SourcingRFQ') as FormGroup;
  }

  get RFQShippingInfoTrans(): FormGroup {
    return this.rfqForm.get('RFQShippingInfoTrans') as FormGroup;
  }

  get RFQBillShipAddressTrans(): FormArray {
    return this.rfqForm.get('RFQBillShipAddressTrans') as FormArray;
  }

  get rfqBillOfQuantityTrans(): FormArray {
    return this.rfqForm.get('rfqBillOfQuantityTrans') as FormArray;
  }

  get RFQAssignSuppliersTrans(): FormArray {
    return this.rfqForm.get('RFQAssignSuppliersTrans') as FormArray;
  }

  get RFQDocumentSectionTrans(): FormArray {
    return this.rfqForm.get('RFQDocumentSectionTrans') as FormArray;
  }

  get RFQSupplierDocumentSectionTrans(): FormArray {
    return this.rfqForm.get('RFQSupplierDocumentSectionTrans') as FormArray;
  }

  submit() {
    this.isSubmitted = true;
    if (this.rfqId) {
      const rfqForm = {
        userId: this.userData?.userId,
        ...this.rfqForm.value,

      }
      this.rfqService.saveRFQData(rfqForm).subscribe((res: any) => {
        if (res) {
          this.isSubmitted = false;
          this.adminService.showMessage('Data on the form has been updated successfully');
          // this.rfqForm.reset();
          // this.router.navigate([`/krya/rfq-list`], { skipLocationChange: true, replaceUrl: true });
        }
      })
    } else {
      const rfqForm = {
        userId: this.userData?.userId,
        ...this.rfqForm.value,
      }
      this.rfqService.saveRFQData(rfqForm).subscribe((res: any) => {
        if (res) {
          this.isSubmitted = false;
          this.adminService.showMessage('Data on the form has been saved successfully');
          // this.rfqForm.reset();
          // this.router.navigate([`/krya/rfq-list`], { skipLocationChange: true, replaceUrl: true })
        }
      })
    }
  }

  cancel() {
    // this.checkInvalidFields(this.rfqForm);
    this.router.navigate(['/krya/rfq-list'], { skipLocationChange: true, replaceUrl: true })
  }

  copyBillingToShipping(event: Event, index: number) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      const billingAddress = this.RFQBillShipAddressTrans.controls[0].value;

      // Check if shipping address already exists

      // Copy billing address values to shipping address (2nd entry in FormArray)
      this.RFQBillShipAddressTrans.controls[1].patchValue({
        addressLine1: billingAddress.addressLine1,
        addressLine2: billingAddress.addressLine2,
        countryId: billingAddress.countryId,
        stateId: billingAddress.stateId,
        cityId: billingAddress.cityId,
        postalCode: billingAddress.postalCode,
        rfqAddressType: '2' // Mark as Shipping Address
      });

      // Disable fields in Shipping Address to prevent manual changes
      // this.RFQBillShipAddressTrans.controls[1].disable();
      // this.RFQBillShipAddressTrans.controls[1].get('SameBillAddressFlag')?.enable(); // Keep checkbox enabled
      // } else {
      //   // Remove the shipping address if checkbox is unchecked
      //   if (this.RFQBillShipAddressTrans.length > 1) {
      //     // this.RFQBillShipAddressTrans.removeAt(1);
      //   }
    } else {
      this.RFQBillShipAddressTrans.controls[1].reset();
    }

    this.getState(index);
    this.getCities(index);

  }

  getHierarchy(entityID: any, entityLevelSection?: any) {
    if (entityID == 0) return;
    this.apiService
      .getData(`PurchaseRequisition/GetHierarchyLevelMas?entityId=${entityID?.entityId}`)
      .pipe(catchError((err) => of(this.mockHierarchy)))
      .subscribe((hierarchy) => {
        this.entityLevelsLov.hierarchy = this.mockHierarchy as [];
        if (entityLevelSection) {
          this.onLevelsChange(`${entityLevelSection.level1ID}`, 1);
          this.onLevelsChange(entityLevelSection.level2ID, 2);
          this.onLevelsChange(entityLevelSection.level2ID, 3);
        }
        // if(){
        //   this.onLevelsChange()
        // }
      });
  }

  onLevelsChange(value: string, level: number) {
    [1, 2, 3, 4].forEach((n) => {
      if (level < n)
        this.entityLevelsLov = { ...this.entityLevelsLov, [`level${n}`]: '' };
      else if (level == n)
        this.entityLevelsLov = {
          ...this.entityLevelsLov,
          [`level${level}`]: value,
        };
    });
  }

  onClick(selectName: any) {
   const entity = this.rfqForm.get('SourcingRFQ')?.value;
    if (!entity?.entityid) {
      this.adminService.showMessage(`Kindly select a ${selectName}`);
    } else if (!entity?.level1) {
      this.adminService.showMessage(`Kindly select a ${selectName}`);
    } else if (!entity?.level2) {
      this.adminService.showMessage(`Kindly select a ${selectName}`);
    } else if (!entity?.level3) {
      this.adminService.showMessage(`Kindly select a ${selectName}`);
    }
  }

  dropDownDatas() {

    this.rfqService.getAllSoucingData().subscribe(res => {

      this.entityData = res?.entityData;

      this.sourceData = res?.sourceData;

      this.inventoryItem = res?.inventoryItem;

      this.initialForm(res?.inventoryItem);
      // this.createRFQItem(this.inventoryItem);

      // const sectionQuestionsArray = this.rfqForm.get('rfqBillOfQuantityTrans') as FormArray;
      // res?.inventoryItem.forEach((item: any
      // ) => {
      //   sectionQuestionsArray.push(this.fb.group({
      //     // RFQBillOfQualityId: 3001,
      //     Code: [item?.partCode, Validators.required],
      //     itemType: [item?.itemType, Validators.required],
      //     Description: [item?.description, Validators.required],
      //     UOMId: [, Validators.required],
      //     Quantity: [, Validators.required],
      //     ShiptoSite: [, Validators.required],
      //     NeedByDate: [, Validators.required],
      //     // RfqId: 1001
      //   }));

      // })

      this.levelData = [
        {
          "id": 0,
          "name": "ERP System"
        },
        {
          "id": 1,
          "name": "Direct"
        },
        {
          "id": 2,
          "name": "Mat Request"
        },
        {
          "id": 3,
          "name": "Auto-Requisition"
        }
      ];

      this.levelData1 = [
        {
          "id": 0,
          "name": "ERP System"
        },
        {
          "id": 1,
          "name": "Direct"
        },
        {
          "id": 2,
          "name": "Mat Request"
        },
        {
          "id": 3,
          "name": "Auto-Requisition"
        }
      ];

      this.levelData2 = [
        {
          "id": 0,
          "name": "ERP System"
        },
        {
          "id": 1,
          "name": "Direct"
        },
        {
          "id": 2,
          "name": "Mat Request"
        },
        {
          "id": 3,
          "name": "Auto-Requisition"
        }
      ];

      this.levelData3 = [
        {
          "id": 0,
          "name": "ERP System"
        },
        {
          "id": 1,
          "name": "Direct"
        },
        {
          "id": 2,
          "name": "Mat Request"
        },
        {
          "id": 3,
          "name": "Auto-Requisition"
        }
      ]

      this.ratedType = [
        {
          "id": 1,
          "type": "Corporate"
        },
        {
          "id": 2,
          "type": "Spot"
        },
        {
          "id": 3,
          "type": "User-Defined"
        }
      ];

      this.sourcingTypes = [
        {
          "id": 1,
          "type": "In-Sourcing"
        },
        {
          "id": 2,
          "type": "Bought Out"
        },
        {
          "id": 3,
          "type": "Outsourced"
        }
      ]

      this.purchaseType = [
        {
          "id": 1,
          "type": "Local"
        },
        {
          "id": 2,
          "type": "In-Country"
        },
        {
          "id": 3,
          "type": "Imports"
        }
      ]

      this.participantTypes = [
        {
          "id": 1,
          "type": "Limited"
        },
        {
          "id": 2,
          "type": "Single Source"
        },
        {
          "id": 3,
          "type": "Public"
        }
      ]

      this.validatityValue = [
        {
          "id": 1,
          "hourse": "Days"
        },
        {
          "id": 2,
          "hourse": "Month"
        },
        {
          "id": 3,
          "hourse": "Years"
        }
      ]
    })

    this.spendCategory = [
      {
        "id": 1,
        "name": "CapEx Purchase"
      },
      {
        "id": 2,
        "name": "CapEx Purchase"
      }
    ]

    this.buyers = [
      {
        "id": 1,
        "name": "Buyer"
      },
      {
        "id": 2,
        "name": "PROC Officer"
      },
      {
        "id": 3,
        "name": "Co Ordinator"
      }
    ]

    this.shipMethod = [
      {
        "id": 1,
        "name": "By Air Freight Transportation"
      },
      {
        "id": 2,
        "name": "By Courier"
      },
      {
        "id": 3,
        "name": "By Intermodal Transportation"
      },
      {
        "id": 4,
        "name": "By Marine Transportation"
      },
      {
        "id": 5,
        "name": "By Rail Transportation"
      },
      {
        "id": 6,
        "name": "By Road Transportation"
      },
      {
        "id": 7,
        "name": "Pick up in Store"
      }
    ]

    this.shipTerm = [
      {
        "id": 1,
        "name": "CFR-Cost and Freight"
      },
      {
        "id": 2,
        "name": "CIF-Cost"
      },
      {
        "id": 3,
        "name": "Insurance and Freight"
      },
      {
        "id": 4,
        "name": "CIP-Carriage and Insurance Paid"
      },
      {
        "id": 5,
        "name": "CPT-Carriage Paid To"
      }, {
        "id": 6,
        "name": "DAP-Delivered at Place"
      },
      {
        "id": 7,
        "name": "DDP-Delivered Duty Paid"
      },
      {
        "id": 8,
        "name": "DPU-Delivered at Place Unloaded"
      },
      {
        "id": 9,
        "name": "EXW-Ex Works or Ex-Warehouse"
      },
      {
        "id": 10,
        "name": "FAS-Free Alongside Ship"
      },
      {
        "id": 11,
        "name": "FCA-Free Carrier"
      },
      {
        "id": 12,
        "name": "FOB-Free on Board"
      },
    ]

    this.activateRouter?.params?.subscribe((response) => {
      if (response?.id) {
        this.rfqService.getRFQ(response?.id).subscribe(res => {
          if(res){
          this.rfqId = response?.id;
          this.setRFQForm(res);
          this.getState(0);
          this.getCities(0);
          this.getState(1);
          this.getCities(1);
          }
        })
      }
    });

  }

  async onFileChange(event: any, index: number) {
    const files = event.target.files;

    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        let selectedFile = files[i];

        // Prevent duplicate file uploads in the same row
        if (this.listOfFiles[index]?.find((obj: { fileInfo: { name: any } }) => obj.fileInfo.name === selectedFile.name)) {
          this.adminService.showMessage('This File Already Exists.');
          event.target.value = null;
          return;
        }

        let fileDetail: any = {
          fileInfo: selectedFile,
          docId: 0,
        };

        const base64 = await this.convertToBase64(files[0]);

        // Initialize index-based file storage
        if (!this.listOfFiles[index]) {
          this.listOfFiles[index] = [];
        }
        this.listOfFiles[index].push(fileDetail);

        // Update the specific index inside the FormArray
        const docSection = this.RFQDocumentSectionTrans.controls[index];
        if (docSection) {
          docSection.patchValue({
            fileName: selectedFile.name,
            fileType: selectedFile.name.split('.').pop()?.toLowerCase() || 'Unknown',
            filebase64: base64,
            uploadedBy: 'Current User', // Replace with actual user info
            uploadedDate: new Date().toISOString().split('T')[0], // Format date as YYYY-MM-DD
          });
        }
      }

      // Prepare FormData for file upload
      // this.prepareFormData(index);

      this.saveCategoryAndScopeVm.isFileChanged = true;
      event.target.value = null;
      this.toggleAttach(index);
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Extract only Base64 data
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  toggleAttach(index: number) {
    this.attachToggle[index] = !this.attachToggle[index];
  }

  closeAttach(index: number) {
    this.attachToggle[index] = false;
  }

  // getSupplierDetails() {
  //   this.supplierAttact.getSupplierDetails(this.supplierId).subscribe(res => {
  //     if (res) {
  //       this.SupDetails = res;

  //     }
  //   })
  // }

  processWorkflow() {
    const closedialog = this.dialog.open(DialogInitiateApprovalComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        // supplierDet: this.SupDetails,
        rfqId: this.rfqId,
        ref: this.rfqForm?.get('SourcingRFQ.prRefCode')?.value,
        screenId: 5,

      },
      panelClass: 'popUpMiddle',
    });
    closedialog.afterClosed().subscribe(result => {
      // if (result === true) {
      //   let elmObj = {
      //     supId: this.supplierId,
      //     status: WorkFlowStatusConstants.WFINITIATED,
      //     userId: this.loggedUserDetails?.userId
      //   }
      //   this.wfService.updateApplicationStatus(elmObj).subscribe((res) => {
      //     if (res) {
      //       this.adminService.showMessage("Process workflow initiated")
      //       this.router.navigate(['/krya/dashboard'], { skipLocationChange: true,  replaceUrl: true });
      //     }
      //   }, err => {
      //     this.adminService.showMessage("Error while updating status")
      //     // this.getWFHistory();
      //     // this.checkWFLevelAvailable();
      //   })
      // }
    })
  }

  addValidationInco() {
    if (this.SourcingRFQ.get('incoOtherCost')?.value) {
      this.RFQShippingInfoTrans.get('shippingMethodId')?.addValidators(Validators.required);
      this.RFQShippingInfoTrans.get('shippingTermId')?.addValidators(Validators.required);
      this.RFQShippingInfoTrans.get('description')?.addValidators(Validators.required);
    } else {
      this.RFQShippingInfoTrans.get('shippingMethodId')?.clearValidators();
      this.RFQShippingInfoTrans.get('shippingTermId')?.clearValidators();
      this.RFQShippingInfoTrans.get('description')?.clearValidators();
    };

    this.RFQShippingInfoTrans.get('shippingMethodId')?.updateValueAndValidity();
    this.RFQShippingInfoTrans.get('shippingTermId')?.updateValueAndValidity();
    this.RFQShippingInfoTrans.get('description')?.updateValueAndValidity();

  }

  addValidationCurrency() {
    if (this.SourcingRFQ.get('forExCurrencyTxn')?.value) {
      this.SourcingRFQ.get('functionalCurrencyId')?.addValidators(Validators.required);
      this.SourcingRFQ.get('transactionalCurrencyId')?.addValidators(Validators.required);
      this.SourcingRFQ.get('spendCategoryId')?.addValidators(Validators.required);
    } else {
      this.SourcingRFQ.get('functionalCurrencyId')?.clearValidators();
      this.SourcingRFQ.get('transactionalCurrencyId')?.clearValidators();
      this.SourcingRFQ.get('spendCategoryId')?.clearValidators();
    };
  }

  addValidationShiptoSite() {
    if (this.SourcingRFQ.get('changeItemShiptoSite')?.value) {
      this.rfqBillOfQuantityTrans.get('shiptoSite')?.addValidators(Validators.required);
    } else {
      this.rfqBillOfQuantityTrans.get('shiptoSite')?.clearValidators();
    };
  }

  addValidationNeedbyDate() {
    if (this.SourcingRFQ.get('changeItemNeedbyDate')?.value) {
      this.rfqBillOfQuantityTrans.get('needByDate')?.addValidators(Validators.required);
    } else {
      this.rfqBillOfQuantityTrans.get('needByDate')?.clearValidators();
    };
  }

  addSupplierPopup() {
    const cancelDialogRef = this.dialog.open(AssignSupplierComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: true,
      width: '85%',
      height: '70%',
      position: {
        top: 'calc(5vw + 0px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
      data: {
        //  supplierId: this.userData?.supplierId
      }, 
    });    
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const AssignSuppliersTrans = this.rfqForm.get('RFQAssignSuppliersTrans') as FormArray;

        result?.forEach((assign: any) => {
          AssignSuppliersTrans.push(this.fb.group({
            supplierId: 2,
            supplierCode: assign?.supplierRefNo,
            supplierName: assign?.supplierName,
            gradeId: assign?.supplierGrade || 'A',
            statusId: 'Active'
            // StatusId: assign?.status
          }));
        })
      }
    })

  }

  mockHierarchy = [
    {
      hierarchyId: 5,
      entityId: 3,
      levelDefId: 1,
      levelDefName: 'Department',
      levelValueCode: '001',
      levelValueName: 'HR',
      department: null,
      section: null,
      project: null,
      active: false,
    },
    {
      hierarchyId: 8,
      entityId: 3,
      levelDefId: 1,
      levelDefName: 'Department',
      levelValueCode: '002',
      levelValueName: 'IT',
      department: null,
      section: null,
      project: null,
      active: false,
    },
    {
      hierarchyId: 7,
      entityId: 3,
      levelDefId: 2,
      levelDefName: 'Section',
      levelValueCode: '001',
      levelValueName: 'Recruiter',
      department: '001',
      section: null,
      project: null,
      active: false,
    },
    {
      hierarchyId: 10,
      entityId: 3,
      levelDefId: 2,
      levelDefName: 'Section',
      levelValueCode: '002',
      levelValueName: 'Software',
      department: '002',
      section: null,
      project: null,
      active: false,
    },

    {
      hierarchyId: 9,
      entityId: 3,
      levelDefId: 3,
      levelDefName: 'Project',
      levelValueCode: '001',
      levelValueName: 'AR Assistant',
      department: '001',
      section: '001',
      project: null,
      active: false,
    },
    {
      hierarchyId: 9,
      entityId: 3,
      levelDefId: 3,
      levelDefName: 'Project',
      levelValueCode: '004',
      levelValueName: 'AR Assistant Manger',
      department: '001',
      section: '001',
      project: null,
      active: false,
    },
    {
      hierarchyId: 20,
      entityId: 3,
      levelDefId: 3,
      levelDefName: 'Project',
      levelValueCode: '002',
      levelValueName: 'Architect',
      department: '002',
      section: '002',
      project: null,
      active: false,
    },
    {
      hierarchyId: 9,
      entityId: 3,
      levelDefId: 4,
      levelDefName: 'Role',
      levelValueCode: '001',
      levelValueName: 'Executive',
      department: '001',
      section: '001',
      project: '001',
      active: false,
    },
    {
      hierarchyId: 9,
      entityId: 3,
      levelDefId: 4,
      levelDefName: 'project',
      levelValueCode: '003',
      levelValueName: 'Executive SR',
      department: '001',
      section: '001',
      project: '004',
      active: false,
    },
    {
      hierarchyId: 20,
      entityId: 3,
      levelDefId: 4,
      levelDefName: 'Role',
      levelValueCode: '002',
      levelValueName: 'TL',
      department: '002',
      section: '002',
      project: '002',
      active: false,
    },
  ];

  // BOQ add items dialog box
  
  additemDialog() {  
    this.dialog.open(this.popupTemplate, {
        disableClose: true,
        hasBackdrop: true,
        backdropClass: '',
        autoFocus: true,
        width: '75%',
        height: '80%',
        position: {
          top: 'calc(3vw + 20px)',
          bottom: '',
          left: '',
          right: ''
        },
        panelClass: 'popUpMiddle',
      });
    } 
    
    
    columnDefss: ColDef[] = [
      {
        headerName: 'Serial #', maxWidth:100,
        valueGetter: (params: any) =>
          params.node ? params.node.rowIndex + 1 : null,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      { headerName: 'Item Code', field: 'itemcode', minWidth: 200, },
      { headerName: 'item Description', field: 'itemdesc', maxWidth: 350,},
      { headerName: 'item Type', field: 'itemtype',  minWidth: 120,},    
      { headerName: 'Status', field: 'status',  minWidth: 120, },
    ];
  
    addassignitem = [
      {
        supplierId: 1,
        itemcode: '52552 ',
        itemdesc: 'UNIMECH AEROSPACE Test',
        itemtype: 'Type Des', 
        status: 'Active', 
      } 
    ];
  
  

}
