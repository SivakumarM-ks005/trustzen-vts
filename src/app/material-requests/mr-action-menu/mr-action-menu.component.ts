import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ICellRendererParams } from 'node_modules/ag-grid-community/dist/types/src/rendering/cellRenderers/iCellRenderer';
@Component({
  selector: 'app-mr-action-menu',
  standalone: true,
  imports: [MatMenuTrigger, MatIconModule, MatMenu, MatMenuItem,],
  templateUrl: './mr-action-menu.component.html',
  styleUrl: './mr-action-menu.component.scss'
})
export class MrActionMenuComponent {
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
