import { Component, OnInit } from '@angular/core';
import { LoaderService } from './core/services/loader/loader.service';
import { SessionTimeoutService } from './core/services/session-timeout.service';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf, AsyncPipe, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { SupplierUserFormService } from './core/services/supplier-management/supplier.user.form.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, NgIf, MatProgressBar, AsyncPipe],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }], // Provide HashLocationStrategy
})
export class AppComponent implements OnInit {

  title = 'procurezen';
  show = false;
  isLoading$ = false;

  constructor(public loaderService: LoaderService, private router: Router, private sessionTimeoutService: SessionTimeoutService, private supplierUser: SupplierUserFormService) {

  }

  ngOnInit(): void {
     // Check if the page is being reloaded and clear specific data
     window.onbeforeunload = () => {
      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      // Optionally, clear cookies or cache as needed (e.g., using custom methods)
      this.clearCache();
      // Optionally clear other cached data
    };
    this.GetSystemParamTimeExpried();
    localStorage.openpages = Date.now();
    const onLocalStorageEvent = (e: StorageEvent) => {
      if (e.key === "openpages") {
        // Emit that you're already available.
        localStorage.page_available = Date.now();
      }
      if (e.key === "page_available") {
        alert("Security Alerts. You cannot open this site in multiple tabs. This window will now close.");
        window.location.href = "about:blank";
      }
    };
    window.addEventListener('storage', onLocalStorageEvent, false);
  }

  clearCache() {
    // This method is optional if you need to clear any cached data
    // For example, if you're using service workers or caching strategies, you'd handle it here
    if ('caches' in window) {
      caches?.keys().then((cacheNames) => {
        cacheNames?.forEach((cacheName) => {
          caches?.delete(cacheName);
        });
      });
    }
  }
  
  GetSystemParamTimeExpried() {
    this.supplierUser.GetSysParameterGeneral().subscribe(res => {
      if (res != null) {
        if (res.sessionTimeOut && res.sessionMinsSeconds !== null && res.sessionTextField !== null) {
          const sessionTimeOut = res.sessionTimeOut;
          const sessionTextField = res.sessionTextField;
          const sessionMinsSeconds = res.sessionMinsSeconds;
          this.Urlfind(sessionTimeOut, sessionTextField, sessionMinsSeconds);
        }
      }
    })
  }
  Urlfind(sessionTimeOut: any, sessionTextField: any, sessionMinsSeconds: any) {
    const currentUrl = this.router.url;
    if (currentUrl !== "/ProcureZen") {
      this.sessionTimeoutService.startSessionTimeout(sessionTimeOut, sessionTextField, sessionMinsSeconds);
    }
  }

  ngOnDestroy(): void {
    this.sessionTimeoutService.stopSessionTimeout();
  }
}
