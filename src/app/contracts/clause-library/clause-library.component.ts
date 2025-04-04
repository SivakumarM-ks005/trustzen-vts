import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogClauseLibraryComponent } from '../dialog/dialog-clause-library/dialog-clause-library.component';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-clause-library',
    templateUrl: './clause-library.component.html',
    styleUrl: './clause-library.component.scss',
    standalone: true,
    imports: [MatButton, MatTooltip, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatFormField, MatInput, MatMenuTrigger, MatMenu, MatMenuItem, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator]
})

export class ClauseLibraryComponent {
  displayedColumns: string[] = ['templateId', 'clauseName', 'description', 'categoryName', 'typeName', 'contractClassification', 'createdDate', 'status', 'action'];
  displayedColumnsFilter: string[] = ['f-templateId', 'f-clauseName', 'f-description', 'f-categoryName', 'f-typeName', 'f-contractClassification', 'f-createdDate'];
  dataSource = ELEMENT_DATA;
  addClauseDialog: MatDialogRef<DialogClauseLibraryComponent>;
  dataList : ClauseLibrary[] = new Array<ClauseLibrary>();

  constructor(public dialog: MatDialog) { }

  addNewClause() {
    this.addClauseDialog = this.dialog.open(DialogClauseLibraryComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '100%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
    this.addClauseDialog.componentInstance.refId = 'Clause-' + (this.dataList.length + 1);
  }
}

export interface TemplateList {
  templateId: string;
  clauseName: string;
  description: string;
  categoryName: string;
  typeName: string;
  contractClassification: string;
  createdDate: string;
  status: string;
}

export class ClauseLibrary {
  refId: string;
  clauseName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  typeId: number;
  typeName: string;
  contractClassification: any[] = [];
  htmlContent: string;
  tagValue: string;
  createdDate: string;
  status: string;
}

const ELEMENT_DATA: TemplateList[] = [
  { templateId: 'Clause-2060', clauseName: 'Payment Schedule', description: 'TEST SK CLAUSE', typeName: 'Arbitration', contractClassification: 'General', createdDate: '07-JAN-2025', categoryName: 'Info com', status: 'Active' },
  { templateId: 'Clause-2060', clauseName: 'Performance Standards', description: 'TEST SK CLAUSE', typeName: 'Arbitration', contractClassification: 'General', createdDate: '07-JAN-2025', categoryName: 'CTS', status: 'Active' },
  { templateId: 'Clause-2060', clauseName: 'Termination for Cause', description: 'TEST SK CLAUSE', typeName: 'Arbitration', contractClassification: 'General', createdDate: '07-JAN-2025', categoryName: 'TCS', status: 'Active' },
  { templateId: 'Clause-2060', clauseName: 'Arbitration Clause', description: 'TEST SK CLAUSE', typeName: 'Arbitration', contractClassification: 'General', createdDate: '07-JAN-2025', categoryName: 'SSV', status: 'Active' },
  { templateId: 'Clause-2060', clauseName: 'Insurance Clause', description: 'TEST SK CLAUSE', typeName: 'Arbitration', contractClassification: 'General', createdDate: '07-JAN-2025', categoryName: 'MG', status: 'Active' },
  { templateId: 'Clause-2060', clauseName: 'Data Protection Agreement', description: 'TEST SK CLAUSE', typeName: 'Arbitration', contractClassification: 'General', createdDate: '07-JAN-2025', categoryName: 'Maruthi', status: 'Active' },
];

