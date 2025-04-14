import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { MatTooltip } from '@angular/material/tooltip';
import { ContractTemplate } from '../../core/models/contract-template.model';
import { ContractService } from '../../core/services/contract-service';
import { ContractTemplateComponent } from "../contract-template/contract-template.component";
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';
import { ContractTemplateActionMenuComponent } from './contract-template-action-menu/contract-template-action-menu.component';
import { TemplateIdRenderer } from './contract-template-action-menu/template-id-render.component';
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
   ) {
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
           
          });
          this.templateData = res;
        },
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

  }
  viewWorkFlow(template: ContractTemplate) {


  }
  ngOnDestroy(): void {

  }
}
