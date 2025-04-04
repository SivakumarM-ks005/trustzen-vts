import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-purchaseorderlist-actionmenu',
  standalone: true,
  imports: [MatMenuTrigger, MatIconModule, MatMenu, MatMenuItem, MatToolbarModule],
  templateUrl: './purchaseorderlist-actionmenu.component.html',
  styleUrl: './purchaseorderlist-actionmenu.component.scss'
})
export class PurchaseorderlistActionmenuComponent {
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
