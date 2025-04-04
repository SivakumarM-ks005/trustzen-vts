import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Compliance } from '../../Interface/compliance';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ComplianceCheckService {
  API_URL: string;
  constructor(private http: HttpClient, private commonService: CommonService) {
    this.API_URL = environment.apiUrl;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

  public getComplianceCheckList(): Observable<any> {
    const dataUrl = `${this.API_URL}Compliancecheck/GetComplianceCheckById`;
    return this.http.get<Compliance[]>(dataUrl);
  }
  
  SaveComplianceCheckListData(element: any): Observable<any> {
    const dataUrl = this.API_URL + "Compliancecheck/SaveComplianceCheckListData";
    return this.http.post<any>(dataUrl, element)
        .pipe(catchError(this.handleError));
  }

  public GetComplianceCheckListData(supplierId: number): Observable<any> {
    const dataUrl = `${this.API_URL}Compliancecheck/GetComplianceCheckListData?SupplierId=${supplierId}`;
    return this.http.get(dataUrl).pipe(
      catchError(this.handleError)
    );
  }

}
