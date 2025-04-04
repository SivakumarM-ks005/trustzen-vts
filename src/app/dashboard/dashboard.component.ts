import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgIf, DatePipe } from '@angular/common';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatLabel, MatFormField } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { SupplierAttachmentService } from '../core/services/supplier-management/supplier-attachment.service';
import { AllCommunityModule, ColDef, GridApi, ModuleRegistry, RowClassRules, SelectionChangedEvent } from 'ag-grid-community';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewClauseLibraryComponent } from '../clause-library/dialogs/new-clause-library/new-clause-library.component';
import { ClauseLibrary } from '../core/models/contract-clause.model';
import { ContractService } from '../core/services/contract-service';
import { AdminService } from '../core/services/admin/admin.service';
import { GirdActionMenuComponent } from '../reusable/gird-action-menu/gird-action-menu.component';
import moment from 'moment';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AgGridModule, ICellRendererAngularComp } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { ClauseLibraryListComponent } from '../clause-library/clause-library-list/clause-library-list.component';
import { themeBalham } from 'ag-grid-community';
import { SupplierUserFormService } from '@app/core/services/supplier-management/supplier.user.form.service';
import { PowerBiReportsComponent } from '@app/power-bi-reports/power-bi-reports.component';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [NgIf, MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardActions, MatLabel, MatButton, MatTooltip, DatePipe,
    MatCheckboxModule, FormsModule, AgGridModule, PowerBiReportsComponent]
})

export class DashboardComponent implements OnInit {

  Allsupplier: any;
  SupplierId: number;
  loginData: any;
  SupDetails: any;
  displayedColumns: string[] = ['application', 'supplierName', 'commercialLicence', 'submittedDate', 'modifiedDate', 'approvedDate', 'status', 'action'];
  dataSource = new MatTableDataSource();
  displayedCols: string[] = ['application', 'supplierName', 'commercialLicence', 'Site No', 'Site Name', 'submittedDate', 'status', 'action'];
  dataSource1 = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pqAssesment: any;
  id: any;


  public theme = themeBalham;
  private gridApi: GridApi;

  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector = [5, 10, 25];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }
  colDefs: ColDef[] = [];
  dataList = [];
  params: any;
  modalConfig = {
    disableClose: true,
    hasBackdrop: true,
    backdropClass: '',
    autoFocus: true,
    width: '70%',
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
  getImplementationConfigDataRes: any;
  SupplierManagement: any;

  constructor(public commonService: CommonService,
    public router: Router, private supplierAttact: SupplierAttachmentService,
    private contractService: ContractService,
    private adminService: AdminService,
    private activateRouter: ActivatedRoute,
    public SupplierUserForm: SupplierUserFormService
  ) { }

  // agInit(params: any): void {
  //   this.params = params;
  // }
  // refresh(params: any): boolean {
  //   return true
  // }

  ngOnInit(): void {

    window.history.replaceState({}, '', '/ProcureZen');
    this.GetSupplierManagement();
    this.loginData = JSON.parse(localStorage.getItem('loginDetails')!);
    let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
    this.SupplierId = loggedUserDetails.supplierId;
    this.initColumns();
    this.loadSupplier();

    if (loggedUserDetails?.userType === 2) {
      this.getSupplierDetails();
      this.supplierAttact.GetSupplierPQAssessment(this.SupplierId).subscribe((res1: any) => {
        this.pqAssesment = res1.creditAssessment;
      })
    }

    this.userId = loggedUserDetails.userId;
    // this.getClauseLibraryList();

  }

  editClause(data: any) {

  }

  deleteClauseLibrary(data: any) {

  }

  addTags(data: any) {

  }

  loadSupplier(): void {
    this.commonService.GetSuppliers().subscribe({
      next: (data) => {

        data.forEach((supplier: {
          status: any;
          password: any;
          supplierRefNo: any; supplierId: string; submittedDate: string | number | Date;
        }) => {
          supplier.supplierRefNo = ` ${supplier?.supplierRefNo}`;
          supplier.password = 'N/A';
          supplier.submittedDate = moment(new Date(supplier.submittedDate)).format(this.commonService.showFormat.toUpperCase());
          if (supplier?.status === 3) {
            supplier.status = 'Qualified'
          } else if (supplier?.status === 4) {
            supplier.status = 'Reject'
          } else if (supplier?.status === 2) {
            supplier.status = 'Request for Information'
          } else if (supplier?.status === 1) {
            supplier.status = 'Review In Progress'
          }
        });

        if (this.loginData?.userType === 1) {
          this.Allsupplier = data;
          this.rowCount = data.length;

          this.dataList = data.reverse();

          this.id = localStorage.getItem('supId')
          // const supplierToUpdate = this.Allsupplier.find((supplier: { supplierId: number; }) => supplier.supplierId === JSON.parse(this.id));
          // if (supplierToUpdate) {
          //   // Update the status or any other field
          //   supplierToUpdate.supplierCompletedFlag = localStorage.getItem('status'); // Example status change
          // }

          this.dataSource.paginator = this.paginator;
        } else {
          this.Allsupplier = data.filter((datas: { supplierId: any; }) => datas.supplierId === this.loginData?.supplierId)
        }

      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }
  getSupplierDetails() {
    this.supplierAttact.getSupplierDetails(this.SupplierId).subscribe(res => {
      if (res) {
        this.SupDetails = res;
      }
    })
  }

  SupplierRegNavigate(status: any) {
    this.router.navigate([`/krya/dashboardSupReg/status/In-Progress`], { skipLocationChange: true, replaceUrl: true });
    // if(status === 1){
    //    this.router.navigate([`/krya/dashboardSupReg/status/In-Progress`]);
    // }else if(status === 2){
    //   this.router.navigate([`/krya/dashboardSupReg/status/Request for Information`]);
    // }else if(status === 3){
    //   this.router.navigate([`/krya/dashboardSupReg/status/Qualified`]);
    // }else if(status === 4){
    //   this.router.navigate([`/krya/dashboardSupReg/status/Reject`]);
    // }
  }

  SupplierEdit() {
    this.router.navigate([`/krya/dashboardSupReg/profile/manageprofile`], { skipLocationChange: true, replaceUrl: true })
  }

  pqassesment(supplier: any, redirectTo: string) {
    this.commonService.isfromDashboard = true;
    this.commonService.SupplierId = supplier?.supplierId;
    localStorage.setItem('userId', supplier?.userId);
    this.router.navigate([`/krya/dashboardSupReg/id/${supplier?.supplierId}/${supplier?.status}/`], { skipLocationChange: true, replaceUrl: true })
  }

  initColumns() {
    this.colDefs = [
      { field: "supplierRefNo", headerName: 'Application #', maxWidth: 120, },
      { field: "supplierName", headerName: 'Supplier Name' },
      { field: "tradeLicense", headerName: (this.SupplierManagement?.complianceRenewalBank?.captureBusinessLicenses && this.SupplierManagement?.licenseCertificate?.length > 0) ? this.SupplierManagement?.licenseCertificate[0]?.displayLabel : "Commercial License #" },
      { field: "submittedDate", headerName: 'Submitted Date' },
      { field: "password", headerName: 'Modified Date' },
      { field: "password", headerName: 'Approved date', width: 270, },
      { field: "status", headerName: 'Status', minWidth: 120, },
      // {headerName: 'Athlete', field: 'athlete', editable: true, width: 150, 
      // cellRenderer: function(params){ return '<span style="font-weight: bold;">'+params.value+'</span>'}},
      {
        headerName: "Action", maxWidth: 120,
        cellRenderer:
          GirdActionMenuComponent
        ,
        filter: false, sortable: false
      },
    ];
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  onSelectionChanged(event: SelectionChangedEvent) {
    const selectedData = this.gridApi.getSelectedRows();
  }
  // getClauseLibraryList() {
  //   this.contractService.getClauseLibraryList()
  //     .subscribe({
  //       next: res => {
  //         res.forEach(item => {
  //           let classificationArray = JSON.parse(item.classificationStr);
  //           item.classificationShow = classificationArray.join(', ');
  //           item.createdDate = moment(new Date(item.created)).format(this.commonService.showFormat.toUpperCase())
  //         });
  //         this.rowCount = res.length;

  //       }, error: error => this.adminService.showMessage(error),
  //       complete: () => { }
  //     });
  // }
  // addTags(data: any) {
  //   this.addClauseDialog = this.dialog.open(NewClauseLibraryComponent, this.modalConfig);
  //   this.addClauseDialog.componentInstance.isEditMode = true;
  //   this.addClauseDialog.componentInstance.isAddTag = true;
  //   this.addClauseDialog.componentInstance.dataValue = data;
  //   this.addClauseDialog.componentInstance.mode = 'addTag';
  //   this.addClauseDialog.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getClauseLibraryList();
  //     }
  //   });
  // }
  // showInActiveChange(event: MatCheckboxChange) {
  //   this.getClauseLibraryList();
  // }
  // editClause(data: any) {
  //   this.addClauseDialog = this.dialog.open(NewClauseLibraryComponent, this.modalConfig);
  //   // this.addClauseDialog.componentInstance.refId = data.refId;
  //   this.addClauseDialog.componentInstance.isEditMode = true;
  //   this.addClauseDialog.componentInstance.dataValue = data;
  //   this.addClauseDialog.componentInstance.mode = 'edit';
  //   this.addClauseDialog.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getClauseLibraryList();
  //     }
  //   });
  // }
  // newClause() {
  //   this.addClauseDialog = this.dialog.open(NewClauseLibraryComponent, this.modalConfig);
  //   this.addClauseDialog.componentInstance.mode = 'add';
  //   this.addClauseDialog.componentInstance.refId = 'Clause-' + (this.rowCount + 1);
  //   this.addClauseDialog.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getClauseLibraryList();
  //     }
  //   });
  // }
  // deleteClauseLibrary(data: any) {
  //   const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, this.commonService.deletetModalConfig);
  //   cancelDialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.contractService.deleteOrUndoClauseLibrary(
  //         data.clauseLibraryId,
  //         data.active,
  //         this.userId
  //       ).subscribe(res => {
  //         if (res) {
  //           this.adminService.showMessage('Ref# ' + data.refId + (data.active ? ' Removed sucessfully' : ' Undo delete sucessfully'));
  //           this.getClauseLibraryList();
  //         }
  //       });
  //     } else {
  //       this.dialog.closeAll();
  //     }
  //   });

  // }

  GetSupplierManagement() {
    this.SupplierUserForm.GetSupplierManagement().subscribe(res => {
      if (res) {
        this.SupplierManagement = res;
      }
    })
  }

}
