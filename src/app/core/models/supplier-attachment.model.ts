export class MandatoryAttachmentTypeMas {
  attachmentTypeId: number;
  attachmentType: string;
}

export class OptionalAttachmentTypeMas {
  attachmentTypeId: number;
  attachmentType: string;
}
export class AttachmentTypes {
  mandatoryAttachmentTypes: MandatoryAttachmentTypeMas[] = new Array<MandatoryAttachmentTypeMas>();
  optionalAttachmentTypes: OptionalAttachmentTypeMas[] = new Array<OptionalAttachmentTypeMas>();
}
export class SaveAttachmentVm {
  mandatoryAttachmentId: number = 0;
  optAttachmentId: number = 0;
  attachmentTypeId: number;
  description: string;
  attachment: string = 'attachment';
  uploadedUserName: string;
  uploadedDate: any;
  supplierId: number;
  userId: number;
  controlValidate: string;
  attachmentType: string;
  fileNameId: string;
  fileInfo: any[] = [];
}

export class SaveManAndOptAttachmentVm {
  manAttachFlag: boolean;
  optionalAttachFlag: boolean;
  saveMandatoryDto: SaveAttachmentVm[] = new Array<SaveAttachmentVm>();
  saveOptionalDto: SaveAttachmentVm;
}

export class ManAndOptionalDto {
  optionalAttachFlag: boolean;
  mandatoryAttachment: AttachmentDto;
  optionalAttachment: AttachmentDto;
}

export class AttachmentDto {
  mandatoryAttachmentId: number = 0;
  optAttachmentId: number = 0;
  attachmentTypeId: number;
  attachmentType: string;
  description: string;
  uploadedBy: number;
  uploadedDate: any;
  supplierId: number;
  uploadedUserName: string;
  fileInfo: any[] = [];
}

export class MandatoryAttachTypeMas {
  id: number;
  name: string;
}