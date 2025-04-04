import { Nullable } from "primeng/ts-helpers";


export class ParentCategoryVm {
    parentCategoryId: number;
    parentCatgeory: string;
}
export class SubCategoryVm {
    subCategoryId: number;
    subCatgeory: string;
    parentCategoryId: number; 
}
export class ChildCategoryVm {
    childCategoryId: number;
    childCatgeory: string;
    subCategoryId: number;
}
export class CategoryDocTypeMas {
    documentTypeId: number;
    documentType: string;
}


export class CategoryAndScopeVm {
    categoryScopeId: number;
    parentCategoryId: number;
    subCategoryId: Nullable<number>;
    childCategoryId: Nullable<number>;
    supplierId: number;
    typeId: number;
    description: string;
    fileNameId: string;
    parentCategory?: string;
    subCategory?: string;
    childCategory?: string;
    typeName?: string;
    categoryAndScopeDocs: any[] = [];
    isFileChanged: boolean = false;
    isChangedFlag: boolean = false;
    userId: number;
}