import { Nullable } from "primeng/ts-helpers";
import { ClauseClassificationMas } from "./contract-clause.model";


export class ContractTemplate {
    contractTemplateId: number = 0;
    templateId: string;
    shortName: string;
    description: string;
    createDate?: any;
    version: string;
    contractTypeId?: number;
    contractType: string;
    contractClassificationId?: number;
    contractClassification: string;
    amendDate?: any;
    htmlContent?: string;
    status: string;
    approvedDate: any;
    active: boolean;
    userId: number;
    disableEdit: boolean;
    isAssignCategory: boolean;
    isEntity: boolean;
}

export class ContractTypeMas {
    contractTypeId: number;
    contractName: string;
}

export class ClauseTemplateDropDownList {
    contractTypeData: ContractTypeMas[] = new Array<ContractTypeMas>();
    classificationData: ClauseClassificationMas[] = new Array<ClauseClassificationMas>();
}

export class templateWorkflowDto {
    templateId: number;
    workflowHistory: templateWorkflowDetailDto[] = new Array<templateWorkflowDetailDto>();
}

export class templateWorkflowDetailDto {
    workflowId: number;
    wfLevel: number;
    wfRole: number;
    participantType?: string;
    assignedUserId?: number;
    assignedUser?: string;
    assignedTo?: string;
    actionDate: any;
    actionTaken?: string;
    comments?: string;
    estimatedDateOfCompletion: any;
    templateId?: number;
    userId?: number;
    userType?: number;
    templateRefId?: string;
    createdUserId?: number; 
}

export class templateCategoryTransDto {
    templateCategoryId: number;
    templateId: number;
    parentCategoryId: number;
    subCategoryId: Nullable<number>;
    childCategoryId: Nullable<number>;
    createdUserId?: number; 
    parentCategory?: string;
    subCategory?: string;
    childCategory?: string;
}

export class TemplateEntityTransDto {
    templateEntityId: number;
    templateId: number;    
    entityId: number;   
    isChecked: boolean;
    createdUserId?: number; 
}

export class EntityDto {
    entityId: number;
    entityCode: string;
    entityName: string;    
    status?: string;
    reason?: string;
    description?: string;
    isChecked: boolean = false;
}