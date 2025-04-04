import { Component, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormsModule, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatIconButton, MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialRequisitionService } from '@app/core/services/material-req/material-requisition.service';
import { AdminService } from '@app/core/services/admin/admin.service';
import { CurrencyMaskDirective } from '@app/core/directives/format-currency.directive';
import { MatDatePickerFormatDirective } from '@app/core/directives/mat-date-picker-format.directive';
import { AllowNumberOnlyDirective } from '@app/core/directives/allowNumberOnly.directive';
import { SupplierUserFormService } from '@app/core/services/supplier-management/supplier.user.form.service';
import { SysParameterGeneralService, SystemGeneralSettings } from '@app/core/services/sys-parameter-general.service';
import { SharedService } from '@app/core/services/shared/shared.service';
import { Router, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { CommonService } from '@app/core/services/common.service';
import { MatBadgeModule } from '@angular/material/badge';
import { DocIconDirective } from '@app/core/directives/doc-icon.directive';
@Component({
  selector: 'app-add-material-request',
  standalone: true,
  imports: [MatTooltip, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatFormField, MatLabel, MatSelect, MatOption, MatInput,
    MatDatepickerModule, MatDatePickerFormatDirective, AllowNumberOnlyDirective,
    CurrencyMaskDirective, JsonPipe, MatBadgeModule, DocIconDirective],
  templateUrl: './add-material-request.component.html',
  styleUrl: './add-material-request.component.scss'
})
export class AddMaterialRequestComponent {

  //Inject Services
  componentService = inject(MaterialRequisitionService);
  alertService = inject(AdminService);
  supplierUserFormService = inject(SupplierUserFormService);
  shared = inject(SharedService);
  common = inject(CommonService);
  sysParamsGeneral = inject(SysParameterGeneralService);

  dropdownData: any;
  materialForm: FormGroup;

  loginData = JSON.parse(localStorage.getItem('loginDetails')!);
  userName: string = this.loginData.userName;
  fullName: string = (this.loginData?.firstName || "") + " " + (this.loginData?.lastName || "");
  userId: number = this.loginData.userId;
  systemParameter: SystemGeneralSettings;
  updateID: number = 0;
  showLevel1: any[] = [];
  showLevel2: any[] = [];
  showLevel3: any[] = [];
  showLevel4: any[] = [];
  documentSets: any = [];
  setLevel: any;

  constructor(public fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.updateID = 0;
    this.getDocumentList()
    this.getSystemParam();
    this.getDropdownData();
    // if (this.shared.getActionValue().componentName !== '') {
    //   this.initForm(this.shared.getActionValue()?.data)
    // } else {
    //   this.initForm();
    // }
  }

  //Get document list from admin set
  getDocumentList() {
    let element = {
      tId: 9,
      dId: 1
    }
    this.common.getDocumentList(element).subscribe((res) => {
      if (res?.length > 0) {
        this.documentSets = res;
        if (this.shared.getActionValue().componentName !== '') {
          this.initForm(this.shared.getActionValue()?.data)
        } else {
          this.initForm();
        }
      }
      else {
        if (this.shared.getActionValue().componentName !== '') {
          this.initForm(this.shared.getActionValue()?.data)
        } else {
          this.initForm();
        }
      }
    },error=>{
      if (this.shared.getActionValue().componentName !== '') {
        this.initForm(this.shared.getActionValue()?.data)
      } else {
        this.initForm();
      }
    })
  }

  //System parameter
  getSystemParam() {
    this.supplierUserFormService.GetSysParameterGeneral().subscribe((res) => {
      if (res) {
        this.systemParameter = res;
      }
    });
  }

  getDropdownData() {
    this.componentService.getDropdownDatas().subscribe((res: any) => {
      if (res) {
        this.dropdownData = res;
      }
    })
  }

  // Initiate Form
  initForm(data?: any) {
    this.materialForm = this.fb.group({
      materialRequisitionId: [this.updateID ? this.updateID : (data?.materialRequisitionId || 0)],
      entityId: new FormControl(data?.entityId || 0, Validators.required),
      // entityName: new FormControl("", Validators.required),
      entityLevel1: new FormControl(data?.entityLevel1 || ""),
      entityLevel2: new FormControl(data?.entityLevel2 || ""),
      entityLevel3: new FormControl(data?.entityLevel3 || ""),
      entityLevel4: new FormControl(data?.entityLevel4 || ""),
      sourceId: new FormControl(data?.sourceId || 0, Validators.required),
      // sourceName: new FormControl(data?.entityId, Validators.required),
      refNo: new FormControl({ value: data?.refNo || "", disabled: true }),
      createdDate: new FormControl({ value: new Date(), disabled: true }),
      indenter: new FormControl({ value: this.fullName, disabled: true }),
      shortName: new FormControl(data?.shortName || "", Validators.required),
      description: new FormControl(data?.description || "", Validators.required),
      fromDepartment: [data?.fromDepartment || ""],
      needByDate: new FormControl(data?.needByDate, Validators.required),
      budgetCheck: new FormControl({ value: "Pass", disabled: true }),
      itemsTotalValue: [data?.itemsTotalValue || ""],
      remarksToStoreKeeper: [data?.remarksToStoreKeeper || ""],
      remarksToSupplier: [data?.remarksToSupplier || ""],
      status: new FormControl(data?.status || "Draft"),
      approvedDate: [data?.approvedDate || null],
      createdUserId: [this.userId],
      matRequisitionItems: this.fb.array([]),
      matRequisitionDocs: this.fb.array([])
    })

    if (data?.matRequisitionItems?.length > 0) {
      const matRequisitionItemsArray = this.materialForm.get('matRequisitionItems') as FormArray;
      matRequisitionItemsArray.clear();
      data?.matRequisitionItems?.forEach((el: any) => {
        matRequisitionItemsArray.push(this.createInventoryItemFormGroup(el));
      })
    } else {
      this.addInventoryItem();
    }

    this.updateFormArray(
      this.materialForm.get('matRequisitionDocs') as FormArray,
      this.getDocumentGroup.bind(this),
      data?.matRequisitionDocs || this.documentSets
    );
  }

  // Set inventory Item as form Array
  get matRequisitionItems(): FormArray {
    return this.materialForm.get('matRequisitionItems') as FormArray;
  }

  // Add inventory item 
  addInventoryItem() {
    this.matRequisitionItems.markAllAsTouched();
    const inventoryFormGroup = this.fb.group({
      partCode: [""],
      description: [""],
      itemType: new FormControl({ value: "", disabled: true }),
      matReqItemSectionId: [0],
      materialRequisitionId: [this.updateID ? this.updateID : 0],
      inventoryItemHeaderId: [0],
      unitOfMeasure: new FormControl({ value: "", disabled: true }),
      spendCategory1: new FormControl({ value: "", disabled: true }),
      spendCategory2: new FormControl({ value: "", disabled: true }),
      spendCategory3: new FormControl({ value: "", disabled: true }),
      quantity: new FormControl(""),
      rate: new FormControl(""),
      value: new FormControl({ value: "", disabled: true }),
      createdUserId: new FormControl(this.userId)
    })

    if (this.matRequisitionItems.valid) {
      this.matRequisitionItems.push(inventoryFormGroup);
    }
  }

  //Set inventory item  from Get API
  createInventoryItemFormGroup(val: any): FormGroup {
    return this.fb.group({
      partCode: [val?.partCode || ""],
      description: [val?.description || ""],
      itemType: new FormControl({ value: val?.itemType || "", disabled: true }),
      matReqItemSectionId: [val?.matReqItemSectionId],
      materialRequisitionId: [val?.materialRequisitionId],
      inventoryItemHeaderId: [val?.inventoryItemHeaderId],
      unitOfMeasure: new FormControl({ value: val?.unitOfMeasure || "", disabled: true }),
      spendCategory1: new FormControl({ value: val?.spendCategory1 || "", disabled: true }),
      spendCategory2: new FormControl({ value: val?.spendCategory2 || "", disabled: true }),
      spendCategory3: new FormControl({ value: val?.spendCategory3 || "", disabled: true }),
      quantity: new FormControl(val?.quantity || ""),
      rate: new FormControl(val?.rate || ""),
      value: new FormControl({ value: val?.value || "", disabled: true }),
      createdUserId: new FormControl(this.userId)
    });
  }

  //Inventory selection partcode or description
  selectedInventory(mat: MatSelect, action: string, indexOfFormArray: number) {
    const arrayData = this.materialForm.get('matRequisitionItems') as FormArray;
    const matOption = mat.selected as MatOption;
    const e = this.dropdownData?.inventoryItem[matOption.id]
    if (action === 'partCode') arrayData.at(indexOfFormArray).get('description')?.setValue(e?.description);
    if (action === 'description') arrayData.at(indexOfFormArray).get('partCode')?.setValue(e?.partCode);
    arrayData.at(indexOfFormArray).patchValue({
      inventoryItemHeaderId: e?.itemInventoryId,
      itemType: e?.itemType || "",
      unitOfMeasure: e?.uomType || "",
      spendCategory1: e?.spendCategory1 || "",
      spendCategory2: e?.spendCategory2 || "",
      spendCategory3: e?.spendCategory3 || ""
    })
    arrayData.updateValueAndValidity();
  }

  //Documents array
  getDocumentsArray() {
    return this.materialForm.get('matRequisitionDocs') as FormArray;
  }

  // Entity method
  entityMethod(d: any) {
    this.setLevel = {};
    this.showLevel1 = [];
    this.showLevel2 = [];
    this.showLevel3 = [];
    this.showLevel4 = [];
    const parseValue = JSON.parse(d?.selected?.id);
    // this.materialForm.controls['entityName'].setValue(parseValue?.companyName);
    this.materialForm.controls['entityLevel1'].removeValidators(Validators.required);
    this.materialForm.controls['entityLevel2'].removeValidators(Validators.required);
    this.materialForm.controls['entityLevel3'].removeValidators(Validators.required);
    this.materialForm.controls['entityLevel4'].removeValidators(Validators.required);
    this.setLevel = parseValue;
    if (parseValue?.level1EntityData?.length > 0) {
      parseValue?.level1EntityData.forEach((x: any) => {
        x.levelId = x.levelHierarchyId;
        x.levelName = x.levelValueName + ' - ' + x.levelValueCode;
      });
      this.showLevel1 = parseValue?.level1EntityData;
      this.materialForm.controls['entityLevel1'].setValidators(Validators.required);
    }
    // if (parseValue?.level2EntityData?.length > 0) {
    //   parseValue?.level2EntityData.forEach((x: any) => {
    //     x.levelId = x.levelHierarchyId;
    //     x.levelName = x.levelValueName + ' - ' + x.levelValueCode;
    //   });
    //   this.showLevel2 = parseValue?.level2EntityData;
    //   this.materialForm.controls['entityLevel2'].setValidators(Validators.required);
    // }
    // if (parseValue?.level3EntityData?.length > 0) {
    //   parseValue?.level3EntityData.forEach((x: any) => {
    //     x.levelId = x.levelHierarchyId;
    //     x.levelName = x.levelValueName + ' - ' + x.levelValueCode;
    //   });
    //   this.showLevel3 = parseValue?.level3EntityData;
    //   this.materialForm.controls['entityLevel3'].setValidators(Validators.required);
    // }
    // if (parseValue?.level4EntityData?.length > 0) {
    //   parseValue?.level4EntityData.forEach((x: any) => {
    //     x.levelId = x.levelHierarchyId;
    //     x.levelName = x.levelValueName + ' - ' + x.levelValueCode;
    //   });
    //   this.showLevel4 = parseValue?.level4EntityData;
    //   this.materialForm.controls['entityLevel4'].setValidators(Validators.required);
    // }
    this.materialForm.controls['entityLevel1'].updateValueAndValidity();
    this.materialForm.controls['entityLevel2'].updateValueAndValidity();
    this.materialForm.controls['entityLevel3'].updateValueAndValidity();
    this.materialForm.controls['entityLevel4'].updateValueAndValidity();
  }

  //check and update level 2
  level2Check(data:any){
    if (this.setLevel?.level2EntityData?.length > 0) {
      this.setLevel?.level2EntityData.forEach((x: any) => {
        x.levelId = x.levelHierarchyId;
        x.levelName = x.levelValueName + ' - ' + x.levelValueCode;
      });
      this.showLevel2 = this.setLevel?.level2EntityData?.filter((v:any)=> v.levelValueFilter === data?.selected?.id);
      if(this.showLevel2?.length > 0)this.materialForm.controls['entityLevel2'].setValidators(Validators.required);
      this.materialForm.controls['entityLevel2'].updateValueAndValidity();
    }
  }
  //check and update level 3
  level3Check(data:any){
    if (this.setLevel?.level3EntityData?.length > 0) {
      this.setLevel?.level3EntityData.forEach((x: any) => {
        x.levelId = x.levelHierarchyId;
        x.levelName = x.levelValueName + ' - ' + x.levelValueCode;
      });
      this.showLevel3 = this.setLevel?.level3EntityData?.filter((v:any)=> v.levelValueFilter === data?.selected?.id);
      if(this.showLevel3?.length > 0)this.materialForm.controls['entityLevel3'].setValidators(Validators.required);
      this.materialForm.controls['entityLevel3'].updateValueAndValidity();
    }
  }
  //check and update level 4
  level4Check(data:any){
    if (this.setLevel?.level4EntityData?.length > 0) {
      this.setLevel?.level4EntityData.forEach((x: any) => {
        x.levelId = x.levelHierarchyId;
        x.levelName = x.levelValueName + ' - ' + x.levelValueCode;
      });
      this.showLevel4 = this.setLevel?.level4EntityData?.filter((v:any)=> v.levelValueFilter === data?.selected?.id);
      if(this.showLevel4?.length > 0)this.materialForm.controls['entityLevel4'].setValidators(Validators.required);
      this.materialForm.controls['entityLevel4'].updateValueAndValidity();
    }
  }

  // Source method
  sourceMethod(d: any) {
    this.materialForm.controls['sourceName'].setValue(d.selected.id);
  }

  // Remove material item
  // removeMatRequisitionItems(i:number){
  //   this.matRequisitionItems.removeAt(i);
  //   // Recalculate total amount
  //   const itemsArray = this.materialForm.get('matRequisitionItems') as FormArray;
  //   let totalAmount = 0;
  //   itemsArray.controls.forEach((group: any) => {
  //     totalAmount += group.get('value')?.value || 0;
  //   });
  // }

  // Calculate total value
  updateItemValue(i: number) {
    const itemsArray = this.materialForm.get('matRequisitionItems') as FormArray;
    const totalAmountControl = this.materialForm.get('itemsTotalValue');

    if (itemsArray && totalAmountControl) {

      const itemGroup = itemsArray.at(i) as FormGroup;

      const quantity = this.calculationItem(itemGroup.get('quantity')?.value) || 0;
      const rate = this.calculationItem(itemGroup.get('rate')?.value) || 0;

      const calculatedValue = quantity * rate;

      itemGroup.get('value')?.setValue(calculatedValue, { emitEvent: false });

      // Recalculate total amount
      let delay = setTimeout(() => {
        // Recalculate total amount
        let totalAmount = 0;
        itemsArray.controls.forEach((group: any) => {
          let value: string | number = group.get('value')?.value || '0';

          totalAmount += this.calculationItem(value);
        });

        // Update 'totalAmount'
        totalAmountControl.setValue(totalAmount, { emitEvent: false });
        clearTimeout(delay);
      }, 100);
    }
  }

  calculationItem(val: string | number) {
    if (typeof val == 'string') {
      return parseFloat(val.replace(/[^0-9.]/g, ''))
    }
    return val;
  }

  // Save Btn
  saveBtn() {
    if (this.materialForm.valid) {
      const itemsArray = this.materialForm.get('matRequisitionItems') as FormArray;
      itemsArray?.controls?.forEach(element => {
        element.get('quantity')?.setValue(element.get('quantity')?.value?.toString())
        element.get('rate')?.setValue(element.get('rate')?.value?.toString())
      });
      this.materialForm.get('itemsTotalValue')?.setValue(this.materialForm.get('itemsTotalValue')?.value?.toString());
      const formData = new FormData();
      let lstDocValues = this.materialForm.getRawValue();
      lstDocValues.matRequisitionDocs.forEach((item:any) =>{
          item.fileInfo = {};
      });
      formData.append("MaterialRequisition", JSON.stringify(lstDocValues));
      let docArray = this.getDocumentsArray() as FormArray;
      let prDocs = this.materialForm.value.matRequisitionDocs.map((doc: any, index: number) => {
        let docM = doc;
        delete docM.documentName;
        let docment = docArray.at(index);
        let files = docment.get('fileInfo')?.value || [];
        if (files[0]) {
          formData.append('Files', files[0]);
        }
        delete docM.fileInfo;
        return docM;
      });
      this.componentService.saveMaterialReq(formData).subscribe((res: any) => {
        if (res) {
          this.updateID = res;
          this.alertService.showMessage("successfully stored")
        }
      })
    } else {
      this.alertService.showMessage("Please fill all mandatory fields")
    }
  }

  //Cancel Btn
  cancelBtn() {
    this.router.navigate([`/krya/materialRequestList`], { skipLocationChange: true, replaceUrl: true })
  }

  //Destroy shared Data
  ngOnDestory() {
    let obj = {
      componentName: "",
      action: "",
      valObject: {}
    }
    this.shared.setActionValue(obj);
  }

  //document section
  getUploadFiles = (doc: FormGroup) => doc.get('fileInfo')?.value.length == 0;
  onUploadClick(event: any, docIndex: number, fg: any) {
    event.stopPropagation();
    let fileUploadInput = document.getElementById(
      'PRfileUpload'
    ) as HTMLInputElement;
    fileUploadInput.onchange = null; // Reset the onchange event
    fileUploadInput.onchange = (event) =>
      this.onFileUploadChange(fileUploadInput, docIndex, fg);
    // if (!fileUploadInput.onchange) {
    //     fileUploadInput.onchange = (event) => this.onFileUploadChange(fileUploadInput, docIndex, fg);
    // }
    fileUploadInput.click();
  }

  onFileUploadChange(fileInp: HTMLInputElement, docIndex: number, fg: any) {
    let tFiles = fg.get('fileInfo')?.value || [];
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
  minArrayLengthValidator(
    minLength: number = 1,
    isRequired = false
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        (isRequired && !control.value) ||
        !Array.isArray(control.value) ||
        !control.value.length
      ) {
        return { uploadFiles: 'Upload a mandatory Files' };
      }
      return null;
    };
  }
  updateDocumentSection(tFiles: any, fg: any) {
    fg.get('fileInfo')?.setValue(tFiles);
    let parsedFiles = this.filePropParsing(tFiles);
    fg.get('docType')?.setValue(parsedFiles.type);
    fg.get('fileName')?.setValue(parsedFiles.name);
    fg.get('uploadedBy')?.setValue(parsedFiles.uploadBy);
    fg.get('uploadedDate')?.setValue(parsedFiles.uploadedDate);
  }
  uploadedFilesOnChange(files: any, fg: any) {
    this.updateDocumentSection(files, fg);
  }
  filePropParsing(files: File[]) {
    let parsedFiles = {
      type: '',
      name: '',
      uploadBy: this.userId,
      uploadByName: this.fullName,
      uploadedDate: this.sysParamsGeneral.formatDate(new Date()),
    };
    files.forEach((file) => {
      parsedFiles.type += `${file.type},`;
      parsedFiles.name +=  `${file.name},`;
    });
    parsedFiles.type = parsedFiles.type.slice(0, -1);
    parsedFiles.name = parsedFiles.name.slice(0, -1);
    return parsedFiles;
  }

  mapFileToObject(file: File): {
    filename: string;
    docType: string;
    uploadedDate: string;
  } {
    return {
      filename: file.name,
      docType: file.type || 'Unknown',
      uploadedDate: new Date().toISOString(), // Saves timestamp in ISO format
    };
  }

  updateFormArray(
    fa: FormArray,
    functionGrp: any,
    data?: any,
    sectionName?: string
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
    let itemsarray = this.materialForm.get('matRequisitionDocs') as FormArray;
    let id = item?.documentID || item?.documentNameID;
    this.documentSets?.forEach;
    let docGrp = this.fb.group({
      fileInfo: [{ value: [], disabled: true }],
      matReqDocId: [item?.matReqDocId || 0],
      materialRequisitionId: [item?.materialRequisitionId || 0],
      docType: [{ value: item?.documentType || '', disabled: true }],
      description: [item?.description || ''],
      fileName: [item?.fileName || ''],
      filePath: [item?.filePath || 'path'],
      documentName: [item?.documentName],
      uploadedBy: [this.userId || 0],
      uploadedDate: [item?.uploadedDate || null],
      createdUserId: [this.userId],
      // delete: [{ value: item?.delete || false, disabled: true }],
    });
    docGrp.setValidators(this.fileUploadRequired);
    return docGrp;
  }

  fileUploadRequired(group: AbstractControl): ValidationErrors | null {
    const uploadFiles = group.get('fileInfo')?.value;

    if (!uploadFiles || uploadFiles.length === 0) {
      return { fileRequired: true }; // Validation error
    }
    return null; // No error
  }
}
