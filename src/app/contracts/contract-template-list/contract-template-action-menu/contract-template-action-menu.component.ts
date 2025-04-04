import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ContractTemplateListComponent } from '../contract-template-list.component';
import { ICellRendererParams } from 'ag-grid-community';
import { ContractTemplate } from '../../../core/models/contract-template.model';

@Component({
  selector: 'app-contract-template-action-menu',
  standalone: true,
  templateUrl: './contract-template-action-menu.component.html',
  styleUrl: './contract-template-action-menu.component.scss',
  imports: [MatMenuTrigger, MatIconModule, MatMenu, MatMenuItem]
})
export class ContractTemplateActionMenuComponent implements ICellRendererAngularComp {
  params: any;
  element: ContractTemplate = new ContractTemplate();
  constructor(
    private contractTemplate: ContractTemplateListComponent
  ) {
  }
  agInit(params: any): void {
    this.params = params;
    this.element = params.node.data;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true
  }
  viewOrEditTemplate(data: ContractTemplate) {
    this.contractTemplate.viewOrEditTemplate(data);
  }
  deactivateTemplate(data: ContractTemplate) {
    this.contractTemplate.deactivateTemplate(data);
  }
  copyTemplate(data: ContractTemplate) {
    this.contractTemplate.copyTemplate(data);
  }
  viewWorkFlow(data: ContractTemplate) {
    this.contractTemplate.viewWorkFlow(data);
  }
}
