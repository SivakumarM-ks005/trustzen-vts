import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ICellRendererParams } from 'node_modules/ag-grid-community/dist/types/src/rendering/cellRenderers/iCellRenderer';

@Component({
  selector: 'app-item-master-action',
  standalone: true,
  imports: [MatMenuTrigger, MatIconModule, MatMenu, MatMenuItem],
  templateUrl: './item-master-action.component.html',
  styleUrl: './item-master-action.component.scss'
})
export class ItemMasterActionComponent {
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
