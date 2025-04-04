import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { CommonService } from "../common.service";
import { MatScreenNavigation } from "../../models/master-screen-navigation.model";

@Injectable({
  providedIn: 'root',
})
export class SupplierUserFormService {
  API_URL: string;
  APIADMIN_URL: string
  constructor(private http: HttpClient, private commonService: CommonService) {
    this.API_URL = environment.apiUrl;
    this.APIADMIN_URL = environment.apiadminUrl;
  }
  downloadMultipleFiles(filePaths: string[]): Observable<any[]> {
    const body = filePaths; // The file paths to be sent as the request body

    return this.http.post<any[]>(`${this.API_URL}Master/DownloadMultipleDocuments`, body)
      .pipe(
        catchError(this.handleError)  // Handle errors here
      );
  }

  GetImplementationConfigData(): Observable<any> {
    const dataUrl = `${this.APIADMIN_URL}ImplementationConfig/GetImplementationConfigData`;
    return this.http.get<any>(dataUrl);
  }
  GetAdminSupplierBankDetails(): Observable<any> {
    const dataUrl = `${this.API_URL}SysParamSupplierManagement/GetAdminSupplierBankDetails`;
    return this.http.get<any>(dataUrl);
  }

  GetSysParameterGeneral(): Observable<any> {
    const dataUrl = `${this.APIADMIN_URL}ImplementationConfig/GetSysParameterGeneral`;
    return this.http.get<any>(dataUrl);
  }
  getLocalSysParamGeneral(): Observable<any> {
    const dataUrl = `${this.API_URL}Compliancecheck/GetSysParameterGeneral`;
    return this.http.get<any>(dataUrl);
  }
  SupplierFinalSubmission(SupCompletedFlag: boolean, supplierId: number, userId: number): Observable<any> {
    const dataUrl = `${this.API_URL}SupplierRegisterForm/SupplierFinalSubmission?SupCompletedFlag=${SupCompletedFlag}&SupplierId=${supplierId}&UserId=${userId}`;

    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  SaveFinacialAndBusiness(FinacialAndBusiness: FormData) {
    const dataUrl = this.API_URL + 'FinacialAndBusiness/SaveFinacialAndBusiness';
    return this.http.post<any>(dataUrl, FinacialAndBusiness);
  }
  // DownloaFinancialDocument(FinDocId: number): Observable<any> {
  //   const dataUrl = `${this.API_URL}FinacialAndBusiness/DownloaFinancialDocument?FinDocId=${FinDocId}`;
  //   return this.http.get<any>(dataUrl)
  //   .pipe(catchError(this.handleError));
  // }
  downloadFile(filePath: string): Observable<Blob> {
    const encodedFilePath = encodeURIComponent(filePath); // Encode file path for URL
    const apiUrl = `${this.API_URL}FinacialAndBusiness/DownloaFinancialDocument?filePath=${encodedFilePath}`;

    return this.http.get<Blob>(apiUrl, { responseType: 'blob' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }
  DeleteFinancialDocumet(finDocId: number, financialHealthId: number, userId: number): Observable<any> {
    const dataUrl = `${this.API_URL}FinacialAndBusiness/DeleteFinancialDocument?finDocId=${finDocId}&financialHealthId=${financialHealthId}&UserId=${userId}`;
    return this.http.delete<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  DeleteProjectDetails(projectDetailsId: number, supplierId: number, userId: number): Observable<any> {
    const dataUrl = `${this.API_URL}FinacialAndBusiness/DeleteProjectDetails?SupplierId=${supplierId}&ProjectDetailsId=${projectDetailsId}&UserId=${userId}`;
    return this.http.delete<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  GetFinancialBusinessDetails(supplierId: number): Observable<any> {
    const dataUrl = `${this.API_URL}FinacialAndBusiness/GetFinancialAndBusinessDetails?SupplierId=${supplierId}`;
    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  // Category Scope save
  saveCategoryAndScope(obj: FormData) {
    const dataUrl = this.API_URL + 'CategoryAndScope/SaveCategoryAndScope';
    return this.http.post<any>(dataUrl, obj);
  }

  // Category Scope save

  saveAddressDetails(element: any): Observable<any> {
    const dataUrl = this.API_URL + "SupplierRegisterForm/SaveSupplierAddressTax";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }
  GetSupplierManagement(): Observable<any> {
    const dataUrl = `${this.APIADMIN_URL}SysParamSupplierManagement/GetSupplierManagement`;
    return this.http.get<any>(dataUrl);
  }
  getAddressDetails(supplierId: number): Observable<any> {
    const dataUrl = `${this.API_URL}SupplierRegisterForm/GetSupplierAddressTaxDetails?SupplierId=${supplierId}`;
    return this.http.get<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  deleteAddressDetails(registerAddressId: number, supplierId: number, userId: number): Observable<any> {
    const dataUrl = `${this.API_URL}SupplierRegisterForm/DeleteSupplierAddressTaxDetails?SupplierId=${supplierId}&RegisterAddressId=${registerAddressId}&UserId=${userId}`;
    return this.http.delete<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  deleteTaxDetails(registerAddressId: number, taxDetailId: number, userId: number, supplierId: number): Observable<any> {
    const dataUrl = `${this.API_URL}SupplierRegisterForm/DeleteTaxDetails?registerAddressId=${registerAddressId}&taxDetailId=${taxDetailId}&userId=${userId}&supplierId=${supplierId}`;
    return this.http.delete<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  deleteContactDetails(contactId: number, supplierId: number, userId: number): Observable<any> {
    const dataUrl = `${this.API_URL}SupplierRegisterForm/DeleteSupplierContactDetails?SupplierId=${supplierId}&ContactId=${contactId}&UserId=${userId}`;
    return this.http.delete<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  deleteBankDetails(bankId: number, supplierId: number, userId: number): Observable<any> {
    const dataUrl = `${this.API_URL}SupplierRegisterForm/DeleteSupplierBankDetails?SupplierId=${supplierId}&BankId=${bankId}&UserId=${userId}`;
    return this.http.delete<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  getSupplierFormSaveDetails(supplierId: number): Observable<MatScreenNavigation[]> {
    let dataUrl = `${this.API_URL}Master/GetSupplierFormSaveDetails`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${supplierId > 0 ? supplierId : 0}`
      }
    });
    return this.http.get<MatScreenNavigation[]>(dataUrl, { params });
  }
  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}