import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { ICellRendererParams } from 'ag-grid-community';

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
   private router: Router
  ) {
  }
  onButtonClick(action: string){
    if(this.params && this.params.data){
      this.params.context.componentParent.onActionClick(action, this.params.data);
    }
  }
  agInit(params: any): void {
    this.params = params;
 
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true
  }

  onCreate(){
    console.log('this.params.data',this.params.data);
    
    this.router.navigate([`/krya/new-rfq/`], { queryParams: { data: JSON.stringify(this.params.data) }, skipLocationChange: true, replaceUrl: true });
  }
  
}
