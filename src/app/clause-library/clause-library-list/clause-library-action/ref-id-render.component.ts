import { Component } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { ClauseLibraryListComponent } from '../clause-library-list.component';

@Component({
    standalone: true,
    template: `<a (click)="goToComponent()"
                    style="color: #5e72e4; cursor: pointer;">{{parsedValue}}</a> `

})
export class RefIdRenderer implements ICellRendererAngularComp {
    public value!: string;
    public parsedValue!: string;
    rowData: any;
    constructor(private clauseLibrary: ClauseLibraryListComponent) { }
    agInit(params: ICellRendererParams): void {
        this.rowData = params.data;
        this.refresh(params);
    }

    refresh(params: ICellRendererParams): boolean {
        this.value = params.value;
        this.parsedValue = this.value;
        return true;
    }

    goToComponent() {
        this.clauseLibrary.editClause(this.rowData);
    }
}