import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-workflow-action',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './workflow-action.component.html',
  styleUrl: './workflow-action.component.scss'
})
export class WorkflowActionComponent {
  params: any;
  constructor(private router: Router){

  }
  agInit(params: any): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true
  }

  workflowScore(){
    this.router.navigate(['/krya/workFlowScoreCard'], { skipLocationChange: true,  replaceUrl: true })
  }
}
