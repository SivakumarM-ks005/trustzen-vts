import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { DialogDeactivateTemplateComponent } from '../dialog/dialog-deactivate-template/dialog-deactivate-template.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { ContractTemplate } from '../../core/models/contract-template.model';
import { ContractService } from '../../core/services/contract-service';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import { ContractTemplateComponent } from "../contract-template/contract-template.component";
import { DialogViewWorkflowComponent } from '../dialog/dialog-view-workflow/dialog-view-workflow.component';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';
import { ContractTemplateActionMenuComponent } from './contract-template-action-menu/contract-template-action-menu.component';
import { TemplateIdRenderer } from './contract-template-action-menu/template-id-render.component';
import { TransactionTypeConstants } from '../../core/models/constants/transaction-type.constant';
import { themeBalham } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-contract-template-list',
  templateUrl: './contract-template-list.component.html',
  styleUrl: './contract-template-list.component.scss',
  standalone: true,
  imports: [MatTooltip, ContractTemplateComponent, AgGridAngular]
})
export class ContractTemplateListComponent implements OnInit, AfterViewInit, OnDestroy {
  showAddPage: boolean = false;
  templateValue: ContractTemplate = new ContractTemplate();
  editMode: boolean = false;
  approverViewMode: boolean = false;
  viewOnly: boolean = false;
  allDataCount: number = 0;
  templateData: ContractTemplate[] = new Array<ContractTemplate>();
  loginData: any;
  public theme = themeBalham;
  rowHeight = 40;
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 25, 50];
  public defaultColDef: ColDef = {
    flex: 10,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }
  colDefs: ColDef[] = [];
  nextSeqValue: string;

  constructor(private contractService: ContractService,
    private adminService: AdminService,
    public commonService: CommonService,
    public dialog: MatDialog) {
  }
  ngAfterViewInit() {
  }
  ngOnInit(): void {
    this.loginData = JSON.parse(localStorage.getItem('loginDetails')!);
    this.initColumns();
    this.getClassTemplateList();
  }

  initColumns() {
    this.colDefs = [
      { field: "templateId", headerName: 'Template #', cellRenderer: TemplateIdRenderer },
      { field: "shortName", headerName: 'Short Name' },
      { field: "contractType", headerName: 'Contract Type' },
      { field: "contractClassification", headerName: 'Classification' },
      { field: "createDate", headerName: 'Created Date' },
      { field: "approvedDate", headerName: 'Approved Date' },
      { field: "status", headerName: 'Status' },
      {
        headerName: "Action", maxWidth: 120,
        cellRenderer: ContractTemplateActionMenuComponent, filter: false, sortable: false
      },
    ];
  }
  onGridReady(params: GridReadyEvent) {
    this.templateData = this.templateData;
  }
  getClassTemplateList() {
    this.contractService.getClauseTemplateList()
      .subscribe({
        next: res => {
          res.forEach(ix => {
            if (ix.status === 'Review In Progress') {
              ix.disableEdit = true;
            }
            ix.createDate = ix.createDate ? moment(new Date(ix.createDate)).format(this.commonService.showFormat.toUpperCase()) : null;
            ix.approvedDate = ix.approvedDate ? moment(new Date(ix.approvedDate)).format(this.commonService.showFormat.toUpperCase()) : null;
          });
          this.allDataCount = res.length;
          this.templateData = res;
        }, error: (error: any) => this.adminService.showMessage(error),
        complete: () => {
          this.getNextSeqValue();
          if (this.commonService.isFromWorkFlow) {
            let wfData = this.templateData.filter(x => x.contractTemplateId === this.commonService.wfPrimaryKeyId)[0];
            this.approverViewWorkFlowTemplate(wfData);
          }
        }
      });
  }
  getNextSeqValue() {
    this.commonService.getNextTranSeq(TransactionTypeConstants.ContractTemplates, this.allDataCount)
      .subscribe({
        next: res => {
          if (res.seqVal) {
            this.nextSeqValue = res.seqVal;
          } else {
            this.nextSeqValue = 'Templte-' + (this.allDataCount + 1);
          }
        }, error: (error: any) => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  approverViewWorkFlowTemplate(data: ContractTemplate) {
    this.approverViewMode = true;
    this.templateValue = data;
    this.showAddPage = true;
  }

  addTemplate() {
    const addNew = new ContractTemplate();
    addNew.templateId = this.nextSeqValue;
    this.templateValue = addNew;
    this.showAddPage = true;
  }
  viewOrEditTemplate(data: ContractTemplate) {
    if (data.status === 'Draft' || data.status === 'Request for Information') {
      this.editMode = true;
    } else {
      this.viewOnly = true;
    }
    this.templateValue = data;
    this.showAddPage = true;
  }
  copyTemplate(data: any) {
    let addNew = Object.assign({}, data);
    addNew.templateId = this.nextSeqValue;
    addNew.contractTemplateId = 0;
    addNew.isAssignCategory = false;
    addNew.isEntity = false;
    addNew.status = 'Draft';
    this.templateValue = addNew;
    this.showAddPage = true;
  }
  backClick() {
    this.editMode = false;
    this.viewOnly = false;
    this.showAddPage = false;
    this.getClassTemplateList();
  }

  deactivateTemplate(data: ContractTemplate) {
    const cancelDialogRef = this.dialog.open(DialogDeactivateTemplateComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '40%',
      height: '30%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contractService.deActivateClauseTemplate(data.contractTemplateId).subscribe((res: any) => {
          if (res) {
            this.adminService.showMessage(data.templateId + ' DeActivated sucessfully');
            this.getClassTemplateList();
          }
        });
      } else {
        this.dialog.closeAll();
      }
    });
  }
  viewWorkFlow(template: ContractTemplate) {
    const initWorkFlow = this.dialog.open(DialogViewWorkflowComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
    initWorkFlow.componentInstance.contractTemplateId = template.contractTemplateId;
  }
  ngOnDestroy(): void {
    this.commonService.wfPrimaryKeyId = 0;
    this.commonService.isFromWorkFlow = false;
    this.commonService.userComment = null;
  }
}
