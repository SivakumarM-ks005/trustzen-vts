import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuspensionTerminationService {
  API_URL: string;
  APIADMIN_URL: string
  constructor(private http: HttpClient) {
    this.API_URL = environment.apiUrl;
    this.APIADMIN_URL = environment.apiadminUrl;
  }

  //Save suspension
  supplierSuspensionSave(data: any): Observable<any> {
    let dataUrl = this.API_URL + 'SuspensionOrTermination/SaveSuspensionOrTermination';
    return this.http.post<any>(dataUrl, data)
  }

  getlreadySuspensionDetailsAPI(SupplierId: number): Observable<any> {
    let dataUrl = `${this.API_URL}SuspensionOrTermination/GetSuspensionOrTerminationData`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${SupplierId > 0 ? SupplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }

  //Attachement for suspension and termination
  saveSusTerAttachments(obj: FormData) {
    const dataUrl = `${this.API_URL}SuspensionOrTermination/SaveDocuments`;
    return this.http.post<any>(dataUrl, obj);
  }

  //Remove suspension or termination
  removeSusTerData(supId:number): Observable<any> {
    const dataUrl = `${this.API_URL}SuspensionOrTermination/RemoveSuspensionOrTerminationData?supplierId=${supId}`;
    return this.http.delete<any>(dataUrl);
  }

  //Get Suspension / Terminated entity list
  getSusTermEntityList(supId:number): Observable<any>{
    const dataUrl = `${this.API_URL}SuspensionOrTermination/GetSuspensionOrTerminationHistory?supplierId=${supId}`;
    return this.http.get<any>(dataUrl);
  }

  // Update Suspension and termination
  updateSusTer(element:any,histId:any):Observable<any>{
    const dataUrl = `${this.API_URL}SuspensionOrTermination/UpdateIconClick?suspensionHistoryId=${histId}`;
    let body = element;
    return this.http.put(dataUrl, body);
  }

  //Attachement for suspension and termination update
  updateSusTerAttachments(obj: FormData) {
    const dataUrl = `${this.API_URL}SuspensionOrTermination/SaveUpdateDocuments`;
    return this.http.post<any>(dataUrl, obj);
  }

  // Revoke Save
  saveRevokeProcess(obj: any){
    const dataUrl = `${this.API_URL}supplier/RevokeSuspension/SaveRevokeData`;
    return this.http.post<any>(dataUrl, obj);
  }

  // Update status for History
  updateStatusForHistoy(element:any): Observable<any>{
    const dataUrl = `${this.API_URL}SuspensionOrTermination/UpdateSuspensionOrTerminationStatus?suspensionHistoryId=${element.suspensionHistoryId}&newStatus=${element.status}`;
    let body = {};
    return this.http.put(dataUrl, body);
  }

  // Get revoke suspension Data
  getRevokeSusupensionData(supId:number): Observable<any>{
    const dataUrl = `${this.API_URL}supplier/RevokeSuspension/GetRevokeSuspensionData/${supId}`;
    return this.http.get<any>(dataUrl);
  }

  // Delete suspension history Data
  deleteSuspensionHistory(suspensionHistoryId: number): Observable<any>{
    const dataUrl = `${this.API_URL}SuspensionOrTermination/DeleteSuspensionOrTerminationData?suspensionHistoryId=${suspensionHistoryId}`;
    return this.http.delete<any>(dataUrl);
  }

  //Get Assign entity list based on supplier
  getStoredEntityListApi(supId: number): Observable<any> {
    const dataUrl = `${this.API_URL}SupplierRegister/GetPqSupplierEntity?supplierId=${supId}`;
    return this.http.get<any>(dataUrl);
  }

  //Delete revoke data
  deleteRevokeData(revokeId : number): Observable<any>{
    const dataUrl = `${this.API_URL}supplier/RevokeSuspension/DeleteRevokeSuspension?revokeId=${revokeId}`;
    return this.http.delete<any>(dataUrl);
  }
}
