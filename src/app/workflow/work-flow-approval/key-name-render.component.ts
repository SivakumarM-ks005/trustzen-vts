import { Component } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { WorkFlowApprovalComponent } from './work-flow-approval.component';

@Component({
    standalone: true,
    template: `<a (click)="goToComponent()"
                    style="color: #5e72e4; cursor: pointer;">{{parsedValue}}</a> `

})
// ` <a [href]="value" target="_blank">{{ parsedValue }}</a> `,
export class KeyNameRenderer implements ICellRendererAngularComp {
    public value!: string;
    public parsedValue!: string;
    rowData: any;
    // @ViewChild(WorkFlowApprovalComponent) wfComp: WorkFlowApprovalComponent;
    constructor(private wfComp: WorkFlowApprovalComponent){}
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
        this.wfComp.goToComponent(this.rowData);
    }
}