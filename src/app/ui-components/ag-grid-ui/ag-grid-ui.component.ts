import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef,ICellRendererParams } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core'; 
import { themeBalham } from 'ag-grid-community';
import {PrActionMenuComponent} from '../grid-action-menu/pr-action-menu.component'
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-ui',
  standalone: true,
  imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, AgGridAngular, MatDialogActions, MatButton, TranslatePipe],
  templateUrl: './ag-grid-ui.component.html',
  styleUrl: './ag-grid-ui.component.scss'
})
export class AgGridUiComponent {
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
  rowData = [
    { 
      ref: "PR-113", 
      Rfx: "R-283", 
      CreatedDate: '26-Nov-2025', 
      ApprovedDate: '29-Nov-2025',
      ShortName:'Computer Accessories',
      PurchaseCategory:'RFT',
      Buyer:'Karthick',
      Status:'PR Approved'
    },
    { 
      ref: "PR-114", 
      Rfx: "R-284", 
      CreatedDate: '26-Nov-2025', 
      ApprovedDate: '26-Dec-2025',
      ShortName:'Computer Accessories',
      PurchaseCategory:'RFT',
      Buyer:'Karthick',
      Status:'Initiated Workflow'
    },
    { 
      ref: "PR-115", 
      Rfx: "R-285", 
      CreatedDate: '01-Nov-2025', 
      ApprovedDate: '02-Dec-2025',
      ShortName:'Computer Accessories',
      PurchaseCategory:'RFQ',
      Buyer:'Karthick',
      Status:'Workflow Request for Information'
    },
   
];

colDefs: ColDef[] = [
  { field: "ref",
    headerName :'Ref #',
    maxWidth:70,
    cellClass: 'cellCenter'
   
  },
  { field: "Rfx",
    headerName :'Rfx Ref# '
  },
  { field: "CreatedDate",
    headerName :'Created Date'
  },
  { field: "ApprovedDate",
    headerName :'Approved Date'
  },
  { field: "ShortName",
    headerName :'Short Name'
  },
  { field: "PurchaseCategory",
    headerName :'Purchase Category',
    width:270,
  },
  { field: "Buyer",
    headerName :'Buyer',
    maxWidth:120,
  },
  { field: "Status",
    headerName :'Status',
    maxWidth:120,
  },
  {
          headerName: "Action", maxWidth: 120,
          cellRenderer: PrActionMenuComponent, filter: false, sortable: false
        },
        {
          field: "action", 
          headerName: "Action", filter:false, floatingFilter: false, 
          cellStyle: {textAlign: 'center'},
          cellRenderer: (params: ICellRendererParams) => {
            return `
            <a>
              <span class="material-icons-outlined blue pe-1">visibility</span>            
            </a>
            <a >
              <span class="material-icons-outlined blue pe-1">browser_updated</span>            
            </a>
            <a >
              <span class="material-icons-outlined blue">verified</span>            
            </a>
            `;
          },  
        }
];

// addSupplierPopup() {
//   this.dialog.open(this.addSupplier, {
//     disableClose: false,
//     hasBackdrop: true,
//     backdropClass: '',
//     autoFocus: true,
//     width: '65%',
//     height: '60%',
//     position: {
//       top: 'calc(3vw + 20px)',
//       bottom: '',
//       left: '',
//       right: ''
//     },
//     panelClass: 'popUpMiddle',
//   });
 
// }
}


