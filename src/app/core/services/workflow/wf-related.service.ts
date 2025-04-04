import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WfRelatedService {

  apiUrl = environment.apiUrl
  apiadminUrl = environment.apiadminUrl;
  constructor(private http: HttpClient) { }

  //Get Initial approval data
  getSupplierWorkflowApprovalApi(screenId: number, initiatorRoleId: number,entityId?:number): Observable<any> {
    let query = `?screenId=${screenId}&initiatorRoleId=${initiatorRoleId}`;
    if(entityId)query+=`&entityId=${entityId}`;
    const dataUrl = `${this.apiadminUrl}WorkflowManagement/GetWFConfigByScreen${query}`;
    return this.http.get<any>(dataUrl);
  }

  //Participation Type droptdown
  getWfPermissionDropDownData(): Observable<any> {
    const dataUrl = `${this.apiadminUrl}WorkflowManagement/GetWfPermissionDropDowData`;
    return this.http.get<any>(dataUrl);
  }

  //save for Initial approval
  SaveSupplierWorkflowApprovalApi(element: any): Observable<any> {
    const dataUrl = this.apiUrl + "WorkFlow/SaveWorkflowInitiate";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  //Get Workflow data
  getWorkflowApi(userId: number): Observable<any> {
    const dataUrl = `${this.apiUrl}WorkFlow/GetApprovalWorkFlowList?userId=${userId}`;
    return this.http.get<any>(dataUrl);
  }

  //Save for Initial approval
  updateWorkFlowDetails(element: any): Observable<any> {
    const dataUrl = this.apiUrl + "WorkFlow/UpdateWorkFlowStatus";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  //Get Workflow status Data
  getSupplierWorkflowStatusApi(supId: number, screenName: string): Observable<any> {
    const dataUrl = `${this.apiUrl}WorkFlow/GetWFStatusListByScreenName?keyValueId=${supId}&screenName=${screenName}`;
    return this.http.get<any>(dataUrl);
  }

  //change status of main table
  updateApplicationStatus(element: any): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierRegister/UpdateApplicationStatus?supplierId=${element?.supId}&status=${element?.status}&userId=${element?.userId}`;
    let body = {};
    return this.http.put(dataUrl, body);
  }

  //change status for supplier
  updateSupplierStatus(element: any): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierRegister/UpdateSupplierStatus?supplierId=${element?.supId}&supplierStatus=${element?.status}&userId=${element?.userId}`;
    let body = {};
    return this.http.put(dataUrl, body);
  }

  //Get Workflow History Data
  getSupplierWorkflowHistoryApi(supId: number, screenName: string): Observable<any> {
    const dataUrl = `${this.apiUrl}WorkFlow/GetWFHistoryByScreenName?keyValueId=${supId}&screenName=${screenName}`;
    return this.http.get<any>(dataUrl);
  }

  //Get Workflow History Data
  getWFRelatedUserApi(wfRoleId: number): Observable<any> {
    const dataUrl = `${this.apiUrl}WorkFlow/GetUsersByWfRoleId?wfRoleId=${wfRoleId}`;
    return this.http.get<any>(dataUrl);
  }

  //Get Entity List
  getEntityList(): Observable<any> {
    const dataUrl = `${this.apiadminUrl}FeesManagement/GetEntityList`;
    return this.http.get<any>(dataUrl);
  }

  //Update assign entity
  UpdateassignEntity(element: any): Observable<any> {
    const dataUrl = this.apiUrl + "SupplierRegister/SavePqSupplierEntity";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  //Get stored Entity List
  getStoredEntityListApi(supId: number): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierRegister/GetPqSupplierEntity?supplierId=${supId}`;
    return this.http.get<any>(dataUrl);
  }

  //Notify WF
  NotifyWorkFlow(element: any): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierRegister/SendSupplierNotifyApprovedMail?supplierId=${element?.supplierId}&status=${element?.status}`;
    let body = {};
    return this.http.put(dataUrl, body);
  }

  //Notify WF for suspension and termination
  notifySuspensionTerminationFlow(element:any): Observable<any>{
    const dataUrl = `${this.apiUrl}SupplierRegister/SendSuspensionNotifyApprovedMail?supplierId=${element?.supplierId}&status=${element?.status}`;
    let body = {};
    return this.http.put(dataUrl, body);
  }

  //Req for info WF status data clear
  clearWfStatus(element: any): Observable<any> {
    const dataUrl = `${this.apiUrl}WorkFlow/UpdateWfReqForInfo?keyValueId=${element?.supId}&screenName=${element?.screenName}`;
    let body = {};
    return this.http.put(dataUrl, body);
  }


  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
