import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { CommonService } from "../common.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class RFQService {

    apiUrl: string;

    constructor(private http: HttpClient, private commonService: CommonService) {
       this.apiUrl = environment.apiSourceUrl;

    }

    public getAllRFQ(): Observable<any> {
        const dataUrl = `${this.apiUrl}RFQ/GetAllRFQItems`;
        return this.http.get(dataUrl)
            .pipe(catchError(this.handleError));;
    }

    public getRFQ(id: any): Observable<any> {
        const dataUrl = `${this.apiUrl}RFQ/GetRFQItemListById/${id}`;
        return this.http.get(dataUrl)
            .pipe(catchError(this.handleError));;
    }

    public getAllAssignSupplier(formData: any): Observable<any> {
        console.log(formData);
        
        const dataUrl = `${this.apiUrl}RFQ/GetAssignSupplierSearch?suppliername=${formData?.supplierName}&suppliercode=${formData?.supplierCode}&suppliergrade=${formData?.grade}&parentcategoryid=${formData?.parentCategory}&subcategoryid=${formData?.subCategory}&childcategoryid=${formData?.childCategory}`;
        return this.http.get(dataUrl)
            .pipe(catchError(this.handleError));;
    }

    saveRFQData(rfq: FormData) {
        let dataURL = `${this.apiUrl}RFQ/SaveOrUpdateRFQ`;
        return this.http.post(dataURL, rfq);
    }

    public getAllSoucingData(): Observable<any> {
        const dataUrl = `${this.apiUrl}Common/GetMatReqDropDownData`;
        return this.http.get(dataUrl)
            .pipe(catchError(this.handleError));;
    }

    getpurchaseClassificationList(): Observable<any>{
        const dataUrl = `${this.apiUrl}PurchaseRequisition/GetPurchaseClassificationList`;
        return this.http.get(dataUrl)
    }

    getsourcingList(): Observable<any> {
        const dataUrl = `${this.apiUrl}PurchaseRequisition/GetSourceList`;
        return this.http.get(dataUrl)
    }

    getSpendType(): Observable<any> {
        const dataUrl = `${this.apiUrl}PurchaseRequisition/GetSpendType`;
        return this.http.get(dataUrl)
    }

    getEntityList(): Observable<any> {
        const dataUrl = `${this.apiUrl}PurchaseRequisition/GetEntityList`;
        return this.http.get(dataUrl)
    }

    getParentCategory(): Observable<any> {
        const dataUrl = `${this.apiUrl}PurchaseRequisition/GetParentCategoryList`;
        return this.http.get(dataUrl)
    }

    getSubCategory(id: any): Observable<any> {
        const dataUrl = `${this.apiUrl}PurchaseRequisition/GetSubCategoryList?parentcategoryid=${id}`;
        return this.http.get(dataUrl)
    }

    getChildCategory(id: any): Observable<any> {
        const dataUrl = `${this.apiUrl}PurchaseRequisition/GetChildCategoryList?subcategoryid=${id}`;
        return this.http.get(dataUrl)
    }

    getDocumentSection(id: any, ids:any): Observable<any> {
        const dataUrl = `${this.apiUrl}Common/GetbuyerSupplierDocumentListAsync?Transactionid=${id}&DocumentSubmitId=${ids}`;
        return this.http.get(dataUrl)
    }

    //Get RFQ list based on supplier ID
    getSupplierRFQList(supId : number): Observable<any>{
        // const dataUrl = `http://192.168.116.199:5500/api/RFQ/GetRFQItemsBySupplier/${supId}`;
        const dataUrl = `${this.apiUrl}RFQ/GetRFQItemsBySupplier/${supId}`;
        return this.http.get(dataUrl)
    }

    //Regret API
    regretSubmit(regretData:any): Observable<any>{
        let dataURL = `${this.apiUrl}RFQ/SaveOrUpdateRegretRFQ`;
        return this.http.post(dataURL, regretData);
    }

    //Check if already RFQ is regretted
    checkWhetherRegret(supId:number, rfqId:number): Observable<any>{
        const dataUrl = `${this.apiUrl}RFQ/GetRFQByRegretIdBySupplierRFQId/${supId}/${rfqId}`;
        return this.http.get(dataUrl)
    }

    //Create Response submit API
    createResponseSubmit(repsonseSubmitData:any): Observable<any>{
        let dataURL = `${this.apiUrl}RFQ/InsertOrUpdateRFQSupplierResponseNo`;
        return this.http.post(dataURL, repsonseSubmitData);
    }

    //Check if already RFQ response ref created
    checkWhetherResponseRefGenerated(supId:number, rfqId:number): Observable<any>{
        const dataUrl = `${this.apiUrl}RFQ/GetRFQResponseRef/${supId}/${rfqId}`;
        return this.http.get(dataUrl)
    }   
    
    //Save supplier RFQ response
    saveSupplierRFQData(submitData:any): Observable<any>{
        let dataURL = `${this.apiUrl}RFQ/SaveOrUpdateSupplierRFQ`;
        return this.http.post(dataURL, submitData);
    }

    //Get Saved RFQ Response
    getSavedRFQResponse(supId:number, rfqId:number): Observable<any>{
        const dataUrl = `${this.apiUrl}RFQ/GetSupplierRFQResponseList/${supId}/${rfqId}`;
        return this.http.get(dataUrl)
    }

    //Check if already RFQ is regretted
    submitSupplierRFQ(reqObj:any): Observable<any>{
        const dataUrl = `${this.apiUrl}RFQ/SubmitSupplierResponseRFQStatus/${reqObj?.resRefNo}/${reqObj?.status}`;
        return this.http.get(dataUrl)
    }

    private handleError(error: HttpErrorResponse) {
        return throwError(() => new Error(error.message));
    }

}
