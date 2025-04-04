import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { WorkflowHistoryComponent } from '../../reusable/workflow-history/workflow-history.component';
import { Router, RouterLink } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef,ICellRendererParams } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { themeBalham } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-post-tender-queries',
  standalone: true,
  imports: [
    MatTooltip,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatInput,
    MatDatepickerInput, MatDatepickerToggle, MatDatepicker,AgGridAngular
  ],
  templateUrl: './post-tender-queries.component.html',
  styleUrl: './post-tender-queries.component.scss'
})
export class PostTenderQueriesComponent {
rowSelection:any;
  actionMenu: any;
  domWidth=100;
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
      ptc: "R-283", 
      questionno: 'Q10', 
      response: 'Rep01',
      evaluatorName:'Gopal',
      category:'RFT',
      docref:'Test',
      question:'PR Approved',
      attachment:'RFT',
      SupplierName:'Karthick',
      requestDate:'PR Approved',
      PublishDate:'10-02-2025',
      Publishedby:'Karthick',
      Status:'PR Approved'
    }
];

colDefs: ColDef[] = [
  { field: "ref",
    headerName :'Ref #',
    maxWidth:70,
    cellClass: 'cellCenter'
   
  },
  { field: "ptc",
    headerName :'PTC #'
  },
  { field: "questionno",
    headerName :'Quetion #'
  },
  { field: "response",
    headerName :'Response #'
  },
  { field: "evaluatorName",
    headerName :'Evaluator Name'
  },
  { field: "category",
    headerName :'Category',
    width:270,
  },
  { field: "docref",
    headerName :'Document Reference',
    maxWidth:120,
  },
  { field: "question",
    headerName :'Question',
    maxWidth:120,
  },
  { field: "attachment",
    headerName :'Attachment',
    maxWidth:120,
  },
  { field: "SupplierName",
    headerName :'Supplier Name',
    maxWidth:120,
  },
  { field: "requestDate",
    headerName :'Request Date',
    maxWidth:120,
  },
  { field: "PublishDate",
    headerName :'publishDate',
    maxWidth:120,
  },
  { field: "Publishedby",
    headerName :'Published By',
    maxWidth:120,
  },
  { field: "Status",
    headerName :'Status',
    maxWidth:120,
  }
];
}
