
export class ClauseLibrary {
  clauseLibraryId: number;
  refId: string;
  clauseName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  typeId: number;
  typeName: string;
  contractClassification: any[] = [];
  classificationStr: string;
  classificationShow: string;
  htmlContent: string;
  tagValue: string;
  createdDate: string;
  created: any;
  status: string;
  userId: number;
  active: boolean;
  deleteFlag : boolean;
}

export class ClauseCategoryMas {
    categoryId: number;
    categoryName: string;
  }
  
  export class ClauseTypeMas {
    typeId: number;
    typeName: string;
  }
  export class ClauseClassificationMas {
    classificationId: number;
    classificationName: string;
  }

export class ClauseLibraryDropDownList {
    categoryData: ClauseCategoryMas[] = new Array<ClauseCategoryMas>();
    typeData: ClauseTypeMas[] = new Array<ClauseTypeMas>();
    classificationData: ClauseClassificationMas[] = new Array<ClauseClassificationMas>();
}