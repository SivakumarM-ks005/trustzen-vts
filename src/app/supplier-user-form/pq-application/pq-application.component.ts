import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatFormFieldModule, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { CommonService } from '../../core/services/common.service';
import { Router } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgIf } from '@angular/common';
import { AllCommunityModule, ColDef, GridApi, ModuleRegistry, SelectionChangedEvent } from 'ag-grid-community';
import { GirdActionMenuComponent } from '../../reusable/gird-action-menu/gird-action-menu.component';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { SupplierDirectoryActionComponent } from '../../reusable/supplier-directory-action/supplier-directory-action.component';
import moment from 'moment';
import { themeBalham } from 'ag-grid-community';
import { SupplierUserFormService } from '@app/core/services/supplier-management/supplier.user.form.service';
export interface PeriodicElement {
  application: string;
  supplierName: string;
  commercialLicence: string;
  modifiedDate: string;
  approvedDate: string;
  submittedDate: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { application: 'FY2023/42', supplierName: 'Buld Max ', commercialLicence: 'BMT 123454', modifiedDate: '27-Oct-2024', approvedDate: '29-Oct-2024', submittedDate: '29-Oct-2024', status: 'Review in progress' },
  { application: 'FY2023/42', supplierName: 'Buld Max ', commercialLicence: 'BMT 123454', modifiedDate: '27-Oct-2024', approvedDate: '29-Oct-2024', submittedDate: '29-Oct-2024', status: 'Review in progress' },
  { application: 'FY2023/42', supplierName: 'Buld Max ', commercialLicence: 'BMT 123454', modifiedDate: '27-Oct-2024', approvedDate: '29-Oct-2024', submittedDate: '29-Oct-2024', status: 'Review in progress' },
  { application: 'FY2023/42', supplierName: 'Buld Max ', commercialLicence: 'BMT 123454', modifiedDate: '27-Oct-2024', approvedDate: '29-Oct-2024', submittedDate: '29-Oct-2024', status: 'Review in progress' },
  { application: 'FY2023/42', supplierName: 'Buld Max ', commercialLicence: 'BMT 123454', modifiedDate: '27-Oct-2024', approvedDate: '29-Oct-2024', submittedDate: '29-Oct-2024', status: 'Review in progress' },
  { application: 'FY2023/42', supplierName: 'Buld Max ', commercialLicence: 'BMT 123454', modifiedDate: '27-Oct-2024', approvedDate: '29-Oct-2024', submittedDate: '29-Oct-2024', status: 'Review in progress' },
  { application: 'FY2023/42', supplierName: 'Buld Max ', commercialLicence: 'BMT 123454', modifiedDate: '27-Oct-2024', approvedDate: '29-Oct-2024', submittedDate: '29-Oct-2024', status: 'Review in progress' },
  { application: 'FY2023/42', supplierName: 'Buld Max ', commercialLicence: 'BMT 123454', modifiedDate: '27-Oct-2024', approvedDate: '29-Oct-2024', submittedDate: '29-Oct-2024', status: 'Review in progress' },
  { application: 'FY2023/42', supplierName: 'Buld Max ', commercialLicence: 'BMT 123454', modifiedDate: '27-Oct-2024', approvedDate: '29-Oct-2024', submittedDate: '29-Oct-2024', status: 'Review in progress' },

];
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-pq-application',
  templateUrl: './pq-application.component.html',
  styleUrl: './pq-application.component.scss',
  standalone: true,
  imports: [
    MatCheckboxModule, FormsModule, AgGridModule]
})

export class PqApplicationComponent implements OnInit {
  userName: string;
  displayedColumns: string[] = ['application', 'supplierName', 'commercialLicence', 'submittedDate', 'modifiedDate', 'approvedDate', 'status', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  supplier: any;

  public theme = themeBalham;
  private gridApi: GridApi;
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 10;
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
  SupplierManagement: any;


  constructor(
    public commonService: CommonService,
    private router: Router,
    public SupplierUserForm:SupplierUserFormService
  ) {


  }
  ngOnInit(): void {
    this.initColumns();
    this.loadSupplier();
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadSupplier(): void {
    this.commonService.GetSuppliersDirectory().subscribe({
      next: (data) => {

        data.forEach((supplier: {
          approveddate: string;
          modifiedDate: string | number | Date;
          status: any;
          password: any;
          supplierRefNo: any; supplierId: string; submittedDate: string | number | Date;
        }) => {
          supplier.submittedDate = moment(new Date(supplier.submittedDate)).format(this.commonService.showFormat.toUpperCase());
          supplier.modifiedDate = moment(new Date(supplier.modifiedDate)).format(this.commonService.showFormat.toUpperCase());
          supplier.approveddate = moment(new Date(supplier.approveddate)).format(this.commonService.showFormat.toUpperCase());
        });
        this.supplier = data;
        this.rowCount = data.length;

        this.dataList = data.reverse();
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  pqassesment(supplier: any, redirectTo: string) {
    this.commonService.isfromDashboard = true;
    this.commonService.SupplierId = supplier?.supplierId;
    localStorage.setItem('userId', supplier?.userId);
    if (redirectTo === "view/edit") {

      this.router.navigate([`/krya/dashboardSupReg/id/${supplier?.supplierId}/${supplier?.status}`], { skipLocationChange: true, replaceUrl: true })
    } else {

      this.router.navigate([`/krya/dashboardSupTer/id/${supplier?.supplierId}`], { skipLocationChange: true, replaceUrl: true })
    }
  }

  initColumns() {
    this.colDefs = [
      { field: "application", headerName: 'Application #', maxWidth: 120, },
      { field: "supplierName", headerName: 'Supplier Name' },
      { field: "commercialLicence", headerName: (this.SupplierManagement?.complianceRenewalBank?.captureBusinessLicenses && this.SupplierManagement?.licenseCertificate?.length > 0) ? this.SupplierManagement?.licenseCertificate[0]?.displayLabel : "Commercial License #" },
      { field: "submittedDate", headerName: 'Submitted Date' },
      { field: "modifiedDate", headerName: 'Modified Date' },
      { field: "approveddate", headerName: 'Approved date', width: 270, },
      { field: "status", headerName: 'Status', maxWidth: 120, },
      // {headerName: 'Athlete', field: 'athlete', editable: true, width: 150, 
      // cellRenderer: function(params){ return '<span style="font-weight: bold;">'+params.value+'</span>'}},
      {
        headerName: "Action", maxWidth: 120,
        cellRenderer:
          SupplierDirectoryActionComponent,
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

  GetSupplierManagement() {
    this.SupplierUserForm.GetSupplierManagement().subscribe(res => {
      if (res) {
        this.SupplierManagement = res;
      }
    })
  }

}
