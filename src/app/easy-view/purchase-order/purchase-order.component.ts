import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ICellRendererParams, themeBalham } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [MatButtonModule, AgGridAngular,],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss'
})
export class PurchaseOrderComponent { 

   
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
 
  colDefs: ColDef[] = [
      { 
        field: "refno", maxWidth: 100,
        // headerName: 'Order Date', maxWidth: 13,  
        headerName :'Ref #', filter:false, floatingFilter: false,
        cellRenderer: (params: ICellRendererParams) => {
          params.data    // here the data is the row object you need
          return `<a href=#test">${params.value}</a>`;
       }
          
      },
        { 
          field: "orderdate", maxWidth: 100,
          // headerName: 'Order Date', maxWidth: 13,  
          headerName :'Order Date', filter:false, floatingFilter: false,
        },
        { 
          field: "shortname", 
          headerName: 'Short Name', maxWidth: 200, filter:false, floatingFilter: false, },
        { 
          field: "createddate", 
          headerName: 'Created Date', maxWidth: 150, filter:false, floatingFilter: false, },
        { 
          field: "Issueddate", 
          headerName: 'Issued Date', maxWidth: 150 , filter:false, floatingFilter: false, },
        { 
          field: "currency", 
          headerName: 'Currency', maxWidth: 180 ,filter:false, floatingFilter: false, },
        { 
          field: "netamount", 
          headerName: 'Net Amount' , filter:false, floatingFilter: false, 
          cellStyle: {textAlign: 'right'},
        },
        { 
          field: "status", 
          headerName: 'Status' , filter:false, floatingFilter: false,}, 
        {
          field: "action", 
          headerName: "Action", maxWidth: 120, filter:false, floatingFilter: false, 
          cellStyle: {textAlign: 'center'},
          // tooltipField: 'tere'
          cellRenderer: (params: ICellRendererParams) => {
            return `
            <a title="View">
              <span class="material-icons-outlined blue pe-1">visibility</span>            
            </a>
            <a title="Download">
              <span class="material-icons-outlined blue pe-1">browser_updated</span>            
            </a>
            <a  title="verified">
              <span class="material-icons-outlined blue">verified</span>            
            </a>
            `;
          },  
        },
      ];
      rowData = [
        { 
          refno: "PO-112",
          orderdate: "20-12-2024", 
          shortname: "Purchase for desktop", 
          createddate: '13-12-2024', 
          Issueddate: '26-12-2024', 
          currency: 'USD - $',
          netamount:'100000.00', 
          status:'PO Approved', 
          action: '',

        }, 
      ];
}
