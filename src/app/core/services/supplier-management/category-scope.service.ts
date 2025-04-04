import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../common.service";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { CategoryDocTypeMas, ChildCategoryVm, ParentCategoryVm, SubCategoryVm } from "../../models/category-scope.model";
@Injectable({
  providedIn: 'root',
})
export class CategoryScopeService {
  apiUrl: string;
  constructor(private http: HttpClient, private commonService: CommonService) {
    this.apiUrl = environment.apiUrl
  }

  saveCategoryAndScope(obj: FormData) {
    let dataUrl = `${this.apiUrl}CategoryAndScope/SaveCategoryAndScope`;
    return this.http.post<any>(dataUrl, obj);
  }
  getCategoryAndScopeDetails(supplierId: number): Observable<any[]> {
    let dataUrl = `${this.apiUrl}CategoryAndScope/GetCategoryAndScopes`;
    let params = new HttpParams({
      fromObject: {
        'supplierId': `${supplierId > 0 ? supplierId : 0}`
      }
    });
    return this.http.get<any[]>(dataUrl, { params });
  }
  deleteCategoryAndScope(categoryId: number, deleteFlag: boolean, userId : number) {
    const dataUrl = `${this.apiUrl}CategoryAndScope/DeleteOrUndoCategoryScope`;
    let body = {};
    let params = new HttpParams({
      fromObject: {
        'categoryScopeId': `${categoryId}`,
        'deleteFlag': `${deleteFlag}`,
        'userId': `${userId}`
      }
    });
    return this.http.put(dataUrl, body, { params: params });
  }
  deleteDocument(docId: number,userId: number): Observable<any> {
    const dataUrl = `${this.apiUrl}CategoryAndScope/DeleteAttachmentDoc?docId=${docId}&userId=${userId}`;
    return this.http.delete<any>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  getCategoryDocType(): Observable<CategoryDocTypeMas[]> {   
    const dataUrl = `${this.apiUrl}CategoryAndScope/GetCategoryDocType`;
    return this.http.get<CategoryDocTypeMas[]>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  getParentCategoryList(): Observable<ParentCategoryVm[]> {   
    const dataUrl = `${this.apiUrl}Master/GetParentCategoryList`;
    return this.http.get<ParentCategoryVm[]>(dataUrl)
      .pipe(catchError(this.handleError));
  }
  getSubCategoryList(parentCatId: number): Observable<SubCategoryVm[]> {
    let dataUrl = `${this.apiUrl}Master/GetSubCategoryList`;
    let params = new HttpParams({
      fromObject: {
        'ParentCatId': `${parentCatId > 0 ? parentCatId : 0}`
      }
    });
    return this.http.get<SubCategoryVm[]>(dataUrl, { params });
  }
  getChildCategoryList(subCatId: number): Observable<ChildCategoryVm[]> {
    let dataUrl = `${this.apiUrl}Master/GetChildCategoryList`;
    let params = new HttpParams({
      fromObject: {
        'SubCatId': `${subCatId > 0 ? subCatId : 0}`
      }
    });
    return this.http.get<ChildCategoryVm[]>(dataUrl, { params });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
