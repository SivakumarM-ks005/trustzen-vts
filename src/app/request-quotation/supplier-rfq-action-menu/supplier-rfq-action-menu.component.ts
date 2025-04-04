import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ICellRendererParams } from 'node_modules/ag-grid-community/dist/types/src/rendering/cellRenderers/iCellRenderer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-supplier-rfq-action-menu',
  standalone: true,
  imports: [MatMenuTrigger, MatIconModule, MatMenu,RouterLink, MatMenuItem],
  templateUrl: './supplier-rfq-action-menu.component.html',
  styleUrl: './supplier-rfq-action-menu.component.scss'
})
export class SupplierRfqActionMenuComponent {
  params: any;
 
  constructor(
   
  ) {
  }
  agInit(params: any): void {
    this.params = params;
 
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true
  }

  onButtonClick(action: string){
    if(this.params && this.params.data){
      this.params.context.componentParent.onActionClick(action, this.params.data);
    }
  }
  
}
