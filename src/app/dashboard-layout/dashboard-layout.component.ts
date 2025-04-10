import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton, MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  standalone: true,
  imports: [MatToolbar, MatIconButton, NgIf, MatIcon, RouterLink, MatMenuTrigger, MatMenu, MatMenuItem, MatTooltip, MatSidenavContainer, MatSidenav, MatButton, RouterLinkActive, MatSidenavContent, RouterOutlet]
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

  constructor(private observer: BreakpointObserver,
    private activateRouter: ActivatedRoute,
    private router: Router) {
  }
  ngOnInit() {
    this.getImplementationConfigDataRes = JSON.parse(this.activateRouter.snapshot.queryParamMap.get('ImplementConfig')!);
    window.history.replaceState({}, '', '/trustzen');

    this.loginData = JSON.parse(localStorage.getItem('loginDetails')!);
    this.userName = this.loginData?.userName;
    this.observer.observe(['(max-width: 900px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
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
    localStorage.clear();  

    this.router.navigate(['/trustzen'], { skipLocationChange: true, replaceUrl: true })
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
}
