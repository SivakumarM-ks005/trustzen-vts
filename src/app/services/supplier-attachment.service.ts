import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { AttachmentTypes } from "../core/models/supplier-attachment.model";

@Injectable({
  providedIn: 'root',
})

export class SupplierAttachmentService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  GetSupplierPQAssessment(SupplierId: number): Observable<any> {
    let dataUrl = `${this.apiUrl}SupplierQuestionnaire/GetSupplierPQAssessment/` + SupplierId;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${SupplierId > 0 ? SupplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }


  SaveSupplierPQAssessment(element: any): Observable<any> {
    const dataUrl = this.apiUrl + "SupplierQuestionnaire/SaveSupplierPQAssessment";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }


  UpdateSupplierPQAssessment(element: any): Observable<any> {
    const dataUrl = this.apiUrl + "SupplierQuestionnaire/UpdateSupplierPQAssessment";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  SaveInitialApprovel(element: any): Observable<any> {
    const dataUrl = this.apiUrl + "SupplierQuestionnaire/SaveInitiateApproval";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  SaveApprovel(element: any): Observable<any> {
    const dataUrl = this.apiUrl + "SupplierQuestionnaire/UpdateInitiateApproval";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  GetApprovelHistory(id:any): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/GetPQAssessmentApprovalWorkflowHistory/${id}`;
    return this.http.get<AttachmentTypes>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  UpdateassignEntity(element: any): Observable<any> {
    const dataUrl = this.apiUrl + "PQAssesment/UpdateAssignEntities";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  GetassignEntity(): Observable<any> {
    const dataUrl = `${this.apiUrl}PQAssesment/GetAssignEntity`;
    return this.http.get<AttachmentTypes>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  GetWorkFlowDetails(id:any): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/GetPQAssessmentWorkflowHistry/${id}`;
    return this.http.get<AttachmentTypes>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  GetApprovalWorkFlowDetails(id:any): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierQuestionnaire/GetPQAssessmentApprovalWorkflowHistory/${id}`;
    return this.http.get<AttachmentTypes>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  GetSeekClariDetails(id:any): Observable<any> {
    const dataUrl = `${this.apiUrl}PQAssesment/GetClarificationHistoryDetails?SupplierId=${id}`;
    return this.http.get<AttachmentTypes>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  SaveSeekClarification(element: any): Observable<any> {
    const dataUrl = this.apiUrl + "PQAssesment/SendSeekClarificationEmail";
    return this.http.post<any>(dataUrl, element)
      .pipe(catchError(this.handleError));
  }

  GetAllUserDetails(): Observable<any> {
    const dataUrl = `${this.apiUrl}SupplierRegister/Getuser`;
    return this.http.get<AttachmentTypes>(dataUrl)
      .pipe(catchError(this.handleError));
  }


  getSupplierDetails(SupplierId: number): Observable<any> {
    let dataUrl = `${this.apiUrl}PQAssesment/GetSupplierDetails`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${SupplierId > 0 ? SupplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }

  GetSupplierCategoryDetails(SupplierId: number): Observable<any> {
    let dataUrl = `${this.apiUrl}PQAssesment/GetSupplierCategoryDetails`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${SupplierId > 0 ? SupplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }

  GetPQCategoryScoreDetails(SupplierId: number): Observable<any> {
    let dataUrl = `${this.apiUrl}PQAssesment/GetPQCategoryScoreDetails`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${SupplierId > 0 ? SupplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }

  GetPQCategoryReponseDetails(SupplierId: number): Observable<any> {
    let dataUrl = `${this.apiUrl}PQAssesment/GetPQCategoryReponseDetails`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${SupplierId > 0 ? SupplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }

  GetScoreCardMasDetails(): Observable<any> {
    const dataUrl = `${this.apiUrl}PQAssesment/GetScoreCardMasDetails`;
    return this.http.get<AttachmentTypes>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  GetPQComplianceScoreDetails(SupplierId: number): Observable<any> {
    let dataUrl = `${this.apiUrl}PQAssesment/GetPQComplianceScoreDetails`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${SupplierId > 0 ? SupplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }

  GetPQComplianceReponseDetails(SupplierId: number): Observable<any> {
    let dataUrl = `${this.apiUrl}PQAssesment/GetPQComplianceReponseDetails`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${SupplierId > 0 ? SupplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }

  getAttachmentTypes(): Observable<AttachmentTypes> {
    const dataUrl = `${this.apiUrl}Attachment/GetAttachmentTypes`;
    return this.http.get<AttachmentTypes>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  getAttachmentDetails(supplierId: number): Observable<any> {
    let dataUrl = `${this.apiUrl}Attachment/GetAttachmentDetail`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${supplierId > 0 ? supplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }

  saveAttachments(obj: FormData) {
    const dataUrl = `${this.apiUrl}Attachment/SaveAttachments`;
    return this.http.post<any>(dataUrl, obj);
  }

  deleteDocument(docId: number, userId: number): Observable<any> {
    const dataUrl = `${this.apiUrl}Attachment/DeleteAttachmentDoc?docId=${docId}&userId=${userId}`;
    return this.http.delete<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }

  deleteOptionalAttach(optAttachmentId: number, deleteFlag: boolean, userId: number) {
    const dataUrl = `${this.apiUrl}Attachment/DeleteOrUndoOptionalAttachment`;
    let body = {};
    let params = new HttpParams({
      fromObject: {
        'attachmentId': `${optAttachmentId}`,
        'deleteFlag': `${deleteFlag}`,
        'userId': `${userId}`
      }
    });
    return this.http.put(dataUrl, body, { params: params });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

}