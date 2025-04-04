import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ICellRendererParams } from 'node_modules/ag-grid-community/dist/types/src/rendering/cellRenderers/iCellRenderer';

@Component({
  selector: 'app-pr-action-menu',
  standalone: true,
  imports: [MatMenuTrigger, MatIconModule, MatMenu, MatMenuItem],
  templateUrl: './pr-action-menu.component.html',
  styleUrl: './pr-action-menu.component.scss'
})
export class PrActionMenuComponent {
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
  
}
