import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
// import { environment } from "../../environments/environment";
import { saveAs } from 'file-saver';
import { ConfirmationDialogComponent } from "../../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { FormArray, FormGroup, NgForm } from "@angular/forms";
import { environment } from "../../../environments/environment";
import { ApprovalWorkFlow, SaveWorkFlow } from "../models/workflow.model";

@Injectable({
  providedIn: 'root', // This registers the service with the root injector
})
export class CommonService {

  supplierUserType: number = 2;
  adminUserType: number = 1;
  userName!: string;
  isfromDashboard: boolean = false;

  SupplierId!: number;
  UserId!: Number;
  isFromWorkFlow: boolean = false;
  wfPrimaryKeyId: number = 0;
  wfSavedId: number = 0;
  userComment: any = null;
  //API_URL: string;
  //private readonly API_URL = environment.apiUrl;
  //API_URL = this.getConfig('apiUrl');
  //apiUrl = this.getConfig('apiUrl');
  SUPAPI_URL: 'https://test-suppreg-api.procurezen.ai/api/supplier/';
  config: any;
  private readonly units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  hindDateFormat: string = '';//'DD-MM-YYYY';
  showFormat: string = 'dd-MM-yyyy';

  dataLostModalConfig = {
    disableClose: false,
    hasBackdrop: true,
    autoFocus: true,
    width: '25%',
    height: '40%',
    position: {
      top: 'calc(10vw + 20px)',
    },
    data: {
      flag: true,
    },
  }
  deletetModalConfig = {

    disableClose: false,
    hasBackdrop: true,
    autoFocus: true,
    width: '35%',
    height: '40%',
    position: {
      top: 'calc(10vw + 20px)',
    },
    panelClass: 'confirmdialog',
    data: {
      deleteFlag: true,
    },
  }
  apiUrl: string;
  APIADMIN_URL: string;
  apitest: string;
  constructor(private http: HttpClient,
    private dialog: MatDialog,) {
    this.apiUrl = environment.apiUrl
    this.APIADMIN_URL = environment.apiadminUrl;
    this.apitest = environment.apitest;
  }

  public getUser(): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierRegister/Getuser`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  public GetSuppliers(): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierRegister/GetSuppliers`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));
  }

  public GetSuppliersDirectory(): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/GetSupplierDirectoryDetails`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));
  }

  public GetUnitofMeasure(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetUnitOfMeasureTypeList`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));
  }

  public GetSearchTaxPlayer(supplier: any): Observable<any> {
    const dataUrl = `${this.apiUrl}Inventry/search-GST/${supplier?.gst}/Email/${supplier?.email}`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));
  }

  getSyatemParameter(): Observable<any> {
    const dataUrl = `${this.APIADMIN_URL}ImplementationConfig/GetSysParameterGeneral`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));
  }

  public getSupplierClassification(): Observable<any> {
    const dataUrl = `${this.apitest}Master/GetSupplierClassification`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  public getSalutation(): Observable<any> {
    const dataUrl = `${this.apitest}Master/GetSalutationDetails`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  public getRole(): Observable<any> {
    const dataUrl = `${this.apitest}Master/GetRoleDetails`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  public getUserRole(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetUserTypeDetails`;
    return this.http.get(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  public GetCountryDetails(): Observable<any> {
    const dataUrl = `${this.apitest}Master/GetCountryList`;
    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  public GetStateDetails(): Observable<any> {
    const dataUrl = `${this.apitest}Master/GetStateList`;
    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  public GetCityDetails(): Observable<any> {
    const dataUrl = `${this.apitest}Master/GetCityList`;
    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  public getAddressType(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetAddressTypeDetails`;
    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  public getTaxType(): Observable<any> {
    const dataUrl = `${this.apiUrl}Master/GetTaxTypeDetails`;
    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

  showTopCenter(level: string, info: string, message: string) {
    //  this.messageService.add({ severity: level, summary: info, detail: message });
  }

  public GetpqquetionariesCheckListData(): Observable<any> {
    // SupplierQuestionnaire/GetAll
    // let API_URL = environment.AdminAPI_URL
    const dataUrl = `${this.apiUrl}Questionnaire/Template/All`;
    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  public GetpqquetionariesSupplier(id: any): Observable<any> {
    // SupplierQuestionnaire/GetAll
    // let API_URL = environment.apiUrl
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/${id}`;
    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  savePQquestionnaries(element: any): Observable<any> {
    // let API_URL = environment.apiUrl;
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/Response/Save`;
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  updatePQquestionnaries(element: any): Observable<any> {
    // let API_URL = environment.apiUrl;
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/Response/Update`;
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  saveSupplierInformation(element: any): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierRegister/SaveSupplierInformation`;
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  saveNotifySupplier(element: any): Observable<any> {
    const dataUrl = `${this.apiUrl}Email/NotifySupplier`;
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  public getSupplier(supplierId: number): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierRegister/GetSupplierUserDetails?supplierid=${supplierId}`;
    return this.http.get(dataUrl).pipe(
      catchError(this.handleError)
    );
  }
  public getSupplierTypes(): Observable<SupplierType[]> {
    const dataUrl = `${this.apiUrl}Master/GetSupplierTypeDetails`;
    return this.http.get<SupplierType[]>(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  public getSupplierRole(): Observable<SupplierRole[]> {
    const dataUrl = `${this.apiUrl}Master/GetRoleDetails`;
    return this.http.get<SupplierRole[]>(dataUrl)
      .pipe(catchError(this.handleError));;
  }

  public getOwnershipTypes(): Observable<OwnershipType[]> {
    const dataUrl = `${this.apiUrl}Master/GetTypeOfOwnershipDetails`;
    return this.http.get<OwnershipType[]>(dataUrl);
  }

  public getpqQuestionnariesList(): Observable<OwnershipType[]> {
    const dataUrl = `${this.APIADMIN_URL}Questionnaire/template-supplier-details?supplierClassification=${localStorage.getItem('supplierClassification')}&country=${localStorage.getItem('country')}`;
    return this.http.get<OwnershipType[]>(dataUrl);
  }

  public getMapErp(id: any): Observable<[]> {
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/GetSupplierPQAssessmentMapERP/${id}`;
    return this.http.get<[]>(dataUrl);
  }

  saveMapErp(element: any): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/SaveSupplierPQAssessmentMapERP/${element}`;
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  updateMapErp(element: any): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/UpdateSupplierPQAssessmentMAPERP/${element?.userId}`;
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  load(): Promise<any> {
    let promise = this.http.get(`./assets/config.json`).toPromise();
    promise.then(site => this.config = site);
    return promise;
  }

  getConfig(key: any): string {
    // return this.config[key];
    return environment.apiUrl;
  }
  getWorkflowList(userId: number) {
    const dataUrl = `${this.apiUrl}Common/GetApprovalWorkFlowList`;
    let params = new HttpParams({
      fromObject: {
        'userId': `${userId}`
      }
    });
    return this.http.get<ApprovalWorkFlow[]>(dataUrl, { params: params });
  }

  getNextTranSeq(transType: string, nextSeq: number) {
    const dataUrl = `${this.apiUrl}Common/GetNextTxnSequenceValue`;
    let params = new HttpParams({
      fromObject: {
        'transType': `${transType}`,
        'nextSeq': `${nextSeq}`
      }
    });
    return this.http.get<any>(dataUrl, { params: params });
  }

  updateWorkFlowStatus(wfData: SaveWorkFlow) {
    let dataURL = `${this.apiUrl}Common/UpdateWorkFlowStatus`;
    return this.http.post(dataURL, wfData);
  }

  getAttachment(filePath: string): Observable<any> {
    let dataUrl = `${this.apiUrl}Common/DownloadAttachment`;
    let params = new HttpParams({
      fromObject: {
        'filePath': `${filePath}`
      }
    });
    return this.http.get(dataUrl, { params, responseType: 'blob', observe: 'response' });
  }
  downloadOrOpenFile(path: string, filaeName: string = '', downloadFile: boolean = false) {
    this.getAttachment(path)
      .subscribe(res => {
        if (res != null) {
          if (downloadFile) {
            // code for download and it's shows download list
            const blob = new Blob([res.body], { type: res.body.type });
            saveAs(blob, filaeName);
          } else {
            // code to open new window
            let fileURL = URL.createObjectURL(res.body);
            window.open(fileURL);
          }
        } else {
          alert('File Not Found');
        }
      });
  }
  // transform(bytes: number = 0, precision: number = 2) {
  //   if (!isFinite(bytes)) {
  //     return '?';
  //   }
  //   let unitIndex = 0;
  //   while (bytes >= 1024) {
  //     bytes /= 1024; unitIndex++;
  //   }
  //   const unit = this.units[unitIndex];

  //   if (typeof precision === 'number') {
  //     return `${bytes.toFixed(+precision)} ${unit}`;
  //   }
  //   return `${bytes.toFixed(precision[unit])} ${unit}`;
  // }

  transformFileSize(bytes: number, decimals: number = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  CommonClearValues(...inputs: (FormGroup | NgForm | any[])[]): boolean {
    return inputs.some((input) => {
      if (!input) {
        return false;
      }

      if (input instanceof FormGroup || input instanceof NgForm) {
        // Handle FormGroup or NgForm
        const controls = input instanceof NgForm ? input.controls : input.controls;

        return Object.keys(controls).some((key) => {
          const control = controls[key];

          if (control instanceof FormArray) {
            // Check if any FormArray group has meaningful values
            return control.controls.some((group) =>
              group &&
              Object.values(group.value).some((value) => {
                const strValue = typeof value === 'string' ? value.trim() : value;
                return (
                  strValue !== null &&
                  strValue !== '' &&
                  strValue !== 0 &&
                  strValue !== false &&
                  strValue !== true &&
                  strValue !== 'Liabilities' &&
                  strValue !== 'Assets' &&
                  strValue !== undefined
                );
              })
            );
          } else if (control instanceof FormGroup) {
            // Recursively check nested FormGroups
            return this.CommonClearValues(control);
          } else if (control) {
            // Check individual FormControls
            const strValue = typeof control.value === 'string' ? control.value.trim() : control.value;
            return (
              strValue !== null &&
              strValue !== '' &&
              strValue !== 0 &&
              strValue !== false &&
              strValue !== true &&
              strValue !== 'Liabilities' &&
              strValue !== 'Assets' &&
              strValue !== undefined
            );
          }

          return false;
        });
      } else if (Array.isArray(input)) {
        // Handle arrays
        return input.some((item) => {
          if (typeof item === 'string') {
            return item.trim() !== '';
          } else if (typeof item === 'object') {
            return Object.values(item).some((value) => {
              const strValue = typeof value === 'string' ? value.trim() : value;
              return (
                strValue !== null &&
                strValue !== '' &&
                strValue !== 0 &&
                strValue !== true &&
                strValue !== false &&
                strValue !== undefined

              );
            });
          }
          return item !== null && item !== undefined;
        });
      }

      return false; // Default case if the input is neither a form nor an array
    });
  }


  openCancelDialog(form1?: any, form2?: any, dialogResult?: any): any {
    const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, this.dataLostModalConfig);
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        form1.reset();
        if (form2 != null) {
          form2.reset();
        }
        dialogResult.emit(result);
      } else {
        dialogResult.emit(false);
      }
    });
  }

  // Power BI Get 
  public getPowerBiData(): Observable<any[]> {
    const dataUrl = `${this.apiUrl}Audit/GetPowerBIReportDetails`;
    return this.http.get<any>(dataUrl);
  }

  //Get document list from admin set defnition
  getDocumentList(elem:any){
    const dataUrl = `${this.apiUrl}Common/GetbuyerSupplierDocumentListAsync?Transactionid=${elem?.tId}&DocumentSubmitId=${elem?.dId}`;
    return this.http.get<any>(dataUrl);
  }
}

interface SupplierType {
  supplierTypeId: number;
  supplierName: string;
}

interface SupplierRole {
  roleId: number;
  roleName: string;
}

interface OwnershipType {
  typeOwnershipId: number;
  typeOwnershipName: string;
}