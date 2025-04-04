import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../common.service";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { LicenseCategoryMasDto, LicenseStatusMasDto, LicenseTypeMasDto } from "../../models/licence-certificates.model";
import { ActivityVm, LicenseActivityDto, SubActivityVm } from "../../models/licence-activities.model";
import { RelatedPartyDiscDto } from "../../models/related-party-disc.model";
@Injectable({
  providedIn: 'root',
})
export class LicenceActivityService {
  apiUrl: string;
  apiadminUrl: string;
  constructor(private http: HttpClient, private commonService: CommonService) {
    this.apiUrl = environment.apiUrl;
    this.apiadminUrl = environment.apiadminUrl;
  }

  getLicenseCategory(): Observable<LicenseCategoryMasDto[]> {
    const dataUrl = `${this.apiUrl}LicenseActivity/GetLicenseCategories`;
    return this.http.get<LicenseCategoryMasDto[]>(dataUrl);
  }
  getLicenseTypes(): Observable<LicenseTypeMasDto[]> {
    const dataUrl = `${this.apiUrl}LicenseActivity/GetLicenseTypes`;
    return this.http.get<LicenseTypeMasDto[]>(dataUrl);
  }
  getLicenseStatus(): Observable<LicenseStatusMasDto[]> {
    const dataUrl = `${this.apiUrl}LicenseActivity/GetLicenseStatus`;
    return this.http.get<LicenseStatusMasDto[]>(dataUrl);
  }
  getLicenseCertifications(supplierId: number): Observable<any[]> {
    let dataUrl = `${this.apiUrl}LicenseActivity/GetLicenseCertifications`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${supplierId > 0 ? supplierId : 0}`
      }
    });
    return this.http.get<any[]>(dataUrl, { params });
  }
  saveLicenseAndCertificate(obj: FormData) {
    let dataUrl = `${this.apiUrl}LicenseActivity/SaveAllLicenseCertification`;
    return this.http.post<any>(dataUrl, obj);
  }
  deleteOrUndoLicenseAndCertificate(licenseCertificationId: number, deleteFlag: boolean, userId: number) {
    const dataUrl = `${this.apiUrl}LicenseActivity/DeleteOrUndoLicenseCertificate`;
    let body = {};
    let params = new HttpParams({
      fromObject: {
        'licenseCertificationId': `${licenseCertificationId}`,
        'deleteFlag': `${deleteFlag}`,
        'userId': `${userId}`
      }
    });
    return this.http.put(dataUrl, body, { params: params });
  }

  getLicenseActivities(): Observable<ActivityVm[]> {
    const dataUrl = `${this.apiUrl}LicenseActivity/GetLicenseActivities`;
    return this.http.get<ActivityVm[]>(dataUrl);
  }
  getLicenseSubActivities(activityId : number): Observable<SubActivityVm[]> {
    const dataUrl = `${this.apiUrl}LicenseActivity/GetLicenseSubActivities?activityId=${activityId}`;
    return this.http.get<SubActivityVm[]>(dataUrl);
  }
  getLicenseActivityDetails(supplierId: number): Observable<any[]> {
    let dataUrl = `${this.apiUrl}LicenseActivity/GetLicenseActivity`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${supplierId > 0 ? supplierId : 0}`
      }
    });
    return this.http.get<any[]>(dataUrl, { params });
  }
  saveActivityAndSubActivity(licenceValues: LicenseActivityDto) {
    let dataURL = `${this.apiUrl}LicenseActivity/SaveAllActivities`;
    return this.http.post(dataURL, licenceValues);
  }
  deleteLicenseActity(licenceActivityId: number, deleteFlag: boolean, userId: number) {
    const dataUrl = `${this.apiUrl}LicenseActivity/DeleteOrUndoLicenseActivity`;
    let body = {};
    let params = new HttpParams({
      fromObject: {
        'licenseActivityId': `${licenceActivityId}`,
        'deleteFlag': `${deleteFlag}`,
        'userId': `${userId}`
      }
    });
    return this.http.put(dataUrl, body, { params: params });
  }
  getRelatedPartyDiscDetail(supplierId: number): Observable<any> {
    let dataUrl = `${this.apiUrl}LicenseActivity/GetRelatedParty`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${supplierId > 0 ? supplierId : 0}`
      }
    });
    return this.http.get<any>(dataUrl, { params });
  }
  saveRelatedPartyDisc(relatedParty: RelatedPartyDiscDto) {
    let dataURL = `${this.apiUrl}LicenseActivity/SaveRelatedParty`;
    return this.http.post(dataURL, relatedParty);
  }

  deleteRelatedPartyDisc(relatedPartyId: number, deleteFlag: boolean, userId: number) {
    const dataUrl = `${this.apiUrl}LicenseActivity/DeleteOrUndoRelatedParty`;
    let body = {};
    let params = new HttpParams({
      fromObject: {
        'relatedPartyId': `${relatedPartyId}`,
        'deleteFlag': `${deleteFlag}`,
        'userId': `${userId}`
      }
    });
    return this.http.put(dataUrl, body, { params: params });
  }
  deleteDocument(docId: number, userId: number): Observable<any> {
    const dataUrl = `${this.apiUrl}LicenseActivity/DeleteAttachmentDoc?docId=${docId}&userId=${userId}`;
    return this.http.delete<any>(dataUrl);
  }
}
