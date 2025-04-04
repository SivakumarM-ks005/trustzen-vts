import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { BusinessRoleConstant } from '@app/core/models/constants/business-role.constant';
import { SupplierUserFormService } from '@app/core/services/supplier-management/supplier.user.form.service';
import { PowerBiReportsComponent } from "../power-bi-reports/power-bi-reports.component";

@Component({
  selector: 'app-dashboard-menus',
  templateUrl: './dashboard-menus.component.html',
  styleUrl: './dashboard-menus.component.scss',
  standalone: true,
  imports: [NgIf, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, RouterLink, NgClass, PowerBiReportsComponent]
})
export class DashboardMenusComponent implements OnInit {

  isSublistVisible = false;
  loginData: any;
  supplierManagement: any;
  BUYER = BusinessRoleConstant.BUYER;
  PQREP = BusinessRoleConstant.PQREP;
  getImplementationConfigDataRes: any;

  constructor(private router: Router, public supplierUser: SupplierUserFormService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.GetImplementationConfigData();
    window.history.replaceState({}, '', '/ProcureZen');

    this.loginData = JSON.parse(localStorage.getItem('loginDetails')!);
  }

  dasboardmenus() {
    this.router.navigate(['/krya/dashboard'], { skipLocationChange: true, replaceUrl: true })
  }

  rfqList() {
    this.router.navigate(['/krya/rfq-list'], { skipLocationChange: true, replaceUrl: true })
  }

  pqAssesmentList() {
    this.router.navigate(['/krya/PQAssesmentList'], { skipLocationChange: true, replaceUrl: true })
  }

  manageProfile(profile: any) {
    this.router.navigate([`/krya/dashboard`], { skipLocationChange: true, replaceUrl: true })
  }

  serviceReq() {
    this.router.navigate([`/krya/serviceRequest`], { skipLocationChange: true, replaceUrl: true })
  }

  analytics() {
    this.router.navigate([`/krya/analytics`], { skipLocationChange: true, replaceUrl: true })
  }


  materialrequisition(){
    this.router.navigate(['/krya/materialRequestList'], { skipLocationChange: true, replaceUrl: true })
  }
  purchaserequisition(){
    this.router.navigate(['/krya/purchaseRequestList'], { skipLocationChange: true, replaceUrl: true })
  }

  GetImplementationConfigData() {
    this.supplierUser.GetImplementationConfigData().subscribe(res => {
      if (res) {
        this.getImplementationConfigDataRes = res;
      }
    })
  }

}
