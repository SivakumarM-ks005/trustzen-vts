import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { CommonService } from '../core/services/common.service';
import { PeriodicElement } from '../supplier-user-form/pq-application/pq-application.component';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton, MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTimeService } from '../core/date-time/date-time.service';
import { SupplierAttachmentService } from './../core/services/supplier-management/supplier-attachment.service';
import { BusinessRoleConstant } from '@app/core/models/constants/business-role.constant';
import { LoginService } from './../core/services/login/login.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  standalone: true,
  imports: [MatToolbar, MatIconButton, NgIf, MatIcon, RouterLink, MatMenuTrigger, MatMenu, MatMenuItem, MatTooltip, MatSidenavContainer, MatSidenav, MatButton, RouterLinkActive, MatSidenavContent, RouterOutlet, TranslatePipe]
})
export class DashboardLayoutComponent implements OnInit {
  masterSearch: any;
  showSubmenu: boolean = false;
  showSubSubMenu: boolean = false;


  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  userName: string;
  isSublistVisible = false;
  isSourceVisible = false;
  isContractVisible = false;
  loginData: any;
  isShowIcon: boolean = false;
  supplier: any;
  requestForInformation: boolean = false;
  SupDetails: any;
  getImplementationConfigDataRes: any;
  PQREP = BusinessRoleConstant.PQREP;

  constructor(private observer: BreakpointObserver,
    public commonService: CommonService,
    private activateRouter: ActivatedRoute,
    private router: Router, private dateTimeService: DateTimeService,
    private supplierAttact: SupplierAttachmentService,
    private loginService: LoginService) {
    this.userName = this.commonService.userName;
  }

  ngOnInit() {
    this.getImplementationConfigDataRes = JSON.parse(this.activateRouter.snapshot.queryParamMap.get('ImplementConfig')!);
    window.history.replaceState({}, '', '/ProcureZen');

    this.loginData = JSON.parse(localStorage.getItem('loginDetails')!);
    this.getSupplierDetails();
    // if(this.loginData?.userType === 2){
    // this.loadSupplier();
    // }
    this.dateTimeService.setDateFormat();
    this.userName = this.loginData?.userName;
    this.observer.observe(['(max-width: 900px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  getSupplierDetails() {
    this.supplierAttact.getSupplierDetails(this.loginData?.supplierId).subscribe(res => {
      if (res) {
        this.SupDetails = res;

      }
    })
  }

  manageProfile(profile: any) {
    this.router.navigate([`/krya/dashboardSupReg/profile/${profile}`], { skipLocationChange: true, replaceUrl: true })
  }

  dashboard() {
    this.router.navigate(['/krya/dashboard'], { skipLocationChange: true, replaceUrl: true })
  }

  logOut() {
    const element = {
      "userId": localStorage.getItem('userId'),
      "userName": this.loginData?.userName
    }
    // Clear localStorage and sessionStorage
    localStorage.clear();  // Clears all localStorage items
    sessionStorage.clear();  // Clears all sessionStorage items

    // Optionally, clear cookies or cache as needed (e.g., using custom methods)
    this.clearCache();
    this.router.navigate(['/ProcureZen'], { skipLocationChange: true, replaceUrl: true })
    //this.loginService.logoutToken(element).subscribe(res => {
    //this.router.navigate(['/ProcureZen'], { skipLocationChange: true, replaceUrl: true })
    //})
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

  dashboardSupReg() {
    this.router.navigate(['/krya/dashboardSupReg'], { skipLocationChange: true, replaceUrl: true })
  }

  pqAssesmentList() {
    this.router.navigate(['/krya/PQAssesmentList'], { skipLocationChange: true, replaceUrl: true })
  }

  dasboardmenus() {
    this.router.navigate(['/krya/dashboard-menu'], { skipLocationChange: true, replaceUrl: true })
  }

  workflowList() {
    this.router.navigate(['/krya/workFlowList'], { skipLocationChange: true, replaceUrl: true })
  }

  clauseLib() {
    this.router.navigate(['/krya/clauseLibraryList'], { skipLocationChange: true, replaceUrl: true })
  }

  contractTem() {
    this.router.navigate(['/krya/contractTemplateList'], { skipLocationChange: true, replaceUrl: true })
  }

  contarctRep() {
    this.router.navigate(['/krya/contractRepository'], { skipLocationChange: true, replaceUrl: true })
  }

  itemMaster() {
    this.router.navigate(['/krya/itemMasterList'], { skipLocationChange: true, replaceUrl: true })
  }

  // loadSupplier(){
  //   this.commonService.getSupplier(this.loginData.supplierId).subscribe({
  //     next: (data) => {
  //       this.supplier = data;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching supplier types', err);
  //     }
  //   });
  // }

  toggleMenu() {
    this.sidenav.toggle();
  }

  toggleSublist() {
    this.isSublistVisible = !this.isSublistVisible;
  }
  toggleSource() {
    this.isSourceVisible = !this.isSourceVisible;
  }
  toggleContract() {
    this.isContractVisible = !this.isContractVisible;
  }

  easyView(){
    this.router.navigate(['/krya/easyview'], { skipLocationChange: true, replaceUrl: true })
  }

  materialrequisition(){
    this.router.navigate(['/krya/materialRequestList'], { skipLocationChange: true, replaceUrl: true })
  }
  purchaserequisition(){
    this.router.navigate(['/krya/purchaseRequestList'], { skipLocationChange: true, replaceUrl: true })
  }
  requestforquation(){
    this.router.navigate(['/krya/rfq-list'], { skipLocationChange: true, replaceUrl: true })
  }
}
