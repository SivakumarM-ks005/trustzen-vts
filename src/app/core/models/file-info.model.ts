export class FileInfoDto{
    name: string;
    size: any;
    filePath: string;
}

export class DocumentInfoDto{
    DocId: number;
    fileInfo: FileInfoDto = new FileInfoDto();
}