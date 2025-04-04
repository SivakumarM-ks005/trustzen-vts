import { Component, Inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef,ICellRendererParams } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core'; 
import { themeBalham } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-assigned-entities',
  standalone: true,
  imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, AgGridAngular, MatDialogActions, MatButton, TranslatePipe],
  templateUrl: './assigned-entities.component.html',
  styleUrl: './assigned-entities.component.scss'
})
export class AssignedEntitiesComponent {
rowSelection:any;
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector =[5,10, 25];
  public theme = themeBalham;
  constructor(@Inject(MAT_DIALOG_DATA) private data : any){
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
  rowData = [];

  colDefs: ColDef[] = [
    {
      headerName: 'Serial #',
      maxWidth: 120,
      cellClass: 'cellCenter',
      valueGetter: "node.rowIndex + 1"
    },
    {
      field: "entityId",
      headerName: 'Entity Code',
      filter: true,
      floatingFilter: true,
      cellRenderer: (params:any) => params.value ? params.value : "N/A",
    },
    {
      field: "entityName",
      headerName: 'Entity Name',
      filter: true,
      floatingFilter: true,
      cellRenderer: (params:any) => params.value ? params.value : "N/A",
    },
    {
      field: "status",
      headerName: 'Termination Status',
      cellRenderer: (params:any) => params.value ? params.value : "N/A",
    }
  ];

  ngOnInit(){
    this.rowData = this.data;
  }
}
