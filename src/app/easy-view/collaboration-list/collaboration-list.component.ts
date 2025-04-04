import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ICellRendererParams, themeBalham } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-collaboration-list',
  standalone: true,
  imports: [AgGridAngular, MatButtonModule],
  templateUrl: './collaboration-list.component.html',
  styleUrl: './collaboration-list.component.scss'
})
export class CollaborationListComponent {
 
 
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
        field: "refno",     maxWidth: 80,         // headerName: 'Order Date', 
        headerName :'Ref #', filter:false, floatingFilter: false,
        cellRenderer: (params: ICellRendererParams) => {
          params.data    // here the data is the row object you need
          return `<a href=#test">${params.value}</a>`;
        }
        
      },
        { 
          field: "type", maxWidth: 200,          // headerName: 'Order Date', 
          headerName :'Type', filter:false, floatingFilter: false,
        },
        { 
          field: "createddate", 
          headerName: 'Created Date', filter:false, floatingFilter: false, },
        { 
          field: "subjectpurpose", 
          headerName: 'Subject / Purpose',  filter:false, floatingFilter: false, },
        { 
          field: "sentdate", 
          headerName: 'Sent Date', filter:false, floatingFilter: false, },
        { 
          field: "visionno", 
          headerName: 'Version #' , filter:false, floatingFilter: false,            // cellStyle: {textAlign: 'right'},
        },
        { 
          field: "status", 
          headerName: 'Status' , filter:false, floatingFilter: false, },
        {
          field: "action", 
          headerName: "Action", filter:false, floatingFilter: false, 
          cellStyle: {textAlign: 'center'},
          cellRenderer: (params: ICellRendererParams) => {
            return `
            <a title="View">
              <span class="material-icons-outlined blue pe-1">visibility</span>            
            </a>
            <a title="Download">
              <span class="material-icons-outlined blue pe-1">browser_updated</span>            
            </a>
            <a title="Verified">
              <span class="material-icons-outlined blue">verified</span>            
            </a>
            `;
          },  
        },
      ];
      rowData = [
        { 
          refno: "NOT-2",
          type: "Request", 
          createddate: '01-12-2025', 
          subjectpurpose: 'To participate in RFT', 
          sentdate: '10-12-2025',
          visionno:'1', 
          status:'Published', 
          action: '',

        }, 
      ];

}
