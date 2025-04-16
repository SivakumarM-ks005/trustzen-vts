import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { CommonService } from '../common.service';


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    showLoginMenu: boolean = false;
    showLoginCustomMenu: boolean = false;
    
    toggleLoginMenu() {
        this.showLoginMenu = true;
        this.showLoginCustomMenu = false;  // Hide login custom menu
      }
    
      // Show Login Custom Menu and hide Login Menu
      toggleLoginCustomMenu() {
        this.showLoginCustomMenu = true;
        this.showLoginMenu = false;  // Hide login menu
      }

    API_URL: string;
    APIADMIN_URL: string;
    SUPAPI_URL: 'https://test-suppreg-api.procurezen.ai/api/supplier/';
    apitest: string;
    apitestgateway: string;

    constructor(private _httpClient: HttpClient, private commonService: CommonService) {
        this.API_URL = environment.apiUrl;
        this.APIADMIN_URL = environment.apiadminUrl;
        this.apitest = environment.apitest;
        this.apitestgateway = environment.apitestgateway;
    }

    public GetSupplierContact(SupplierId: number): Observable<any> {
        const dataUrl = `${this.API_URL}SupplierRegisterForm/GetSupplierContactDetails?SupplierId=${SupplierId}`;
        return this._httpClient.get(dataUrl)
            .pipe(catchError(this.handleError));
    }
    public getSupplierRole(): Observable<any> {
        const dataUrl = this.SUPAPI_URL + 'Master/GetRoleDetails';
        return this._httpClient.get<any>(dataUrl)
            .pipe(catchError(this.handleError));
    }
    public getCountry(): Observable<any> {
        const dataUrl = `${this.apitest}Master/GetCountryList`;
        return this._httpClient.get<any>(dataUrl)
            .pipe(catchError(this.handleError));
    }
    public GetSalutationDetails(): Observable<any> {
        const dataUrl = `${this.apitest}Master/GetSalutationDetails`;
        return this._httpClient.get<any>(dataUrl)
            .pipe(catchError(this.handleError));
    }
    public GetSupplierBank(SupplierId: number): Observable<any> {
        const dataUrl = `${this.API_URL}SupplierRegisterForm/GetSupplierBankDetails?SupplierId=${SupplierId}`;
        return this._httpClient.get(dataUrl)
            .pipe(catchError(this.handleError));
    }
    // public GetStateDetails(): Observable<any> {
    //     const dataUrl = this.API_URL + "Master/GetStateList";
    //     return this._httpClient.get<any>(dataUrl)
    //     .pipe(catchError(this.handleError));
    // }
    // public GetCityDetails(): Observable<any> {
    //     const dataUrl = this.API_URL + "Master/GetCityList";
    //     return this._httpClient.get<any>(dataUrl)
    //     .pipe(catchError(this.handleError));
    // }
    public GetCountryBaseaState(CountryId: number): Observable<any> {
        const dataUrl = `${this.API_URL}Master/GetStateList?CountryId=${CountryId}`;
        //const dataUrl = this.API_URL + "Master/GetStateList";
        return this._httpClient.get<any>(dataUrl)
            .pipe(catchError(this.handleError));
    }
    public GetStatebaseCity(StateId: number): Observable<any> {
        const dataUrl = `${this.API_URL}Master/GetCityList?StateId=${StateId}`;
        // const dataUrl = this.API_URL + "Master/GetCityList";
        return this._httpClient.get<any>(dataUrl)
            .pipe(catchError(this.handleError));
    }
    public GetCurrencyDetails(): Observable<any> {
        const dataUrl = this.API_URL + "Master/GetCurrencyList";
        return this._httpClient.get<any>(dataUrl)
            .pipe(catchError(this.handleError));
    }
    SaveContactDetails(element: any): Observable<any> {
        const dataUrl = this.API_URL + "SupplierRegisterForm/SaveSupplierContactDetails";
        return this._httpClient.post<any>(dataUrl, element)
            .pipe(catchError(this.handleError));
    }
    SaveBankDetails(element: any): Observable<any> {
        const dataUrl = this.API_URL + "SupplierRegisterForm/SaveSupplierBankDetails";
        return this._httpClient.post<any>(dataUrl, element)
            .pipe(catchError(this.handleError));
    }
    saveSupplierRegistration(element: any): Observable<any> {
        const dataUrl = `${this.apitest}SupplierRegister/SaveSupplierRegister`;
        return this._httpClient.post<any>(dataUrl, element)
            .pipe(catchError(this.handleError));
    }

    getOTPforMFA(element: any): Observable<any> {
        const dataUrl = this.API_URL + "Email/SendEmail";
        return this._httpClient.post<any>(dataUrl, element)
            .pipe(catchError(this.handleError));
    }

    logIn(element: any): Observable<any> {
        const dataUrl = this.API_URL + "Email/SignIn";
        return this._httpClient.post<any>(dataUrl, element)
            .pipe(catchError(this.handleError));
    }

    getScurity(): Observable<any> {
        const dataUrl = this.APIADMIN_URL + "SystemAttributeModule/GetSecurity";

        // Make the HTTP POST request with custom headers
        return this._httpClient.get<any>(dataUrl)
            .pipe(catchError(this.handleError));
    }

    getJwtToken(element: any): Observable<any> {
        const dataUrl = `${this.apitestgateway}Identity/login`;

        // Make the HTTP POST request with custom headers
        return this._httpClient.post<any>(dataUrl, element)
            .pipe(catchError(this.handleError));
    }

    registorToken(element: any): Observable<any> {
        const dataUrl = `${this.apitestgateway}Identity/register`;

        // Make the HTTP POST request with custom headers
        return this._httpClient.post<any>(dataUrl, element)
            .pipe(catchError(this.handleError));
    }

    logoutToken(element: any): Observable<any> {
        const dataUrl = `${this.apitestgateway}Identity/logout?username=${element?.userName}`;

        // Make the HTTP POST request with custom headers
        return this._httpClient.post<any>(dataUrl, element)
            .pipe(catchError(this.handleError));
    }

    submitOTPforMFA(element: any): Observable<any> {
        const dataUrl = this.API_URL + 'Email/MailVerifyOtp?UserId=' + element.userId + '&OtpCode=' + element.otpCode;
        return this._httpClient.post<any>(dataUrl, {})
            .pipe(catchError(this.handleError));
    }

    forgotPassword(element: any): Observable<any> {
        const dataUrl = this.API_URL + 'SupplierRegister/ForgetPassword?userNameOrMailId=' + element;
        return this._httpClient.post<any>(dataUrl, {})
            .pipe(catchError(this.handleError));
    }

    resetPassword(element: any): Observable<any> {
        const dataUrl = this.API_URL + 'SupplierRegister/ResetPassword';
        return this._httpClient.post<any>(dataUrl, element)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        return throwError(() => new Error(error.message));
    }

    checkUserNameExist(element: any): Observable<any> {
        const dataUrl = this.API_URL + 'SupplierRegister/CheckExistingUserName?userName=' + element.userName;
        return this._httpClient.post<any>(dataUrl, {})
            .pipe(catchError(this.handleError));
    }

    submitOTPforMFACreateUser(element: any): Observable<any> {
        // const dataUrl = this.API_URL + 'Email/SupplierMailVerifyOtp?UserEmail=' + element.email + '&OtpCode=' + element.otpCode;
        const dataUrl = this.API_URL + 'Email/SupplierMailVerifyOtp?OtpCode=' + element.otpCode + '&UserEmail=' + element.email;
        return this._httpClient.post<any>(dataUrl, {})
            .pipe(catchError(this.handleError));
    }
}