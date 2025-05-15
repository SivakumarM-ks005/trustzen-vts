import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { provideHttpClient, withFetch, HTTP_INTERCEPTORS, withInterceptorsFromDi, HttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MAT_DATE_FORMATS, DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';


import { routes } from './app/app.routes';
import { TableModule } from 'primeng/table';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideRouter, withHashLocation } from '@angular/router';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';

// import { cacheInterceptor } from './app/core/interceptor/cacheinterceptor.service';

// const MY_DATE_FORMATS = {
//   parse: {
//     dateInput: 'yyyy-MM-dd',  // Format for parsing
//   },
//   display: {
//     dateInput: 'yyyy-MM-dd',  // Format for display in the input
//     monthYearLabel: 'yyyy MMM', // Example: 2025 Jan
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'YYYY MMMM',
//   },
// };



bootstrapApplication(AppComponent, {
    providers: [DatePipe,
        provideRouter(routes, withHashLocation()),
        importProvidersFrom(TableModule, AngularEditorModule, ScrollPanelModule, NgSelectModule, AgGridModule, 
        // ngx-translate and the loader module,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })),
        provideHttpClient(withFetch()),
        provideClientHydration(),
        provideAnimationsAsync(),
        MatDatepickerModule,
        
        // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        // {
        //   /*API interceptor should invoked here to attach with all http request */
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: Interceptor,
        //   multi: true
        // },
        // {
        //   provide: APP_INITIALIZER,
        //   useFactory: (authService: AuthService) => () => authService.load(),
        //   deps: [AuthService],
        //   multi: true,
        // },
       
       
        // provideHttpClient(withInterceptors([cacheInterceptor])),
        // { provide: DateAdapter, useClass: CustomDateAdapterFormats },
        // { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
        // {provide: MAT_DATE_LOCALE, useValue:  new InjectionToken<string>('LANG') },
        // provideMomentDateAdapter(MY_DATE_FORMATS),        
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } },
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
})
  .catch(err => console.error(err));

  // required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}