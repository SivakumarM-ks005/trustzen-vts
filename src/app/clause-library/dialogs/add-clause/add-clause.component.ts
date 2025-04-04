import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core'; 
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
    selector: 'app-add-clause',
    templateUrl: './add-clause.component.html',
    styleUrl: './add-clause.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, AgGridAngular, MatDialogActions, MatButton, TranslatePipe]
})
export class AddClauseComponent {
  rowSelection:any;
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector =[5,10, 25];
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
      ref: "Clause -001", 
      name: "Payment Schedule", 
      description: 'Defines when and how payments are made under the contract, including milestones or due dates.', 
      category: 'Financial Terms',
      type:'Payment Terms',
      contractclassification:'General',
      createdon:'14-Dec-2024',
      status:'Active'
    },
    { 
      ref: "Clause -002", 
      name: "Payment Schedule", 
      description: 'Defines when and how payments are made under the contract, including milestones or due dates.', 
      category: 'Financial Terms',
      type:'Payment Terms',
      contractclassification:'General',
      createdon:'14-Dec-2024',
      status:'Active'
    },
    { 
      ref: "Clause -003", 
      name: "Payment Schedule", 
      description: 'Defines when and how payments are made under the contract, including milestones or due dates.', 
      category: 'Financial Terms',
      type:'Payment Terms',
      contractclassification:'General',
      createdon:'14-Dec-2024',
      status:'Active'
    },
    { 
      ref: "Clause -004", 
      name: "Payment Schedule", 
      description: 'Defines when and how payments are made under the contract, including milestones or due dates.', 
      category: 'Financial Terms',
      type:'Payment Terms',
      contractclassification:'General',
      createdon:'14-Dec-2024',
      status:'Active'
    },
    { 
      ref: "Clause -005", 
      name: "Payment Schedule", 
      description: 'Defines when and how payments are made under the contract, including milestones or due dates.', 
      category: 'Financial Terms',
      type:'Payment Terms',
      contractclassification:'General',
      createdon:'14-Dec-2024',
      status:'Active'
    },
     { 
      ref: "Clause -005", 
      name: "Payment Schedule", 
      description: 'Defines when and how payments are made under the contract, including milestones or due dates.', 
      category: 'Financial Terms',
      type:'Payment Terms',
      contractclassification:'General',
      createdon:'14-Dec-2024',
      status:'Active'
    },
];

colDefs: ColDef[] = [
  { field: "ref",
    headerName :'Ref #',
    maxWidth:120,
    cellClass: 'cellCenter'
   
  },
  { field: "name",
    headerName :'Name'
  },
  { field: "description",
    headerName :'Description'
  },
  { field: "category",
    headerName :'Category'
  },
  { field: "type",
    headerName :'Type'
  },
  { field: "contractclassification",
    headerName :'Contract Classification',
    width:270,
  },
  { field: "createdon",
    headerName :'Created On',
    maxWidth:120,
  },
  { field: "status",
    headerName :'Status',
    maxWidth:120,
  }
];
}
