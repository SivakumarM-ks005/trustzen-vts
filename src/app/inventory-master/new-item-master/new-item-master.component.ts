import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions, MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, forkJoin, Observable, of } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { NgClass } from '@angular/common';
import { InventoryService } from '@app/core/services/inventory/inventory.service';
import { AdminService } from '@app/core/services/admin/admin.service';
import { CommonService } from '@app/core/services/common.service';
import { WfRelatedService } from '@app/core/services/workflow/wf-related.service';
import { SharedService } from '@app/core/services/shared/shared.service';
import { AllowNumberOnlyDirective } from '@app/core/directives/allowNumberOnly.directive';
import { DialogInventoryAssignEntitiesComponent } from '../dialog-inventory-assign-entities/dialog-inventory-assign-entities.component';
@Component({
  selector: 'app-new-item-master',
  standalone: true,
  imports: [NgClass, MatCheckbox, MatTooltip, FormsModule,
    ReactiveFormsModule, MatFormField, MatLabel, MatSelect,
    MatOption, MatInput, MatAccordion, MatExpansionPanel,
    MatExpansionPanelHeader, MatExpansionPanelTitle,
    AllowNumberOnlyDirective],
  templateUrl: './new-item-master.component.html',
  styleUrl: './new-item-master.component.scss'
})
export class NewItemMasterComponent {
  isOpen: boolean = true;
  //Inject Services
  inventoryService = inject(InventoryService); // Inventory Service
  adminService = inject(AdminService); // Admin Service
  commonService = inject(CommonService); // Common service
  wfService = inject(WfRelatedService); // workflow related service
  shared = inject(SharedService);
  //Global Variables
  getItemCategoryList: any;
  getItemSubCategoryList: any;
  getItemStatusList: any;
  getItemTypeList: any;
  getCostingMethodTypeList: any;
  getUnitMeasureTypeList: any;
  getStoreLocationTypeList: any;
  getShelfFileTypeList: any;
  getShelfAiselBinTypeList: any;
  getZoneTypeList: any;
  getClimateStorageTypeList: any;
  getSecuredStorageTypeList: any;
  getAssignEntityList: any;
  getStoredEntityData: any;
  savedData: any;

  //Form group
  inventoryFrom !: FormGroup

  isAssignEntityBtnEnable: boolean = false; //disabled
  isActiveBtnEnable: boolean = false; //disabled
  isInActiveBtnEnable: boolean = false; //disabled
  isSubmitBtnEnable: boolean = false; //disabled
  isSaveBtnEnable: boolean = true; //enable

  supplierId: number = this.commonService.SupplierId;
  loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
  getItemDatas: any;
  getCodeDescList: any;
  getParentCategory: any;
  getSubCategoryList: any;
  getChildCategoryList: any;
  inventoryList: any;
  adminSettingsAttb: any = {};

  constructor(private router: Router, public fb: FormBuilder, public dialog: MatDialog) {}

  openAccordionAll() {
    this.isOpen = true;
  }
  closeAccordionAll() {
    this.isOpen = false;
  }

  ngOnInit() {
    this.getAdminAttributes();
    this.getInventoryList();
    this.getLOVMasterData();
    // Check action with edit value
    if (this.shared.getActionValue().componentName !== '') {
      this.initForm(this.shared.getActionValue()?.data);
      this.checkEditFunctionality(this.shared.getActionValue()?.data);
      this.getItemDatas = this.shared.getActionValue()?.data;
    } else {
      this.getItemDatas = {};
      this.initForm();
    }
  }

  // Get Admin inventory attributes
  getAdminAttributes(){
    this.inventoryService.getAdminAttributes().subscribe((res:any)=>{
      debugger
      this.adminSettingsAttb = res;
      if(this.adminSettingsAttb?.inventoryCost?.itemCompanyLevel === 1){
          this.inventoryFrom.get('inventryItemHeader')?.get('costingMethodId')?.setValue(this.adminSettingsAttb?.inventoryCost?.defaultCostMethodWeightageID);
          this.inventoryFrom.get('inventryItemHeader')?.get('costingMethodId')?.disable();
      }
    })
  }

  // Get Inventory List
  getInventoryList(){
    this.inventoryService.getAllInventoryList().subscribe((res:any)=>{
      if(res?.length > 0){
        this.inventoryList = res;
      }
    },error=>{
    })
  }

  // Form Initiation
  initForm(data?: any) {
    this.inventoryFrom = this.fb.group({
      userId: this.loggedUserDetails.userId,
      inventryItemHeader: this.fb.group({
        itemHeaderId: [data?.inventryItemHeader?.itemHeaderId || undefined],
        code: [data?.inventryItemHeader?.code, Validators.required, duplicateCodeCheck(this, "code")],
        shortName: [data?.inventryItemHeader?.shortName, Validators.required],
        description: [data?.inventryItemHeader?.description, Validators.required, duplicateCodeCheck(this, "description")],
        itemStatusId: [data?.inventryItemHeader?.itemStatusId || 0],
        itemStatus: [data?.inventryItemHeader?.itemStatus || null],
        hsnCode: [data?.inventryItemHeader?.hsnCode || ''],
        customCode: [data?.inventryItemHeader?.customCode || ''],
        itemCategoryId: [data?.inventryItemHeader?.itemCategoryId || 0],
        itemSubCategoryId: [data?.inventryItemHeader?.itemSubCategoryId || 0],
        itemTypeId: [data?.inventryItemHeader?.itemTypeId || 0],
        itemType: [data?.inventryItemHeader?.itemType || null],
        costingMethodId: [data?.inventryItemHeader?.costingMethodId || 0],
        costingMethod: [data?.inventryItemHeader?.costingMethod || null],
        active: [data?.inventryItemHeader?.active ? true : false],
        inventorySubmitStatus: [data?.inventryItemHeader?.inventorySubmitStatus || false],
        substituteCode: [data?.inventryItemHeader?.substituteCode || null],
        substituteDescription: [data?.inventryItemHeader?.substituteDescription || null],
        parentCategoryId: [data?.inventryItemHeader?.parentCategoryId || 0,Validators.required],
        subCategoryId: [data?.inventryItemHeader?.subCategoryId || 0,Validators.required],
        childCategoryId: [data?.inventryItemHeader?.childCategoryId || 0,Validators.required],
      }),
      inventryItemSpecification: this.fb.group({
        itemSpecificationId: [data?.inventryItemSpecification?.itemSpecificationId || undefined],
        detailSpecification: [data?.inventryItemSpecification?.detailSpecification || null],
        makeBrand: [data?.inventryItemSpecification?.makeBrand || null],
        grade: [data?.inventryItemSpecification?.grade || null]
      }),
      inventryItemUOM: this.fb.group({
        itemUOMId: [data?.inventryItemUOM?.itemUOMId || undefined],
        primaryUOMId: [data?.inventryItemUOM?.primaryUOMId, Validators.required],
        primaryUOMType: [data?.inventryItemUOM?.primaryUOMType],
        secondaryUOMId: [data?.inventryItemUOM?.secondaryUOMId || null],
        secondaryUOMType: [data?.inventryItemUOM?.secondaryUOMType || null]
      }),
      inventryItemStorageLocation: this.fb.group({
        itemStorageLocationId: [data?.inventryItemStorageLocation?.itemStorageLocationId || undefined],
        locationId: [data?.inventryItemStorageLocation?.locationId || null],
        locationType: [data?.inventryItemStorageLocation?.locationType || null],
        ShelfPeriod : [data?.inventryItemStorageLocation?.ShelfPeriod || null],
        shelfLife: [data?.inventryItemStorageLocation?.shelfLife || null],
        shelfLifeType: [data?.inventryItemStorageLocation?.shelfLifeType || null],
        shelf: [data?.inventryItemStorageLocation?.shelf || null],
        shelfType: [data?.inventryItemStorageLocation?.shelfType || null],
        zone: [data?.inventryItemStorageLocation?.zone || null],
        zoneType: [data?.inventryItemStorageLocation?.zoneType || null],
        aisle: [data?.inventryItemStorageLocation?.aisle || null],
        aisleType: [data?.inventryItemStorageLocation?.aisleType || null],
        binNumber: [data?.inventryItemStorageLocation?.binNumber || null],
        binNumberType: [data?.inventryItemStorageLocation?.binNumberType || null],
        climateStorageId: [data?.inventryItemStorageLocation?.climateStorageId || null],
        climateStorageType: [data?.inventryItemStorageLocation?.climateStorageType || null],
        securedStorageId: [data?.inventryItemStorageLocation?.securedStorageId || null],
        securedStorageType: [data?.inventryItemStorageLocation?.securedStorageType || null]
      }),
      inventryItemStockStatus: this.fb.group({
        itemStockStatusId: [data?.inventryItemStockStatus?.itemStockStatusId || undefined],
        currentFreeStock: [data?.inventryItemStockStatus?.currentFreeStock || null],
        reservedStock: [data?.inventryItemStockStatus?.reservedStock || null],
        safetyStockLevelUoM: [data?.inventryItemStockStatus?.safetyStockLevelUoM || null],
        safetyStockLevelQty: [data?.inventryItemStockStatus?.safetyStockLevelQty || 0],
        reOrderLevelUoM: [data?.inventryItemStockStatus?.reOrderLevelUoM || null],
        reOrderLevelQty: [data?.inventryItemStockStatus?.reOrderLevelQty || 0],
        economicOrderUoM: [data?.inventryItemStockStatus?.economicOrderUoM || null],
        economicOrderQty: [data?.inventryItemStockStatus?.economicOrderQty || 0],
        minOrderUoM: [data?.inventryItemStockStatus?.minOrderUoM || null],
        minOrderQty: [data?.inventryItemStockStatus?.minOrderQty || 0],
        maxOrderUoM: [data?.inventryItemStockStatus?.maxOrderUoM || null],
        maxOrderQty: [data?.inventryItemStockStatus?.maxOrderQty || 0],
        receiptsConsumed: [data?.inventryItemStockStatus?.receiptsConsumed || false]
      }),
      inventryItemAccountingDistribution: this.fb.array([]),
      // substituteItem: this.fb.array([]) //FIXME - Need to change key
    })
    this.setInventryItemAccountingDistribution(data?.inventryItemAccountingDistribution || []);
    // this.setSubstituteItem(data?.setSubstituteItem || [])
    if(data?.inventryItemHeader?.parentCategoryId)this.parentCategoryEvent({value:data?.inventryItemHeader?.parentCategoryId});
    if(data?.inventryItemHeader?.subCategoryId)this.subCategoryEvent({value:data?.inventryItemHeader?.subCategoryId});

    //Check Admin attribute for costing method
    if(this.adminSettingsAttb?.inventoryCost?.itemCompanyLevel === 1){
        this.inventoryFrom.get('inventryItemHeader')?.get('costingMethodId')?.setValue(this.adminSettingsAttb?.inventoryCost?.defaultCostMethodWeightageID);
    }
  }

  // Set Inventory Account Distibution Array in Forms
  get inventryItemAccountingDistribution(): FormArray {
    return this.inventoryFrom.get('inventryItemAccountingDistribution') as FormArray;
  }

  // Assign Inventory Account Distibution Array in Forms
  setInventryItemAccountingDistribution(accounts: any) {
    const accountsArray = this.inventoryFrom.get('inventryItemAccountingDistribution') as FormArray;
    let staticArray = ["Natural Account", "Sub Account", "Segment # 1", "Segment # 2", "Segment # 3", "Segment # 4"];
    if (accounts?.length > 0) {
      accounts.forEach((acc: any) => {
        accountsArray.push(this.fb.group({
          itemAccountingDistributionId: [acc?.itemAccountingDistributionId],
          account: [acc?.account],
          code: [acc?.code || ""],
          description: [acc?.description || ""]
        }))
      })
    } else {
      staticArray.forEach((acc: any) => {
        accountsArray.push(this.fb.group({
          account: [acc],
          code: [""],
          description: [""]
        }))
      })
    }
  }

  // Get all LOV Data's
  getLOVMasterData() {
    forkJoin({
      getItemCategoryList: this.inventoryService.getCategoryTypeList(),
      getItemStatusList: this.inventoryService.getItemStatusList(),
      getItemTypeList: this.inventoryService.getItemTypeList(),
      getCostingMethodTypeList: this.inventoryService.getCostingMethodTypeList(),
      getUnitMeasureTypeList: this.inventoryService.getUnitMeasureTypeList(),
      getStoreLocationTypeList: this.inventoryService.getStoreLocationTypeList(),
      getShelfFileTypeList: this.inventoryService.getShelfFileTypeList(),
      getShelfAiselBinTypeList: this.inventoryService.getShelfAiselBinTypeList(),
      getZoneTypeList: this.inventoryService.getZoneTypeList(),
      getClimateStorageTypeList: this.inventoryService.getClimateStorageTypeList(),
      getSecuredStorageTypeList: this.inventoryService.getSecuredStorageTypeList(),
      getCodeDescList: this.inventoryService.getCodeDescList(),
      getParentCategory: this.inventoryService.getParentCategoryList()
    }).subscribe((response: any) => {
      this.getItemCategoryList = response?.getItemCategoryList;
      this.getItemStatusList = response?.getItemStatusList;
      this.getItemTypeList = response?.getItemTypeList;
      this.getCostingMethodTypeList = response?.getCostingMethodTypeList;
      this.getUnitMeasureTypeList = response?.getUnitMeasureTypeList;
      this.getStoreLocationTypeList = response?.getStoreLocationTypeList;
      this.getShelfFileTypeList = response?.getShelfFileTypeList;
      this.getShelfAiselBinTypeList = response?.getShelfAiselBinTypeList;
      this.getZoneTypeList = response?.getZoneTypeList;
      this.getClimateStorageTypeList = response?.getClimateStorageTypeList;
      this.getSecuredStorageTypeList = response?.getSecuredStorageTypeList;
      this.getCodeDescList = response?.getCodeDescList;
      this.getParentCategory = response?.getParentCategory
    })
  }

  itemMaster() {
    // this.router.navigate([`/krya/materialReceipts`], { skipLocationChange: true, replaceUrl: true })
  }

  // Category selection
  categoryEvent(val: any) {
    this.inventoryService.getSubCategoryTypeList(val?.value).subscribe((res: any) => {
      this.getItemSubCategoryList = res;
    })
  }

  // Item status
  itemStatusEvent(d: any) {
    this.inventoryFrom.controls['inventryItemHeader'].patchValue({
      itemStatus: d.selected.id
    })
  }

  // Item Type
  itemTypeEvent(d: any) {
    this.inventoryFrom.controls['inventryItemHeader'].patchValue({
      itemType: d.selected.id
    })
  }

  // Costing method
  costingMethodEvent(d: any) {
    this.inventoryFrom.controls['inventryItemHeader'].patchValue({
      costingMethod: d.selected.id
    })
  }

  // Parent catgeory click
  parentCategoryEvent(d:any){
    this.inventoryService.getSubCategoryList(d.value).subscribe((res:any)=>{
      this.getSubCategoryList = res;
    })
  }

  // Sub category click
  subCategoryEvent(d:any){
    this.inventoryService.getChildCategoryList(d.value).subscribe((res:any)=>{
      this.getChildCategoryList = res;
    })
  }

  // Primary UOM
  primaryUOMEvent(d: any) {
    this.inventoryFrom.controls['inventryItemUOM'].patchValue({
      primaryUOMType: d.selected.id
    })
  }

  // Secondary UOM
  secondaryUOMEvent(d: any) {
    this.inventoryFrom.controls['inventryItemUOM'].patchValue({
      secondaryUOMType: d.selected.id
    })
  }

  // location
  locationTypeEvent(d: any) {
    this.inventoryFrom.controls['inventryItemStorageLocation'].patchValue({
      locationType: d.selected.id
    })
  }

  // shelf
  shelfTypeEvent(d: any) {
    this.inventoryFrom.controls['inventryItemStorageLocation'].patchValue({
      shelfType: d.selected.id
    })
  }

  // Aisle
  aisleTypeEvent(d: any) {
    this.inventoryFrom.controls['inventryItemStorageLocation'].patchValue({
      aisleType: d.selected.id
    })
  }

  // Climate storage
  climateStorageTypeEvent(d: any) {
    this.inventoryFrom.controls['inventryItemStorageLocation'].patchValue({
      climateStorageType: d.selected.id
    })
  }

  // Secured storage
  securedStorageTypeEvent(d: any) {
    this.inventoryFrom.controls['inventryItemStorageLocation'].patchValue({
      securedStorageType: d.selected.id
    })
  }

  // Shelf life
  shelfLifeTypeEvent(d: any) {
    this.inventoryFrom.controls['inventryItemStorageLocation'].patchValue({
      shelfLifeType: d.selected.id
    })
  }

  // Zone
  zoneTypeEvent(d: any) {
    this.inventoryFrom.controls['inventryItemStorageLocation'].patchValue({
      zoneType: d.selected.id
    })
  }

  // Bin
  binNumberTypeEvent(d: any) {
    this.inventoryFrom.controls['inventryItemStorageLocation'].patchValue({
      binNumberType: d.selected.id
    })
  }

  // Assign Enitity
  assignEntity() {
    let getItemId = this.inventoryFrom.get('inventryItemHeader')?.get('itemHeaderId')?.value ? this.inventoryFrom.get('inventryItemHeader')?.get('itemHeaderId')?.value : this.savedData?.inventryItemHeader?.itemHeaderId ? this.savedData?.inventryItemHeader?.itemHeaderId : 0;
    const closedialog = this.dialog.open(DialogInventoryAssignEntitiesComponent, {
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
      panelClass: 'popUpMiddle',
      data: {
        itemHeaderId: getItemId,
        storedEntitiyList: this.getStoredEntityData,
        entirydata: this.getAssignEntityList,
        inventoryData: this.shared.getActionValue().data ? this.shared.getActionValue().data : this.savedData ? this.savedData : "",
      },
    });
    closedialog.afterClosed().subscribe(result => {
      if (result === true) {
        if (getItemId) {
          this.getSavedAssignEntityList(getItemId);
        }
      }
    })
  }

  // Get Saved Assigned Entity List
  getSavedAssignEntityList(id?: any) {
    this.inventoryService.getStoredAssignEntity(id).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.getStoredEntityData = res[0]?.inventryAssignEntityResponseRes;
        if (this.getItemDatas?.inventryItemHeader?.inventorySubmitStatus || this.savedData?.inventryItemHeader?.inventorySubmitStatus) {
          this.isSubmitBtnEnable = false;
        } else {
          this.isSubmitBtnEnable = true;
        }
      }
    }, error => {

    })
  }

  // Get Assign entity list
  getAssignedEntityList() {
    this.wfService.getEntityList().subscribe((res) => {
      if (res && res.length > 0) {
        this.getAssignEntityList = res;
        if (this.getItemDatas?.inventryItemHeader?.active || this.savedData?.inventryItemHeader?.active) {
          this.isAssignEntityBtnEnable = true;
        } else {
          this.isAssignEntityBtnEnable = false;
        }
        if (this.getItemDatas?.inventryItemHeader?.inventorySubmitStatus || this.savedData?.inventryItemHeader?.inventorySubmitStatus) {
          this.isSubmitBtnEnable = false;
        }
      } else {
        this.isSubmitBtnEnable = true;
      }
    }, error => {
    })
  }

  //Save as draft
  saveAsDraft(action: string) {
    this.inventoryFrom.enable();
    if (this.inventoryFrom.valid) {
      //NOTE - Remove these key while first submit
      Object.keys(this.inventoryFrom.value?.inventryItemHeader).forEach((key) => (this.inventoryFrom.value?.inventryItemHeader[key] == undefined) && delete this.inventoryFrom.value?.inventryItemHeader[key]);
      Object.keys(this.inventoryFrom.value?.inventryItemSpecification).forEach((key) => (this.inventoryFrom.value?.inventryItemSpecification[key] == undefined) && delete this.inventoryFrom.value?.inventryItemSpecification[key]);
      Object.keys(this.inventoryFrom.value?.inventryItemUOM).forEach((key) => (this.inventoryFrom.value?.inventryItemUOM[key] == undefined) && delete this.inventoryFrom.value?.inventryItemUOM[key]);
      Object.keys(this.inventoryFrom.value?.inventryItemStorageLocation).forEach((key) => (this.inventoryFrom.value?.inventryItemStorageLocation[key] == undefined) && delete this.inventoryFrom.value?.inventryItemStorageLocation[key]);
      Object.keys(this.inventoryFrom.value?.inventryItemStockStatus).forEach((key) => (this.inventoryFrom.value?.inventryItemStockStatus[key] == undefined) && delete this.inventoryFrom.value?.inventryItemStockStatus[key]);
      console.log(this.inventoryFrom.value)
      if (action !== 'save') {
        this.inventoryFrom.get('inventryItemHeader')?.get('inventorySubmitStatus')?.setValue(true);
      }
      if (action === 'active') this.inventoryFrom.get('inventryItemHeader')?.get('active')?.setValue(true);
      if (action === 'inActive') this.inventoryFrom.get('inventryItemHeader')?.get('active')?.setValue(false);
      this.inventoryService.saveInventory(this.inventoryFrom.value).subscribe((res: any) => {
        if (res) {
          this.savedData = res;
          this.getItemDatas = {};
          this.initForm(this.savedData);
          this.checkEditFunctionality(this.savedData);
          this.adminService.showMessage("Successfully saved");
          if (action === 'save') {
            this.getAssignedEntityList();
            this.getSavedAssignEntityList(res?.inventryItemHeader?.itemHeaderId);
          }
        }
      }, error => {
        this.adminService.showMessage("Save is failed")
      })
    } else {
      this.adminService.showMessage("Please fill mandatory forms")
    }
  }

  // Cancel redirect
  cancel() {
    this.inventoryFrom.reset();
    this.router.navigate([`/krya/itemMasterList`], { skipLocationChange: true, replaceUrl: true })
  }

  //NOTE - Check edit functionality
  checkEditFunctionality(data: any) {
    this.getSavedAssignEntityList(data?.inventryItemHeader?.itemHeaderId);
    this.getAssignedEntityList();
    // this.isAssignEntityBtnEnable = true;
    if (data?.inventryItemHeader?.inventorySubmitStatus) {
      // this.inventoryFrom.enable();
      if (data?.inventryItemHeader?.active) {
        this.isActiveBtnEnable = false;
        this.isInActiveBtnEnable = true;
        // this.isAssignEntityBtnEnable = true;
        this.isSubmitBtnEnable = false;
        this.isSaveBtnEnable = false;
        this.inventoryFrom.disable();
      } else {
        this.inventoryFrom.disable();
        this.isInActiveBtnEnable = false;
        this.isActiveBtnEnable = true;
        // this.isAssignEntityBtnEnable = false;
        this.isSubmitBtnEnable = false;
        this.isSaveBtnEnable = false;
      }
    }
  }

  ngOnDestroy(){
    this.inventoryFrom.reset();
  }
}

//Code duplicate check form custom validator
export function duplicateCodeCheck(Inventory:any, field: string): ValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> =>{
    if(control.touched && field==='code' && control.value && Inventory?.inventoryList?.some((v:any)=>v?.inventryItemHeader?.code === control.value )){
      return of({ codeDuplicate : true })
    }
    if(control.touched && field === 'description'&& control.value && Inventory?.inventoryList?.some((v:any)=>v?.inventryItemHeader?.code === control.value )){
      return of({descriptionDuplicate : true})
    }
    return of(null);
  }
}