import { Component, inject, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef, ICellRendererParams } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';
import { themeBalham } from 'ag-grid-community';
import { Router, RouterLink } from '@angular/router';
import {SupplierRfqActionMenuComponent} from '../supplier-rfq-action-menu/supplier-rfq-action-menu.component'
import { RFQService } from '@app/core/services/rfq/rfq.service';
import moment from 'moment';
import { CommonService } from '@app/core/services/common.service';
import { SharedService } from '@app/core/services/shared/shared.service';
import { RfqActionMenuComponent } from '../rfq-action-menu/rfq-action-menu.component';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-rfq-list',
  standalone: true,
  imports: [RouterLink, AgGridAngular],
  templateUrl: './rfq-list.component.html',
  styleUrl: './rfq-list.component.scss'
})
export class RfqListComponent implements OnInit {

  rowSelection: any;
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector = [5, 10, 25];
  public theme = themeBalham;
  loginData: any;
  getAllrfq: any;
  supplierRowData: any[]=[]; //Supplier RFQ details

  //inejct Services
  commonService = inject(CommonService);
  shared = inject(SharedService);

  supplierId = this.commonService.SupplierId;
  constructor(private rfqService: RFQService,private router: Router){
    this.rowSelection = {
      mode: 'multiRow',
  };
  this.clearSignal();
  }

  ngOnInit(): void {
    this.loginData = JSON.parse(localStorage.getItem('loginDetails')!);
    if(this.loginData?.userType === 2){
      this.getAllRfqForSupplier();
    }else{
      this.getAllRfq();
    }
  }

  getAllRfq() {
    this.rfqService.getAllRFQ().subscribe(res => {
      this.getAllrfq = res;
    })
  }

  getAllRfqForSupplier(){
    this.rfqService.getSupplierRFQList(this.supplierId).subscribe((res:any)=>{
      this.supplierRowData = res;
    })
  }

  createNewRfq(){
    this.router.navigate(['/krya/new-rfq'], { skipLocationChange: true, replaceUrl: true })
  }

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }

  colDefs: ColDef[] = [
    // { field: "Ref", headerName: 'Ref #', cellRenderer: KeyNameRenderer, maxWidth: 130 },
    { field: "sourcingRFQ.rfqId", headerName: 'Ref #', maxWidth: 130 },
    { field: "sourcingRFQ.shortName", headerName: 'Short Name', maxWidth: 200 },
    // { field: "participantType", headerName: 'Participant Type' },
    {
      field: "sourcingRFQ.ref", headerName: 'Source Doc Ref #', maxWidth: 150,
      cellRenderer: (params: any) => params.value ? params.value : "N/A",
    },
    {
      field: "sourcingRFQ.approvedDate",
      headerName: "Approved",
      maxWidth: 150,
      cellRenderer: (params: any) =>
        params.value ? new Date(params.value).toLocaleDateString("en-GB") : "N/A",
    },
    {
      field: "sourcingRFQ.publishDate",
      headerName: "Published",
      maxWidth: 180,
      cellRenderer: (params: any) =>
        params.value ? new Date(params.value).toLocaleDateString("en-GB") : "N/A",
    },
    {
      field: "sourcingRFQ.submissionDueDate",
      headerName: "Submission Date",
      cellRenderer: (params: any) =>
        params.value ? new Date(params.value).toLocaleDateString("en-GB") : "N/A",
    },
    { field: "sourcingRFQ.buyer", headerName: 'Buyer' },
    //  { field: "estDate", headerName: 'Estimated Date',
    //    cellRenderer: (params:any) => params.value ? params.value : "N/A",
    //  },
    { field: "", headerName: 'Status' },
    {
      headerName: "Action", maxWidth: 120,
      cellRenderer: RfqActionMenuComponent, filter: false, sortable: false
    },
  ];

  rowSelection1: any;
  rowHeight1 = 20;


  defaultColDef1: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }

  colForSupplier: ColDef[] = [
    {
      headerName: 'Ref #',
      maxWidth: 70,
      cellClass: 'cellCenter',
      valueGetter: (params: any) => {
        return params.data?.sourcingRFQ.ref ? params.data?.sourcingRFQ.ref : "N/A";
      },
    },
    {
      headerName: 'Short Name',
      valueGetter: (params: any) => {
        return params.data?.sourcingRFQ.shortName ? params.data?.sourcingRFQ.shortName : "N/A";
      },
    },
    {
      headerName: 'Buyer',
      maxWidth: 120,
      valueGetter: (params: any) => {
        return params.data?.sourcingRFQ.buyer ? params.data?.sourcingRFQ.buyer : "N/A";
      },
    },
    {
      field: "Published",
      headerName: 'Published',
      valueGetter: (params: any) => {
        return params.data?.sourcingRFQ?.publishDate ? moment(new Date(params.data?.sourcingRFQ?.publishDate)).format(this.commonService.showFormat.toUpperCase()) : "N/A";
      },
    },
    {
      field: "SubmissionDue",
      headerName: 'Submission Due',
      width: 270,
      valueGetter: (params: any) => {
        return params.data?.sourcingRFQ?.submissionDueDate ? moment(new Date(params.data?.sourcingRFQ?.submissionDueDate)).format(this.commonService.showFormat.toUpperCase()) : "N/A";
      },
    },
    {
      field: "ResponseRef",
      headerName: 'Response Ref #',
      valueGetter: (params: any) => {
        return params.data?.sourcingRFQ.resRef ? params.data?.sourcingRFQ.resRef : "N/A";
      },
    },
    {
      headerName: 'Status',
      maxWidth: 120,
      valueGetter: (params: any) => {
        return params.data?.sourcingRFQ.status ? params.data?.sourcingRFQ.status : "N/A";
      },
    },
    {
      headerName: "Action", maxWidth: 120,
      cellRenderer: SupplierRfqActionMenuComponent, filter: false, sortable: false,
      cellRendererParams: {
        context: {
          componentParent: this,
        },
      }
    },
  ];

  //NOTE - action click
  onActionClick(action: string, rowData: any){
    if (action === 'viewEdit') {
      this.editRow(action, rowData);
    }
  }

  editRow(action:string,data:any){
    let obj = {
      componentName : "rfqSupplierList",
      action : action,
      valObject: data
    }
    this.shared.setActionValue(obj);
    this.router.navigate([`/krya/rfq-response`], { skipLocationChange: true, replaceUrl: true })
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
