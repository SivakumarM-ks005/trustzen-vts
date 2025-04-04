import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core'; 
import { themeBalham } from 'ag-grid-community';
import { Router, RouterLink } from '@angular/router'; 
import { PurchaseorderlistActionmenuComponent } from './purchaseorderlist-actionmenu/purchaseorderlist-actionmenu.component';
import { SupplierPolistActionmenuComponent } from '@app/purchaseorder-supplier-form/supplier-polist-actionmenu/supplier-polist-actionmenu.component';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [AgGridAngular,RouterLink],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss'
})
export class PurchaseOrderComponent {
rowSelection:any;
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector =[5,10, 25];
  public theme = themeBalham;
  constructor(){
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


    colDefs: ColDef[] = [

      { 
        field: "serial",
        headerName :'Serial #',  filter: false, sortable: false,
        maxWidth:70,
        cellClass: 'cellCenter'       
      },
      { 
        field: "ref",
        headerName :'Ref #',
        maxWidth:70,
        cellClass: 'cellCenter'       
      },
      { field: "shortname",
        headerName :'Short Name'
      },
      { field: "sourcedocref",
        headerName :'Source Doc Ref #'
      },
      { field: "ordertype",
        headerName :'Order Type'
      },
      { field: "orderclassification",
        minWidth:170,
        headerName :'Order Classification'
      },
      { field: "created",
        headerName :'Created',
        width:270,
      },
      { field: "approved",
        headerName :'Approved',
        width:270,
      },
      { field: "createdby",
        headerName :'Created By',
        maxWidth:120,
      },
      { field: "status",
        headerName :'Status',
        maxWidth:120,
      },
      {  headerName: "Action", maxWidth: 80,
         cellRenderer: PurchaseorderlistActionmenuComponent, filter: false, sortable: false
      }, 
    ];
    
  rowData = [
    { 
      serial: "1", 
      ref: "PO-101", 
      shortname: "Harware Supplies", 
      sourcedocref: '556525653', 
      ordertype: 'Local PO',
      orderclassification:'General',
      created:'15-Jan-2025',
      approved:'16-Jan-2025',
      createdby: 'Chritiana Mose',
      status:'WF - Initiated'
    },
    { 
      serial: "2", 
      ref: "PO-102", 
      shortname: "Pantry Supplies", 
      sourcedocref: '458335569', 
      ordertype: 'Contract Linked PO',
      orderclassification:'MRA-Material QB',
      created:'25-Jan-2025',
      approved: '29-Jan-2025',
      createdby: 'Petter L Lorry',
      status:'WF - Approved'
    },
    { 
      serial: "3", 
      ref: "PO-103", 
      shortname: "Stationery Supplies", 
      sourcedocref: '125689756', 
      ordertype: 'Blanket PO',
      orderclassification:'MRA-Material VB',
      created:'02-JFeban-2025',
      approved: '22-Deb-2025',
      createdby: 'Selvakumar Raja',
      status:'PO Issued'
    }
   
  ];

// For Supplier PO list 

SuppliercolDefs: ColDef[] = [

  { 
    field: "supplierserial",
    headerName :'Serial #',  filter: false, sortable: false,
    maxWidth:70,
    cellClass: 'cellCenter'       
  },
  { 
    field: "supplierref",
    headerName :'Ref #',
    maxWidth:70,
    cellClass: 'cellCenter'       
  },
  { field: "suppliershortname",
    headerName :'Short Name'
  },
  { field: "suppliersourcedocref",
    headerName :'Source Doc Ref #'
  },
  { field: "supplierordertype",
    headerName :'Order Type'
  },
  { field: "supplierorderclassification",
    minWidth:170,
    headerName :'Order Classification'
  },
  { field: "suppliercreated",
    headerName :'Created',
    width:270,
  },
  { field: "supplierapproved",
    headerName :'Approved',
    width:270,
  },
  { field: "suppliercreatedby",
    headerName :'Created By',
    maxWidth:120,
  },
  { field: "supplierstatus",
    headerName :'Status',
    maxWidth:120,
  }, 
  {  headerName: "Action", maxWidth: 80,
    cellRenderer: SupplierPolistActionmenuComponent, filter: false, sortable: false
 },
];
SupplierrowData = [
  { 
    supplierserial: "1", 
    supplierref: "PO-235", 
    suppliershortname: "Harware Supplies", 
    suppliersourcedocref: '556525653', 
    supplierordertype: 'Local PO',
    supplierorderclassification:'General',
    suppliercreated:'15-Jan-2025',
    supplierapproved:'16-Jan-2025',
    suppliercreatedby: 'Chritiana Mose',
    supplierstatus:'PO Issued'
  },
  { 
    supplierserial: "2", 
    supplierref: "PO-252", 
    suppliershortname: "Pantry Supplies", 
    suppliersourcedocref: '458335569', 
    supplierordertype: 'Contract Linked PO',
    supplierorderclassification:'MRA-Material QB',
    suppliercreated:'25-Jan-2025',
    supplierapproved: '29-Jan-2025',
    suppliercreatedby: 'Petter L Lorry',
    supplierstatus:'PO Accepted'
  },
  { 
    supplierserial: "3", 
    supplierref: "PO-335", 
    suppliershortname: "Stationery Supplies", 
    suppliersourcedocref: '125689756', 
    supplierordertype: 'Blanket PO',
    supplierorderclassification:'MRA-Material VB',
    suppliercreated:'02-JFeban-2025',
    supplierapproved: '22-Deb-2025',
    suppliercreatedby: 'Selvakumar Raja',
    supplierstatus:'PO Not Accepted'
  }
 
];

}
