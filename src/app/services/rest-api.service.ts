import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CommonService } from "@app/core/services/common.service";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
    providedIn:'root'
})
export class RestApiService {
    apiUrl: string;
    testUrl:string;
    isTest=true;
    constructor(private http: HttpClient, private commonService: CommonService) {
        this.apiUrl = this.commonService.getConfig('apiUrl');
        // this.testUrl = 'http://172.20.101.36:8019/api/sourcing/'
        // this.testUrl = 'http://192.168.116.13:9090/api/sourcing/'
        this.testUrl = 'https://dev-sourcing-api.procurezen.ai/api/sourcing/'
        // this.testUrl = 'https://dev-gateway-api.procurezen.ai/api/sourcing/'
        // https://dev-gateway-api.procurezen.ai/api/sourcing/PurchaseRequisition/GetEntityList

        // https://dev-sourcing-api.procurezen.ai/api/sourcing/PurchaseRequisition/GetPRItemsSection
        // https://dev-gateway-api.procurezen.ai/api/sourcing/PurchaseRequisition/GetPRItemsSection

        // https://dev-sourcing-api.procurezen.ai/api/supplier/PurchaseRequisition/GetEntityList
    }

    // https://dev-sourcing-api.procurezen.ai/api/sourcing/PurchaseRequisition/GetPRItemsSection
    // https://dev-sourcing-api.procurezen.ai/api/supplier/PurchaseRequisition/GetPRItemsSection

    // https://dev-gateway-api.procurezen.ai/api/sourcing/PurchaseRequisition/SavePurchaseRequisition
    // https://dev-gateway-api.procurezen.ai/api/sourcing/PurchaseRequisition/GetPurchaseClassificationList

     // Generic method to make API calls
  getData<T>(url: string): Observable<T> {
    const apiUrl=this.getApiUrl(url);
    return this.http.get<T>(apiUrl);
  }
  getDataFromAdmin<T>(url: string): Observable<T> {
    const apiUrl=environment.apiadminUrl;
    return this.http.get<T>(`${apiUrl}${url}`);
  }

  postData<T>(url: string, data: any): Observable<T> {
    const apiUrl=this.getApiUrl(url);;
    return this.http.post<T>(apiUrl, data).pipe(catchError(this.handleError));
  }

  putData<T>(url: string, data: any): Observable<T> {
    const apiUrl=this.getApiUrl(url);
    return this.http.put<T>(apiUrl, data).pipe(catchError(this.handleError));
  }
  // purchase requisition
  savePR(data:any){
  
    const apiUrl=this.getApiUrl('PurchaseRequisition/SavePurchaseRequisition');
    console.log(apiUrl,'url save')
    return this.http.post(apiUrl, data).pipe(catchError(this.handleError));
  }
  // purchase requisition

  deleteData<T>(url: string): Observable<T> {
    const apiUrl=`${this.apiUrl}${url}`;
    return this.http.delete<T>(apiUrl).pipe(catchError(this.handleError));
  }
   private handleError(error: HttpErrorResponse) {
      return throwError(() => new Error(error.message));
    }

    getApiUrl(routeUrl:string){
      let url = this.apiUrl;
      if(this.isTest){
        url = this.testUrl
      }
      return `${url}${routeUrl}`;
    }
}