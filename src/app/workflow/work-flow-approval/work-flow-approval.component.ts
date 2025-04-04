import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AgGridAngular } from 'ag-grid-angular';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import { AllCommunityModule, ColDef, ICellRendererParams, ModuleRegistry } from 'ag-grid-community';
import { ApprovalWorkFlow } from '../../core/models/workflow.model';
import moment from 'moment';
import { KeyNameRenderer } from './key-name-render.component';
import { Router } from '@angular/router';
import { themeBalham } from 'ag-grid-community';
import { WorkflowActionComponent} from "../workflow-action/workflow-action.component"
import { WfRelatedService } from '../../core/services/workflow/wf-related.service';
import { WorkFlowScreenConstants } from '@app/core/models/constants/work-flow.constant';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-work-flow-approval',
  standalone: true,
  templateUrl: './work-flow-approval.component.html',
  styleUrl: './work-flow-approval.component.scss',
  imports: [AgGridAngular, MatCheckboxModule, FormsModule]
})
export class WorkFlowApprovalComponent implements OnInit {
  userId: number = 0;
  colDefs: ColDef[] = [];
  // workFlowList: ApprovalWorkFlow[] = new Array<ApprovalWorkFlow>();
  workFlowList: any[] = [];
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector = [5, 10, 25];
  public theme = themeBalham;
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }
  rowCount: number = 0;
  rowData = [
    { 
      Ref: "FY2025-2024", 
      submittedDate: "01-02-2025", 
      entityName: 'Info com', 
      initiator: 'karthick Gopal',
      moduleName:'Manage Profile',
      activity:'Tech Evaluation WF Activity',
      status:'Pending',
      estimatedDate:'01-02-2025'
    },
  ];

  //Inject Service
  wfService = inject(WfRelatedService)
  constructor(private adminService: AdminService, public commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
    this.userId = loggedUserDetails.userId;
    this.getWorkflowList();
    this.initColumns();
  }
  initColumns() {
    this.colDefs = [
      // { field: "Ref", headerName: 'Ref #', cellRenderer: KeyNameRenderer, maxWidth: 130 },
      { field: "keyValue", headerName: 'Ref #', maxWidth: 130 },
      { field: "actionDate", headerName: 'Submitted Date', maxWidth: 200 },
      // { field: "participantType", headerName: 'Participant Type' },
      { field: "entityName", headerName: 'Entity Name', maxWidth: 150,
        cellRenderer: (params:any) => params.value ? params.value : "N/A",
      },
      { field: "assignedUser", headerName: 'Initiator', maxWidth: 150 ,
        cellRenderer: (params:any) => params.value ? params.value : "N/A",},
      { field: "screenName", headerName: 'Module Name', maxWidth: 180 ,
        cellRenderer: (params:any) => params.value ? params.value : "N/A",},
      { field: "activityType", headerName: 'Activity' ,
        cellRenderer: (params:any) => params.value ? params.value : "N/A",},
      { field: "actionTaken", headerName: 'Status' },
      { field: "estDate", headerName: 'Estimated Date',
        cellRenderer: (params:any) => params.value ? params.value : "N/A",
      },
      {
        headerName: "Action", maxWidth: 120, cellStyle: {textAlign: 'center'},
        cellRenderer: (params: ICellRendererParams) => {
          return `<span class="action-icon"><i class="fa fa-eye"></i></span>`;
        },
        onCellClicked: (params: any) => {
          const target = params?.event?.target as HTMLElement;
          if (target && target.classList.contains('fa-eye')) {
            this.redirectTo(params?.data);
          }
        }
      },
    ];
  }

  
  getWorkflowList() {
    // this.commonService.getWorkflowList(this.userId)
    //   .subscribe({
    //     next: res => {
    //       res.forEach(item => {
    //         item.actionDate = moment(new Date(item.actionDate)).format(this.commonService.showFormat.toUpperCase())
    //       });
    //       this.rowCount = res.length;
    //       this.workFlowList = res;
    //     }, error: error => this.adminService.showMessage(error),
    //     complete: () => { }
    //   });

    this.wfService.getWorkflowApi(this.userId).subscribe({
      next: res => {
        res.forEach((item: any) => {
          item.actionDate = moment(new Date(item.actionDate)).format(this.commonService.showFormat.toUpperCase())
        });
        this.rowCount = res.length;
        this.workFlowList = res;
      }, error: error => this.adminService.showMessage(error),
      complete: () => { }
    })
  }

  goToComponent(rowData: ApprovalWorkFlow) {
    const wfName = rowData.workFlowName;
    switch (wfName) {
      case 'Template Management':
        this.commonService.wfPrimaryKeyId = rowData.primaryKeyId;
        this.commonService.isFromWorkFlow = true;
        this.commonService.userComment = rowData.comments;
        this.commonService.wfSavedId = rowData.workFlowId;
        this.router.navigate([`/krya/contractTemplateList`], { skipLocationChange: true, replaceUrl: true });
        break;
    }
  }

  redirectTo(params:any){
    let status = 'workFlow';
    if(params?.screenName === WorkFlowScreenConstants.PREQUALIFICATION){
      this.router.navigate([`/krya/dashboardSupReg/id/${params?.keyValueId}/${status}/`], { skipLocationChange: true, replaceUrl: true , fragment: 'commentSection'})
    }
    else if(params?.screenName === WorkFlowScreenConstants.SUPPLIERTERSUS || params?.screenName === WorkFlowScreenConstants.SUPPLIERREVOKE){
      this.router.navigate([`/krya/dashboardSupTer/id/${params?.keyValueId}`], { skipLocationChange: true, replaceUrl: true,fragment: 'commentSection' })
    }
    else if(params?.screenName === WorkFlowScreenConstants.PR)
      this.router.navigate([`/krya/purchaseRequestList`], { skipLocationChange: true, replaceUrl: true,queryParams: { id: params?.keyValueId } })
    }

}
