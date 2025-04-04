import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private readonly API_URL = environment.apiUrl;

    constructor(private _httpClient: HttpClient) {
    }

    saveSupplierRegistration(element: any): Observable<any> {
        const dataUrl = this.API_URL + "SupplierRegister/SaveSupplierRegister";
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

    submitOTPforMFA(element: any): Observable<any> {
        const dataUrl = this.API_URL + 'Email/MailVerifyOtp?UserId=' + element.userId + '&OtpCode=' + element.otpCode;
        return this._httpClient.post<any>(dataUrl, {})
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        return throwError(() => new Error(error.message));
    }
}