import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventType } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ICellRendererParams, ModuleRegistry, themeBalham } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-sourcing-events',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, MatTooltipModule, AgGridAngular,],
  templateUrl: './sourcing-events.component.html',
  styleUrl: './sourcing-events.component.scss'
})
export class SourcingEventsComponent {
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
  field: "eventtype",  maxWidth: 200,
  headerName:"Event Type",
},
{ 
  field: "shortname", 
  headerName: 'Short Name', maxWidth: 220, //filter:false, floatingFilter: false, 
},
{ 
  field: "publdate", maxWidth: 200, 
  headerName :'Published  Date', //filter:false, floatingFilter: false,
},
{ 
  field: "querydate", maxWidth: 200, 
  headerName :'Query Date', //filter:false, floatingFilter: false,
},
{ 
  field: "submiduedate", maxWidth: 200,
  headerName :'Submission Due Date', // filter:false, floatingFilter: false,
},      
{ 
  field: "status", 
  headerName: 'Status' ,  maxWidth: 200,
}, 
{
  field: "action", 
  headerName: "Action", maxWidth: 100, filter:false, floatingFilter: false, 
  cellStyle: {textAlign: 'center'},
  cellRenderer: (params: ICellRendererParams) => {
    return `
    <a title="View" >
      <span class="material-icons-outlined blue pe-1">visibility</span>            
    </a>   
    `;
  },  
},
      ];
      rowData = [
        { 
          refno: "FY-2025-26",
          eventtype: "RFQ",
          shortname: "Purchase for desktop",
          publdate: "20-12-2024", 
          querydate: "20-12-2024", 
          submiduedate: "20-12-2024",            
          submissiondate: '13-12-2024', 
          status:'Submission Open', 
          action: '',

        }, 
        { 
          refno: "FY-2024-25",
          eventtype: "RFT",
          shortname: "	Purcahse of Amoled Display",
          publdate: "20-03-20245", 
          querydate: "20-12-2024", 
          submiduedate: "15-12-2025",            
          submissiondate: '13-03-2024',    
          status:'Submission Open', 
          action: '',

        }, 
      ];
}
