import { RelatedPartyDiscDto } from "./related-party-disc.model";

export class LicenseCertificationDto {
    licenseCertificationId: number = 0;
    categoryId: number;
    categoryName: string;
    licenseTypeId: number;
    licenseTypeName: string;
    licenseOrCertificateName: string;
    licenseOrCertificateAccreditationNumber: string;
    issueDate: any;
    expiryDate: any;
    issuingAuthority: string;
    issuingCountryId: number;
    issuingCountry: string;
    issuingStateId: number;
    issuingState: string;
    statusId: number;
    status: string;
    relatedActivity: string;
    remarks: string;
    uploadFile: string = 'attachment';
    fileNameId: string;
    supplierId: number;
    userId: number;
    fileInfo: any;
    relatedParty : RelatedPartyDiscDto = new RelatedPartyDiscDto();
    isChangedFlag: boolean = false;
  }
  
  export class LicenseCategoryMasDto {
    licenseCategoryId: number;
    categoryType: string;
  }
  export class LicenseTypeMasDto {
    licenseTypeId: number;
    licenseType: string;
  }
  export class LicenseStatusMasDto {
    licenseStatusId: number;
    status: string;
  }
  
  
  export class IssuingCountrylist {
    countryId: number;
    countryName: string;
  
  }
  
  export class IssuingState {
    stateId: number;
    stateName: string;
  }
  