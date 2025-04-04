import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core'; 
import { themeBalham } from 'ag-grid-community';
import {MrActionMenuComponent} from '../mr-action-menu/mr-action-menu.component'
import { Router, RouterLink } from '@angular/router';
import { MaterialRequisitionService } from '@app/core/services/material-req/material-requisition.service';
import moment from 'moment';
import { CommonService } from '@app/core/services/common.service';
import { SharedService } from '@app/core/services/shared/shared.service';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-material-request-list',
  standalone: true,
  imports: [MatDialogTitle,RouterLink, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, AgGridAngular, MatDialogActions, MatButton, TranslatePipe],
  templateUrl: './material-request-list.component.html',
  styleUrl: './material-request-list.component.scss'
})
export class MaterialRequestListComponent {
 rowSelection:any;
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector =[5,10, 25];
  public theme = themeBalham;

  //Inject Service
  componentService = inject(MaterialRequisitionService);
  commonService = inject(CommonService);
  shared = inject(SharedService);
  constructor(private router : Router){
    this.rowSelection = {
      mode: 'multiRow',
  };
  }
  defaultColDef:ColDef ={
    flex:1,
      filter:true,
      floatingFilter:true,
      headerClass :'ag-header-style',
    }
  rowData:any[] = []
  colDefs: ColDef[] = [
    {
      headerName: 'Ref #',
      maxWidth: 70,
      cellClass: 'cellCenter',
      valueGetter: (params:any) => {
        return params.data?.refNo ? params.data?.refNo : "N/A";
      },
    },
    {
      headerName: 'Created Date',
      valueGetter: (params:any) => {
        return params.data?.createdDate ? moment(new Date(params.data?.createdDate)).format(this.commonService.showFormat.toUpperCase()) : "N/A";
      },
    },
    {
      headerName: 'Approved Date',
      valueGetter: (params:any) => {
        return params.data?.approvedDate ? moment(new Date(params.data?.approvedDate)).format(this.commonService.showFormat.toUpperCase()) : "N/A";
      },
    },
    {
      headerName: 'Short Name',
      valueGetter: (params:any) => {
        return params.data?.shortName ? params.data?.shortName : "N/A";
      },
    },
    {
      headerName: 'Status',
      maxWidth: 120,
      valueGetter: (params:any) => {
        return params.data?.status ? params.data?.status : "N/A";
      },
    },
    {
      headerName: "Action", maxWidth: 120,
      cellRenderer: MrActionMenuComponent, filter: false, sortable: false,
      cellRendererParams: {
        context: {
          componentParent: this,
        },
      }
    },
  ];

  ngOnInit(){
    this.getCreatedMaterialList();
    this.clearSignal();
  }

  getCreatedMaterialList(){
    this.componentService.getAllCreatedList().subscribe((res:any)=>{
      if(res?.length>0){
        this.rowData = res;
      }
    })
  }

  //NOTE - action click
  onActionClick(action: string, rowData: any){
    if (action === 'viewEdit') {
      this.editRow(action, rowData);
    }
  }

  editRow(action:string,data:any){
    let obj = {
      componentName : "materialRequestList",
      action : action,
      valObject: data
    }
    this.shared.setActionValue(obj);
    this.router.navigate([`/krya/addMaterialRequest`], { skipLocationChange: true, replaceUrl: true })
  }

  //SECTION - clear signal value;
  clearSignal(){
    let obj = {
      componentName : "",
      action : "",
      valObject: {}
    }
    this.shared.setActionValue(obj);
  }
}
