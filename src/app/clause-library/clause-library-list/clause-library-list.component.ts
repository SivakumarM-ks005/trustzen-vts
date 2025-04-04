import { Component, OnInit } from '@angular/core';
import type { ColDef, GridApi, RowClassRules, SelectionChangedEvent } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { GirdActionMenuComponent } from '../../reusable/gird-action-menu/gird-action-menu.component';
import { NewClauseLibraryComponent } from '../dialogs/new-clause-library/new-clause-library.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClauseLibrary } from '../../core/models/contract-clause.model';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import { ContractService } from '../../core/services/contract-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClauseLibraryActionComponent } from './clause-library-action/clause-library-action.component';
import { DeleteClauseComponent } from '../dialogs/delete-clause/delete-clause.component';
import { RefIdRenderer } from './clause-library-action/ref-id-render.component';
import { themeBalham } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-clause-library-list',
  templateUrl: './clause-library-list.component.html',
  styleUrl: './clause-library-list.component.scss',
  standalone: true,
  imports: [MatTooltip, AgGridAngular, MatCheckboxModule, FormsModule]
})
export class ClauseLibraryListComponent implements OnInit, ICellRendererAngularComp {
  private gridApi: GridApi;
  public theme = themeBalham;
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 25, 50];
  defaultColDef: ColDef = {

    flex: 1,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }
  colDefs: ColDef[] = [];
  addClauseDialog: MatDialogRef<NewClauseLibraryComponent>;
  dataList: ClauseLibrary[] = new Array<ClauseLibrary>();
  params: any;
  modalConfig = {
    disableClose: true,
    hasBackdrop: true,
    backdropClass: '',
    autoFocus: true,
    width: '85%',
    height: '80%',
    position: {
      top: 'calc(3vw + 20px)',
      bottom: '',
      left: '',
      right: ''
    },
    panelClass: 'popUpMiddle',
  }
  userId: number;
  showInActive: boolean = false;
  // rowClassRules: RowClassRules = {
  //   "legend-gray": (params) => {
  //     return params.data.status === 'InActive'
  //   }
  // };
  rowCount: number = 0;
  constructor(private dialog: MatDialog,
    private contractService: ContractService,
    private adminService: AdminService,
    public commonService: CommonService,
  ) {

    // this.actionMenu = GirdActionMenuComponent;

  }
  agInit(params: any): void {
    this.params = params;
  }
  refresh(params: any): boolean {
    return true
  }
  ngOnInit(): void {
    let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
    this.userId = loggedUserDetails.userId;
    this.initColumns();
    this.getClauseLibraryList();
  }
  initColumns() {
    this.colDefs = [
      //  { maxWidth: 50, filter: false, sortable: false, cellRenderer: ClauseLibraryActionComponent, },
      { field: "refId", headerName: 'Ref #', maxWidth: 120, cellRenderer: RefIdRenderer },
      { field: "clauseName", headerName: 'Name' },
      { field: "description", headerName: 'Description' },
      { field: "categoryName", headerName: 'Category' },
      { field: "typeName", headerName: 'Type' },
      { field: "classificationShow", headerName: 'Contract Classification', width: 270, },
      { field: "createdDate", headerName: 'Created On', maxWidth: 120, },
      {
        field: "status", headerName: 'Status', maxWidth: 120,
        // cellClassRules: {
        //   'rag-green': params => params.value === 'Active',
        // }
      },
      {
        headerName: "Action", maxWidth: 120,
        cellRenderer: ClauseLibraryActionComponent, filter: false, sortable: false
      },
    ];
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  onSelectionChanged(event: SelectionChangedEvent) {
    const selectedData = this.gridApi.getSelectedRows();
  }
  getClauseLibraryList() {
    this.contractService.getClauseLibraryList()
      .subscribe({
        next: res => {
          res.forEach(item => {
            let classificationArray = JSON.parse(item.classificationStr);
            item.classificationShow = classificationArray.join(', ');
            item.createdDate = moment(new Date(item.created)).format(this.commonService.showFormat.toUpperCase())
          });
          this.rowCount = res.length;
          if (this.showInActive) {
            this.dataList = res.filter(x => x.status !== 'Active');;
          } else {
            this.dataList = res.filter(x => x.status === 'Active');
          }
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  addTags(data: any) {
    this.addClauseDialog = this.dialog.open(NewClauseLibraryComponent, this.modalConfig);
    this.addClauseDialog.componentInstance.isEditMode = true;
    this.addClauseDialog.componentInstance.isAddTag = true;
    this.addClauseDialog.componentInstance.dataValue = data;
    this.addClauseDialog.componentInstance.mode = 'addTag';
    this.addClauseDialog.afterClosed().subscribe(result => {
      if (result) {
        this.getClauseLibraryList();
      }
    });
  }
  showInActiveChange(event: MatCheckboxChange) {
    this.getClauseLibraryList();
  }
  editClause(data: any) {
    this.addClauseDialog = this.dialog.open(NewClauseLibraryComponent, this.modalConfig);
    // this.addClauseDialog.componentInstance.refId = data.refId;
    this.addClauseDialog.componentInstance.isEditMode = true;
    this.addClauseDialog.componentInstance.dataValue = data;
    this.addClauseDialog.componentInstance.mode = 'edit';
    this.addClauseDialog.afterClosed().subscribe(result => {
      if (result) {
        this.getClauseLibraryList();
      }
    });
  }
  newClause() {
    let modalConfig = Object.assign({}, this.modalConfig);
    modalConfig.height = '90%';
    this.addClauseDialog = this.dialog.open(NewClauseLibraryComponent, modalConfig);
    this.addClauseDialog.componentInstance.mode = 'add';
    this.addClauseDialog.componentInstance.refId = 'Clause-' + (this.rowCount + 1);
    this.addClauseDialog.afterClosed().subscribe(result => {
      if (result) {
        this.getClauseLibraryList();
      }
    });
  }
  deleteClauseLibrary(data: any) {
    let modalConfig = Object.assign({}, this.modalConfig);
    modalConfig.height = '50%';
    const deleteClause = this.dialog.open(DeleteClauseComponent, modalConfig);
    deleteClause.componentInstance.templateData = data;
    deleteClause.afterClosed().subscribe(result => {
      if (result) {
        this.contractService.deleteOrUndoClauseLibrary(
          data.clauseLibraryId,
          data.active,
          this.userId
        ).subscribe(res => {
          if (res) {
            this.adminService.showMessage('Ref# ' + data.refId + (data.active ? ' Removed sucessfully' : ' Undo delete sucessfully'));
            this.getClauseLibraryList();
          }
        });
      } else {
        this.dialog.closeAll();
      }
    });

  }
}
