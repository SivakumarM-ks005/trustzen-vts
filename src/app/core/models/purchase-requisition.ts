import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type PRItem = {
  prItemsSectionID?: number;
  serialNo?: number;
  codeID: number;
  typeID: number;
  descriptionID: number;
  uomId: number;
  quantity: number;
  rate: number;
  value: number;
  spendCategory1ID: number;
  spendCategory2ID: number;
  spendCategory3ID: number;
}

  export type PRAssignSupplier= {
    prAssignSupplierID?: number;
    supplierRefNo?: string | null;
    supplierCode?:string|null;
    supplierName: string;
    supplierGrade?: string;
    grade?:string;
    status: string | null;
    action?: string | null;
  }


  export type PRDocument ={
    serialNo?: number;
    prDocumentSectionID?:number;
    documentTypeID?: number | null;
    documentType?: string ;
    documentID:number;
    documentNameID?:number;
    documentName?:string;
    description?: string;
    fileName?: string;
    fileType?:string;
    filePath?:any;
    uploadedBy?: string | null;
    uploadedDate?: string | null;
    upload?:File[] |[]
    delete?:boolean |null
    [key : string]: string | number | boolean | null | undefined|any[]; 
  }
 

  export type EntitySection = {
    entityName: FormControl<string | null>;
    level1: FormControl<string | null>;
    level2: FormControl<string | null>;
    level3: FormControl<string | null>;
    level4: FormControl<string | null>;
  }
  
  export type PurchaseRequisition= {
    sourceID: FormControl<string | null>;
    refNo: FormControl<string | null>;
    createdDate: FormControl<string | null>;
    indentor: FormControl<string | null>;
    assignedBuyerID: FormControl<string | null>;
    shortName: FormControl<string | null>;
    description: FormControl<string | null>;
    fromDepartment: FormControl<string | null>;
    needByDate: FormControl<Date | null>;
    budgetCheckID: FormControl<string | null>;
    currencyID: FormControl<string | null>;
    toleranceValue: FormControl<number | null>;
    purchaseClassificationID: FormControl<string | null>;
    spendTypeID: FormControl<string | null>;
    allowPartialResponse: FormControl<boolean | null>;
    SubstituteItems: FormControl<boolean | null>;
    PRApprovedValue: FormControl<any>;
  }
  
 export type ItemsSection ={
    items: FormArray<FormGroup>;
    totalAmount: FormControl<number | null>;
  }
  
 export type PRForm ={
    entity_section: FormGroup<EntitySection>;
    purchaseRequisition: FormGroup<PurchaseRequisition>;
    itemsSection: FormGroup<ItemsSection>;
    assignSuplliers: FormArray<FormGroup>;
    remarksToBuyer: FormControl<string | null>;
    remarksToSupplier: FormControl<string | null>;
    documentSection: FormArray<FormGroup>;
  }

  export type ItemInventoryDto= {
    itemInventoryId: number;
    partCode: string;
    description: string;
    itemType: string;
    uomType: string;
    spendCategory1?: string | null;
    spendCategory2?: string | null;
    spendCategory3?: string | null;
  }

  // Define the structure for level entity data
export type LevelEntityData = {
  levelHierarchyId: number;
  entityId: number;
  levelDefId: number;
  levelValueCode: string;
  levelValueName: string;
  levelValueFilter: string | null;
};

// Define the main entity structure using type alias
 export type  Entity = {
  entityId: number;
  entityCode: string;
  companyName: string;
  level1LabelName: string | null;
  level1EntityData: LevelEntityData[];
  level2LabelName: string | null;
  level2EntityData: LevelEntityData[];
  level3LabelName: string | null;
  level3EntityData: LevelEntityData[];
  level4LabelName: string | null;
  level4EntityData: LevelEntityData[];
};
