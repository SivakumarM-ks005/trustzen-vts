import { Component, ViewChild } from '@angular/core';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';

export interface PeriodicElement {
  name: string;
  roles: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {roles: 'Co-ordinator', name: 'Christopher'},
];
@Component({
    selector: 'app-roles-responsibilities',
    templateUrl: './roles-responsibilities.component.html',
    styleUrl: './roles-responsibilities.component.scss',
    standalone: true,
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatFormField, MatSelect, MatTooltip, MatOption, MatCheckbox, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})

export class RolesResponsibilitiesComponent {
  displayedColumns: string[] = ['roles', 'name', 'milestoneSignatory', 'invoiceApprover','action'];
  dataSource = [...ELEMENT_DATA];

  @ViewChild(MatTable) table: MatTable<PeriodicElement>;

  addData() {
    const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    this.dataSource.push(ELEMENT_DATA[randomElementIndex]);
    this.table.renderRows();
  }

  removeData() {
    this.dataSource.pop();
    this.table.renderRows();
  }
}
