import { Component, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { SharedService } from '@app/core/services/shared/shared.service';
import { RFQService } from '@app/core/services/rfq/rfq.service';
import { CommonService } from '@app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { AdminService } from '@app/core/services/admin/admin.service';
import { SysParameterGeneralService } from '@app/core/services/sys-parameter-general.service';
import { MatBadgeModule } from '@angular/material/badge';
import { DocIconDirective } from '@app/core/directives/doc-icon.directive';
import { NumberToWordsPipe } from '@app/core/pipes/number-to-words.pipe';
import { Router } from '@angular/router';


@Component({
  selector: 'app-supplier-rfq-response',
  standalone: true,
  imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, MatInputModule, MatIconModule, 
    MatButtonModule, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule,
    MatFormField, MatCheckbox, MatLabel, MatSelect, MatOption, MatInput, MatDialogActions,
    MatButton, MatDatepickerModule, DatePipe,MatBadgeModule, MatIconModule,DocIconDirective,NumberToWordsPipe
  ],
  templateUrl: './supplier-rfq-response.component.html',
  styleUrl: './supplier-rfq-response.component.scss'
})
export class SupplierRfqResponseComponent {
  //Inject Services
  shared = inject(SharedService);
  componentService = inject(RFQService);
  commonService = inject(CommonService);
  alertService = inject(AdminService);
  sysParamsGeneral= inject(SysParameterGeneralService);

  supplierId = this.commonService.SupplierId;
  getDataFromRow: any;
  billAddressDetails: any;
  shipAddressDetails: any;
  functionalCurrency: string = "";

  rfqBillOfQuantityTransForm : FormGroup; 

  //LOV data
  discountMode = ["%", "Amount"];
  taxMode = ["%", "Amount"];
  showItemTax: boolean = false;
  showItemDiscount: boolean = false;
  documentSets: any = [];

  userDetails = JSON.parse(localStorage.getItem('loginDetails') || '{}');

  //Static LOV's shipping method
  shippingMethod = ["By Air Freight Transportation", "By Courier, By Intermodal Transportation", "By Marine Transportation", "By Rail Transportation", "By Road Transportation", "Pick up in"];
  //Static LOV's shipping Term
  shippingTerm = ["Shipping Term LOV: CFR-Cost and Freight", "CIF-Cost", "Insurance and Freight", "CIP-Carriage and Insurance Paid", "CPT-Carriage Paid To", "DAP-Delivered at Place", "DDP-Delivered Duty Paid"];

  constructor (private dialog:MatDialog, private fb : FormBuilder, private router : Router, private numbersToWordsTransform : NumberToWordsPipe){
  }
  @ViewChild('incoTerms') incoTerms: any;
  incoTermPopup() {
    this.dialog.open(this.incoTerms, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '80%',
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

  ngOnInit(){
    this.initForm();
    if (this.shared.getActionValue().componentName !== '') {
      this.getDataFromRow = this.shared.getActionValue()?.data;
      this.functionalCurrency = this.getDataFromRow?.sourcingRFQ?.functionalCurrencyId
      this.setAddressData(this.getDataFromRow);
      this.getSavedData();
    }
  }

  //Form Init
  initForm(data?:any){
    debugger
    this.rfqBillOfQuantityTransForm = this.fb.group({
      userId: this.userDetails?.userId,
      status: "Draft",
      sourcingSupplierRFQ:this.fb.group({
        supplierRfqId: 0,
        rfqId: data?.sourcingRFQ?.rfqId,
        refNo: data?.sourcingRFQ?.ref,
        createdDate: data?.sourcingRFQ?.createdDate,
        buyer: data?.sourcingRFQ?.buyer,
        buyerEmail: "jason@gamil.com",
        participantType: data?.sourcingRFQ?.participantType,
        shortName: data?.sourcingRFQ?.shortName,
        description: data?.sourcingRFQ?.description,
        responseRefNo: this.shared.getRefValue(),
        purchaseClassification: data?.sourcingRFQ?.purchaseClarification,
        spentType: data?.sourcingRFQ?.spendTypeName,
        rateType: data?.sourcingRFQ?.rateType,
        sourcingType: data?.sourcingRFQ?.sourcingTypeName,
        purchaseType: data?.sourcingRFQ?.purchaseTypeName,
        paymentTerms: "sample",
        publishDate: data?.sourcingRFQ?.publishDate,
        submissionDueDate: data?.sourcingRFQ?.submissionDueDate,
        responseOpenDate: data?.sourcingRFQ?.responseOpenDate,
        needByDate: data?.sourcingRFQ?.needByDate,
        "deliveryDate": data?.sourcingRFQ?.createdDate,
        expectedResponseValidity: data?.sourcingRFQ?.validityofResponseNegotiable ? "" : data?.sourcingRFQ?.expectedValidity,
        expectedResponseDuration: "",
        functionalCurrency: data?.sourcingRFQ?.functionalCurrencyId,
        transactionalCurrency: data?.sourcingRFQ?.transactionalCurrencyId,
        supplierRemarks:  "",
        entityName: data?.sourcingRFQ?.entityid,
        level1Name: data?.sourcingRFQ?.level1,
        level2Name: data?.sourcingRFQ?.level2,
        level3Name: data?.sourcingRFQ?.level3,
        level4Name: data?.sourcingRFQ?.level4,
        active: true,
        deleteFlag: false,
        interested: true,
        reason: "",
        regret: false,
        supplierId: this.supplierId
      }),
      supplierRFQBillOfQuantityTrans : this.fb.array([]),
      supplierRFQSupplierDocumentSectionTrans: this.fb.array([]),
      supplierRFQBillOfQuantityDetailTrans : this.fb.group({
        boqDetailTransId: new FormControl(0),
        totalItemsValue : new FormControl(0),
        discountType : new FormControl(""),
        discountTypeValue : new FormControl(0),
        discountValue : new FormControl(0),
        netValue : new FormControl(0),
        taxType: new FormControl(""),
        taxTypeValue: new FormControl(0),
        tax: new FormControl(0),
        incoTerms: new FormControl(0),
        totalAmount : new FormControl(0),
        totalAmountInWords: new FormControl(''),
        rfqId : data?.sourcingRFQ?.rfqId
      }),
      supplierRFQShippingInfoTrans: this.fb.group({
        shippingInfoId : 0,
        shippingMethodId: "",
        shippingTermId: "",
        description: "",
        negotiable : false 
      })
    })
  }

  // Set as form Array
  get supplierRFQBillOfQuantityTrans(): FormArray{
    return this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityTrans') as FormArray;
  }

  supplierRFQSupplierDocumentSectionTrans() {
    return this.rfqBillOfQuantityTransForm.get('supplierRFQSupplierDocumentSectionTrans') as FormArray;
  }

  pathDocumentValue(res:any){
   
    console.log(res, this.documentSets, 'changedgfpad');

    this.updateFormArray(
      this.rfqBillOfQuantityTransForm.get('supplierRFQSupplierDocumentSectionTrans') as FormArray,
      this.getDocumentGroup.bind(this),
      res || this.documentSets
    );
  }

  updateFormArray(
    fa: FormArray,
    functionGrp: any,
    data?: any
  ) {
    fa.clear();
    if (data && data.length > 0) {
      data.forEach((item: any) => {
        let fGrp = functionGrp(item);
        fa.push(fGrp);
      });
      fa.updateValueAndValidity();
    } else {
      fa.push(functionGrp());
    }
  }

  documentsLookUp: any = {};
  getDocumentGroup(item?: any) {
    let itemsarray = this.rfqBillOfQuantityTransForm.get('supplierRFQSupplierDocumentSectionTrans') as FormArray;
    let id = item?.supplierDocumentSectionId;
    this.documentSets.forEach;
    let docGrp = this.fb.group({
      supplierDocumentSectionId: [item?.supplierDocumentSectionId || 0],
      // fileType: [item?.fileType || ''],
      // documentNameID: [id || null],
      mandatory: [item?.mandatory],
      optional: [item?.optional],
      docName: [item?.docName || ''],
      docDescription: [item?.docDescription || ''],
      fileName: [item?.fileName || ''],
      uploadedBy: [item?.uploadedBy || ''],
      // uploadedByName: [{ value: '', disabled: true }],
      uploadedDate: [item?.uploadedDate || null],
      upload: [{ value: [], disabled: true }],
      // serialNo: [0],
      // delete: [{ value: item?.delete || false, disabled: true }],
    });
    docGrp.setValidators(this.fileUploadRequired);
    return docGrp;
  }

  fileUploadRequired(group: AbstractControl): ValidationErrors | null {
    const uploadFiles = group.get('upload')?.value;

    if (!uploadFiles || uploadFiles.length === 0) {
      return { fileRequired: true }; // Validation error
    }
    return null; // No error
  }

  //document section
  getUploadFiles = (doc: FormGroup) => doc.get('upload')?.value.length == 0;
  onUploadClick(event: any, docIndex: number, fg: any) {
    event.stopPropagation();
    let fileUploadInput = document.getElementById(
      'PRfileUpload'
    ) as HTMLInputElement;
    fileUploadInput.onchange = null; // Reset the onchange event
    fileUploadInput.onchange = (event) =>this.onFileUploadChange(fileUploadInput, docIndex, fg);
    fileUploadInput.click();
  }

  onFileUploadChange(fileInp: HTMLInputElement, docIndex: number, fg: any) {
    console.log('file upload', fileInp, this.documentSets[docIndex], 'changed');
    let tFiles = fg.get('upload')?.value || [];
    let existFiles = tFiles.map((file: any) => file.name);
    if (fileInp.files == null) return;
    for (let index = 0; index < fileInp.files.length; index++) {
      const file = fileInp.files[index];
      if (!existFiles.includes(file.name)) tFiles.push(file);
      else this.alertService.showMessage(`${file.name} File already exist`);
    }
    this.updateDocumentSection(tFiles, fg);
    fileInp.value = ''; // Clear the input files
  }

  setAddressData(value:any){
    if(value?.rfqBillShipAddressTrans?.length > 0){
      value?.rfqBillShipAddressTrans?.forEach((element:any) => {
        if(element?.rfqBillShipAddressId === 1){
          this.billAddressDetails = element;
        }
        if(element?.rfqBillShipAddressId === 2){
          this.shipAddressDetails = element;
        }
      });
    }
  }

  updateDocumentSection(tFiles: any, fg: any) {
    fg.get('upload')?.setValue(tFiles);
    let parsedFiles = this.filePropParsing(tFiles);
    // fg.get('fileType')?.setValue(parsedFiles.type);
    fg.get('fileName')?.setValue(parsedFiles.name);
    fg.get('uploadedBy')?.setValue(parsedFiles.uploadBy);
    // fg.get('uploadedByName')?.setValue(parsedFiles.uploadByName);
    fg.get('uploadedDate')?.setValue(parsedFiles.uploadedDate);
  }
  uploadedFilesOnChange(files: any, fg: any) {
    if(files?.length > 0)this.updateDocumentSection(files, fg);
  }
  filePropParsing(files: File[]) {
    let parsedFiles = {
      type: '',
      name: '',
      uploadBy: this.userDetails.userName,
      // uploadByName: this.userDetails.userName,
      uploadedDate: this.sysParamsGeneral.formatDate(new Date()),
    };
    files.forEach((file) => {
      parsedFiles.type += ` ${file.type} ,`;
      parsedFiles.name += ` ${file.name} ,`;
    });
    parsedFiles.type = parsedFiles.type.slice(0, -1);
    parsedFiles.name = parsedFiles.name.slice(0, -1);
    return parsedFiles;
  }

  SetForm(data:any) : FormGroup{
    return this.fb.group({
      rfqSupplierBillOfQuantityId: data?.rfqBillOfQualityId,
      code: data?.code,
      description: data?.description,
      uomId: data?.uomId,
      uomValue: data?.uomValue || "",
      quantity: data?.quantity,
      shiptoSiteId : data?.shiptoSiteId || 0,
      shiptoSiteValue: data?.shiptoSite,
      needByDate: data?.needByDate,
      rfqId: this.getDataFromRow?.sourcingRFQ?.rfqId,
      supplierId: this.supplierId,
      active: true,
      deleteFlag: false,
      created: new Date(),
      updated: new Date(),
      deliveryDate: data?.deliveryDate || new Date(),
      unitRate: data?.unitRate || 0,
      itemValue: data?.itemValue || 0,
      discountModeId: 0,
      taxModeId: 0,
      createdUserId: this.getDataFromRow?.userId
    })
  }

  //Get total and item value
  updateItemValue(i: number) {
    const itemsArray = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityTrans') as FormArray;
    const totalValue = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.totalItemsValue');

    //get group value
    const itemGroup = itemsArray.at(i) as FormGroup;

    const quantity = this.calculationItem(itemGroup.get('quantity')?.value) || 0;
    const unitRate = this.calculationItem(itemGroup.get('unitRate')?.value) || 0;

    //set item value
    const itemValue = quantity * unitRate;
    itemGroup.get('itemValue')?.setValue(itemValue, { emitEvent: false });

    let delay = setTimeout(() => {
      // Recalculate total amount
      let totalAmount = 0;
      itemsArray.controls.forEach((group: any) => {
        let value: string | number = group.get('itemValue')?.value || '0';

        totalAmount += this.calculationItem(value);
      });

      // Update 'totalAmount'
      totalValue?.setValue(totalAmount, { emitEvent: false });
      this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.netValue')?.setValue(totalAmount);
      this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.totalAmount')?.setValue(totalAmount);
      // console.log(delay)
      clearTimeout(delay);
    }, 100);
  }

  calculationItem(val:string | number){
    if(typeof val=='string'){
      return parseFloat(val.replace(/[^0-9.]/g, ''))
    }
    return val;
  }

  //Get discount value
  updateDiscountValue(i: number){
    const itemsArray = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityTrans') as FormArray;
    const totalDiscountValue = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.discountValue');

    //get group value
    const itemGroup = itemsArray.at(i) as FormGroup;

    const itemValue = this.calculationItem(itemGroup.get('itemValue')?.value) || 0;
    const itemDiscountMode = itemGroup.get('discountModeValue')?.value;
    const itemDiscountRate = this.calculationItem(itemGroup.get('discountRate')?.value);
    if(itemValue && itemDiscountMode){
      if(itemDiscountMode === 'Amount')itemGroup.get('discountValue')?.setValue(itemDiscountRate, { emitEvent: false });
      if(itemDiscountMode === '%'){
        const percentage = itemDiscountRate/100;
        itemGroup.get('discountValue')?.setValue((percentage*itemValue), { emitEvent: false });
      }

      let delay = setTimeout(() => {
        // Recalculate total amount
        let totalAmount = 0;
        itemsArray.controls.forEach((group: any) => {
          let value: string | number = group.get('discountValue')?.value || '0';
  
          totalAmount += this.calculationItem(value);
        });
  
        // Update 'totalDiscountAmount'
        totalDiscountValue?.setValue(totalAmount, { emitEvent: false });
        //Set Net value after discount
        this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.netValue')?.setValue(this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.totalItemsValue')?.value - this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.discountValue')?.value);
        this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.totalAmount')?.setValue(this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.totalItemsValue')?.value - this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.discountValue')?.value);
        clearTimeout(delay);
      }, 100);
    }else{
      if(!itemValue)this.alertService.showMessage("Item value is not applicable to calculate discount");
      if(!itemDiscountMode)this.alertService.showMessage("Discount mode is not applicable to calculate discount");
      itemGroup.get('discountRate')?.setValue((""), { emitEvent: false });
      return;
    }

  }

  //Get discount value
  updateTaxValue(i: number){
    const itemsArray = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityTrans') as FormArray;
    const totalTaxValue = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.tax');

    //get group value
    const itemGroup = itemsArray.at(i) as FormGroup;

    const itemValue = this.calculationItem(itemGroup.get('itemValue')?.value) || 0;
    const itemTaxMode = itemGroup.get('taxModeValue')?.value;
    const itemTaxRate = this.calculationItem(itemGroup.get('taxRate')?.value);
    if(itemValue && itemTaxMode){
      if(itemTaxMode === 'Amount')itemGroup.get('taxValue')?.setValue(itemTaxRate, { emitEvent: false });
      if(itemTaxMode === '%'){
        const percentage = itemTaxRate/100;
        itemGroup.get('taxValue')?.setValue((percentage*itemValue), { emitEvent: false });
      }

      let delay = setTimeout(() => {
        // Recalculate total amount
        let totalAmount = 0;
        itemsArray.controls.forEach((group: any) => {
          let value: string | number = group.get('taxValue')?.value || '0';
  
          totalAmount += this.calculationItem(value);
        });
  
        // Update 'totalTaxAmount'
        totalTaxValue?.setValue(totalAmount, { emitEvent: false });
        //Set totalAmount value after discount
        this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.totalAmount')?.setValue(this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.netValue')?.value + this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.tax')?.value)
        clearTimeout(delay);
      }, 100);
    }else{
      if(!itemValue)this.alertService.showMessage("Item value is not applicable to calculate tax");
      if(!itemTaxMode)this.alertService.showMessage("Discount mode is not applicable to calculate tax");
      itemGroup.get('taxRate')?.setValue((""), { emitEvent: false });
      return;
    }
  }

  //FIXME - Need to change common
  updateDiscountOrTaxValue(i:number, action:string){
    const itemsArray = this.rfqBillOfQuantityTransForm.get('rfqBillOfQuantityTrans') as FormArray;

    //get group value
    const itemGroup = itemsArray.at(i) as FormGroup;

  }

  saveBtn() {
    this.rfqBillOfQuantityTransForm.get('sourcingSupplierRFQ.responseRefNo')?.setValue(this.shared.getRefValue());
    this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.totalAmountInWords')?.setValue(this.numbersToWordsTransform.transform(this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans.totalAmount')?.value));
    console.log(this.rfqBillOfQuantityTransForm.getRawValue());
    const formData = new FormData();
    // formData.append("ResponseRFQ", JSON.stringify(this.rfqBillOfQuantityTransForm.getRawValue()));
    debugger
    this.rfqBillOfQuantityTransForm.getRawValue().supplierRFQSupplierDocumentSectionTrans.forEach((item:any) =>{
      item.upload = {};
    });
    formData.append("ResponseRFQ", JSON.stringify(this.rfqBillOfQuantityTransForm.getRawValue()));
    let docArray = this.supplierRFQSupplierDocumentSectionTrans() as FormArray;
    let prDocs = this.rfqBillOfQuantityTransForm.value.supplierRFQSupplierDocumentSectionTrans.map((doc: any, index: number) => {
      let docM = doc;
      delete docM.documentName;
      let docment = docArray.at(index);
      let files = docment.get('upload')?.value || [];
      if (files[0]) {
        formData.append('Files', files[0]);
      }
      delete docM.upload;
      return docM;
    });
    this.componentService.saveSupplierRFQData(formData).subscribe((res: any) => {
      this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans')?.patchValue({
        boqDetailTransId: res?.supplierRFQBillOfQuantityDetailTrans?.boqDetailTransId,
        totalItemsValue: res?.supplierRFQBillOfQuantityDetailTrans?.totalItemsValue,
        discountValue: res?.supplierRFQBillOfQuantityDetailTrans?.discountValue,
        netValue: res?.supplierRFQBillOfQuantityDetailTrans?.netValue,
        tax: res?.supplierRFQBillOfQuantityDetailTrans?.tax,
        incoTerms: res?.supplierRFQBillOfQuantityDetailTrans?.incoTerms,
        totalAmount: res?.supplierRFQBillOfQuantityDetailTrans?.totalAmount,
        totalAmountInWords: res?.supplierRFQBillOfQuantityDetailTrans?.totalAmountInWords,
        rfqId: res?.sourcingSupplierRFQ?.rfqId
      })
      if (this.getDataFromRow?.sourcingRFQ?.validityofResponseNegotiable) {
        this.rfqBillOfQuantityTransForm.get('sourcingSupplierRFQ')?.patchValue({
          expectedResponseValidity: res?.sourcingSupplierRFQ?.expectedResponseValidity,
          expectedResponseDuration: res?.sourcingSupplierRFQ?.expectedResponseDuration
        })
      }
      if (this.getDataFromRow?.sourcingRFQ?.forExCurrencyTxn) {
        this.rfqBillOfQuantityTransForm.get('sourcingSupplierRFQ.transactionalCurrency')?.setValue(res?.sourcingSupplierRFQ?.transactionalCurrency);
      }
      if (res?.sourcingSupplierRFQ?.supplierRemarks) {
        this.rfqBillOfQuantityTransForm.get('sourcingSupplierRFQ.supplierRemarks')?.setValue(res?.sourcingSupplierRFQ?.supplierRemarks);
      }
      // if(res?.supplierRFQShippingInfoTrans?.negotiable){
      this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingMethodId')?.setValue(res?.supplierRFQShippingInfoTrans?.shippingMethodId);
      this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingTermId')?.setValue(res?.supplierRFQShippingInfoTrans?.shippingTermId);
      this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.description')?.setValue(res?.supplierRFQShippingInfoTrans?.description);
      // }
      if (res?.supplierRFQBillOfQuantityTrans?.length > 0) {
        const getArray = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityTrans') as FormArray;
        getArray.clear();
        this.showItemDiscount = false;
        this.showItemTax = false;
        res?.supplierRFQBillOfQuantityTrans?.forEach((e: any) => {
          const objValue = this.SetForm(e);
          // If Discount flag is enabled
          if (this.getDataFromRow?.sourcingRFQ?.itemLevelDiscount) {
            this.showItemDiscount = true;
            objValue.addControl('discountModeValue', new FormControl(''));
            objValue.get('discountModeValue')?.setValue(e?.discountModeValue);
            objValue.addControl('discountRate', new FormControl(''));
            objValue.get('discountRate')?.setValue(e?.discountRate);
            objValue.addControl('discountValue', new FormControl(''));
            objValue.get('discountValue')?.setValue(e?.discountValue);
          }
          //If Tax flag is enabled
          if (this.getDataFromRow?.sourcingRFQ?.itemLevelTax) {
            this.showItemTax = true;
            objValue.addControl('taxModeValue', new FormControl(''));
            objValue.get('taxModeValue')?.setValue(e?.taxModeValue);
            objValue.addControl('taxRate', new FormControl(''));
            objValue.get('taxRate')?.setValue(e?.taxRate);
            objValue.addControl('taxValue', new FormControl(''));
            objValue.get('taxValue')?.setValue(e?.taxValue);
          }
          getArray.push(objValue)
        })
      }
      if (res?.supplierRFQSupplierDocumentSectionTrans?.length > 0) {
        this.pathDocumentValue(res?.supplierRFQSupplierDocumentSectionTrans);
      }
    })
  }

  getSavedData() {
    this.componentService.getSavedRFQResponse(this.supplierId, this.getDataFromRow?.sourcingRFQ?.rfqId).subscribe((res: any) => {
      if (res?.userId) {
        this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityDetailTrans')?.patchValue({
          boqDetailTransId: res?.supplierRFQBillOfQuantityDetailTrans?.boqDetailTransId,
          totalItemsValue: res?.supplierRFQBillOfQuantityDetailTrans?.totalItemsValue,
          discountValue: res?.supplierRFQBillOfQuantityDetailTrans?.discountValue,
          netValue: res?.supplierRFQBillOfQuantityDetailTrans?.netValue,
          tax: res?.supplierRFQBillOfQuantityDetailTrans?.tax,
          incoTerms: res?.supplierRFQBillOfQuantityDetailTrans?.incoTerms,
          totalAmount: res?.supplierRFQBillOfQuantityDetailTrans?.totalAmount,
          totalAmountInWords: res?.supplierRFQBillOfQuantityDetailTrans?.totalAmountInWords,
          rfqId: res?.sourcingSupplierRFQ?.rfqId
        })
        if (this.getDataFromRow?.sourcingRFQ?.validityofResponseNegotiable) {
          this.rfqBillOfQuantityTransForm.get('sourcingSupplierRFQ')?.patchValue({
            expectedResponseValidity: res?.sourcingSupplierRFQ?.expectedResponseValidity,
            expectedResponseDuration: res?.sourcingSupplierRFQ?.expectedResponseDuration
          })
        }
        this.rfqBillOfQuantityTransForm.get('sourcingSupplierRFQ')?.patchValue(res?.sourcingSupplierRFQ)
        if (this.getDataFromRow?.sourcingRFQ?.forExCurrencyTxn) {
          this.rfqBillOfQuantityTransForm.get('sourcingSupplierRFQ.transactionalCurrency')?.setValue(res?.sourcingSupplierRFQ?.transactionalCurrency);
        }
        if (res?.sourcingSupplierRFQ?.supplierRemarks) {
          this.rfqBillOfQuantityTransForm.get('sourcingSupplierRFQ.supplierRemarks')?.setValue(res?.sourcingSupplierRFQ?.supplierRemarks);
        }
        // if(res?.supplierRFQShippingInfoTrans?.negotiable){
        this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingMethodId')?.setValue(res?.supplierRFQShippingInfoTrans?.shippingMethodId);
        this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingTermId')?.setValue(res?.supplierRFQShippingInfoTrans?.shippingTermId);
        this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.description')?.setValue(res?.supplierRFQShippingInfoTrans?.description);
        // }
        if (res?.supplierRFQBillOfQuantityTrans?.length > 0) {
          const getArray = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityTrans') as FormArray;
          getArray.clear();
          this.showItemDiscount = false;
          this.showItemTax = false;
          res?.supplierRFQBillOfQuantityTrans?.forEach((e: any) => {
            const objValue = this.SetForm(e);
            // If Discount flag is enabled
            if (this.getDataFromRow?.sourcingRFQ?.itemLevelDiscount) {
              this.showItemDiscount = true;
              objValue.addControl('discountModeValue', new FormControl(''));
              objValue.get('discountModeValue')?.setValue(e?.discountModeValue);
              objValue.addControl('discountRate', new FormControl(''));
              objValue.get('discountRate')?.setValue(e?.discountRate);
              objValue.addControl('discountValue', new FormControl(''));
              objValue.get('discountValue')?.setValue(e?.discountValue);
            }
            //If Tax flag is enabled
            if (this.getDataFromRow?.sourcingRFQ?.itemLevelTax) {
              this.showItemTax = true;
              objValue.addControl('taxModeValue', new FormControl(''));
              objValue.get('taxModeValue')?.setValue(e?.taxModeValue);
              objValue.addControl('taxRate', new FormControl(''));
              objValue.get('taxRate')?.setValue(e?.taxRate);
              objValue.addControl('taxValue', new FormControl(''));
              objValue.get('taxValue')?.setValue(e?.taxValue);
            }
            getArray.push(objValue)
          })
        }
        if (res?.supplierRFQSupplierDocumentSectionTrans?.length > 0) {
          this.pathDocumentValue(res?.supplierRFQSupplierDocumentSectionTrans);
        }

        if(res?.status === 'Active'){
          this.rfqBillOfQuantityTransForm.disable();
        }
      } else {

        this.initForm(this.getDataFromRow);
        this.SetForm(this.getDataFromRow?.rfqBillOfQuantityTrans);
        if (this.getDataFromRow?.rfqBillOfQuantityTrans?.length > 0) {
          const getArray = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityTrans') as FormArray;
          getArray.clear();
          this.showItemDiscount = false;
          this.showItemTax = false;
          debugger
          this.getDataFromRow?.rfqBillOfQuantityTrans?.forEach((e: any) => {
            const objValue = this.SetForm(e);
            //If Discount flag is enabled
            if (this.getDataFromRow?.sourcingRFQ?.itemLevelDiscount) {
              this.showItemDiscount = true;
              objValue.addControl('discountModeValue', this.fb.control(''));
              objValue.addControl('discountRate', this.fb.control(''));
              objValue.addControl('discountValue', this.fb.control(''));
            }
            //If Tax flag is enabled
            if (this.getDataFromRow?.sourcingRFQ?.itemLevelTax) {
              this.showItemTax = true;
              objValue.addControl('taxModeValue', this.fb.control(''));
              objValue.addControl('taxRate', this.fb.control(''));
              objValue.addControl('taxValue', this.fb.control(''));
            }
            getArray.push(objValue)
          })
        }
        if (this.getDataFromRow?.rfqSupplierDocumentSectionTrans?.length > 0) {
          this.pathDocumentValue(this.getDataFromRow?.rfqSupplierDocumentSectionTrans);
        }
        if (this.getDataFromRow?.rfqShippingInfoTrans) {
          this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans')?.patchValue({
            shippingInfoId: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingInfoId')?.value,
            shippingMethodId: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingMethodId')?.value,
            shippingTermId: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingTermId')?.value,
            description: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.description')?.value,
            negotiable: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.negotiable')?.value
          })
        }


      }
    }, (error: any) => {
      this.initForm(this.getDataFromRow);
      this.SetForm(this.getDataFromRow?.rfqBillOfQuantityTrans);
      if (this.getDataFromRow?.rfqBillOfQuantityTrans?.length > 0) {
        const getArray = this.rfqBillOfQuantityTransForm.get('supplierRFQBillOfQuantityTrans') as FormArray;
        getArray.clear();
        this.showItemDiscount = false;
        this.showItemTax = false;
        this.getDataFromRow?.rfqBillOfQuantityTrans?.forEach((e: any) => {
          const objValue = this.SetForm(e);
          //If Discount flag is enabled
          if (this.getDataFromRow?.sourcingRFQ?.itemLevelDiscount) {
            this.showItemDiscount = true;
            objValue.addControl('discountModeValue', this.fb.control(''));
            objValue.addControl('discountRate', this.fb.control(''));
            objValue.addControl('discountValue', this.fb.control(''));
          }
          //If Tax flag is enabled
          if (this.getDataFromRow?.sourcingRFQ?.itemLevelTax) {
            this.showItemTax = true;
            objValue.addControl('taxModeValue', this.fb.control(''));
            objValue.addControl('taxRate', this.fb.control(''));
            objValue.addControl('taxValue', this.fb.control(''));
          }
          getArray.push(objValue)
        })
      }
      if (this.getDataFromRow?.rfqSupplierDocumentSectionTrans?.length > 0) {
        this.pathDocumentValue(this.getDataFromRow?.rfqSupplierDocumentSectionTrans);
      }
      if (this.getDataFromRow?.rfqShippingInfoTrans) {
        this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans')?.patchValue({
          shippingInfoId: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingInfoId')?.value,
          shippingMethodId: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingMethodId')?.value,
          shippingTermId: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.shippingTermId')?.value,
          description: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.description')?.value,
          negotiable: this.rfqBillOfQuantityTransForm.get('supplierRFQShippingInfoTrans.negotiable')?.value
        })
      }
    })
  }

  //Cancel 
  cancelBtn(){
    this.router.navigate(['/krya/rfq-list'], { skipLocationChange: true,  replaceUrl: true });
  }

  //Submit 
  submitBtn(){
    let reqObj = {
      resRefNo : this.shared.getRefValue(),
      status: "Active"
    }
    this.componentService.submitSupplierRFQ(reqObj).subscribe((res:any)=>{
      if(res){
        this.rfqBillOfQuantityTransForm.disable();
      }
    })

  }
}
