import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ICellRendererParams, ModuleRegistry, themeBalham } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule, AgGridAngular],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss'
})
export class ContractComponent {

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
  headerName :'Ref #', filter:false, floatingFilter: false,
  cellRenderer: (params: ICellRendererParams) => {
    params.data    // here the data is the row object you need
    return `<a href=#test">${params.value}</a>`;
  }
},
// {
//   field: "eventtype",  maxWidth: 200,
//   headerName:"Event Type",
// },
{ 
  field: "shortname", 
  headerName: 'Short Name', maxWidth: 320, //filter:false, floatingFilter: false, 
},
{ 
  field: "createddate", maxWidth: 150, 
  headerName :'Created Date', //filter:false, floatingFilter: false,
},
{ 
  field: "expirydate", maxWidth: 150, 
  headerName :'Expiry Date', //filter:false, floatingFilter: false,
},
{ 
  field: "currency", maxWidth: 180,
  headerName :'Currency', // filter:false, floatingFilter: false,
  
},      
{ 
  field: "netamount", maxWidth: 180,
  headerName :'	Net Amount', // filter:false, floatingFilter: false,
  cellClass: "text-end"
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
    <a title="View" >
      <span class="material-icons-outlined blue pe-1">verified</span>      
    </a>   
    `;
  },  
},
      ];
      rowData = [
        { 
          refno: "CN/0044", 
          shortname: "Purchase for desktop",
          createddate: "20-12-2024", 
          expirydate: "20-12-2024", 
          currency: "INR - ",            
          netamount: '12,000.00', 
          status:'Contract Signed Off', 
          action: '',

        }, 
        { 
          refno: "CN/0056", 
          shortname: "	Purcahse of Amoled Display",
          createddate: "20-12-2024", 
          expirydate: "20-12-2024", 
          currency: "USD - $",            
          netamount: '15,000.00',    
          status:'Contract Signed Off', 
          action: '',

        }, 
      ];
}
