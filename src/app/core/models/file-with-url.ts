// import { parse } from "url";

export class ExtendedFile extends File {
    url: string;

    constructor(fileBits: BlobPart[], fileName: string, options: FilePropertyBag, url: string) {
        super(fileBits, fileName, options);
        this.url = url;
    }
}

export function parseUrlToFile(urlPath: string): ExtendedFile {
    // Parse the URL
    const parsedUrl = new URL(urlPath);
    
    // Extract the type and name from the URL
    const urlType = parsedUrl.protocol ? parsedUrl.protocol.replace(':', '') : '';
    const urlName = parsedUrl.pathname ? parsedUrl.pathname.split('/').pop() || '' : '';

    return new ExtendedFile([],urlName,{type:urlType},urlPath) ;
}