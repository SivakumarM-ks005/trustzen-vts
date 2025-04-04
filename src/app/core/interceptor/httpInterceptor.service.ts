import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from "@angular/common/http";
// import { ProgressService } from '../services/progress/progress.service';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from "rxjs/operators";
import { LoaderService } from "../services/loader/loader.service";

@Injectable()

export class HttpInterceptorService implements HttpInterceptor{

    constructor(private loadingService: LoaderService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       this.loadingService.isLoading.next(true);
        const JwtToken = localStorage.getItem('JwtToken');

        if(JwtToken){
            req = req.clone({
                setHeaders: {
                    Authorization : `Bearer ${JwtToken}`
                }
            })
        }
       return next.handle(req).pipe(
        finalize(
            () => {
                this.loadingService.isLoading.next(false);
            }
        )
       )
    }
}