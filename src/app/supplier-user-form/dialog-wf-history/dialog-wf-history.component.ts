import { Component, Inject, inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { WorkflowHistoryComponent } from '../../reusable/workflow-history/workflow-history.component';
import { WfRelatedService } from '../../core/services/workflow/wf-related.service';
import { MatIconButton } from '@angular/material/button';
@Component({
  selector: 'app-dialog-wf-history',
  standalone: true,
  imports: [MatDialogModule, MatIconButton],
  templateUrl: './dialog-wf-history.component.html',
  styleUrl: './dialog-wf-history.component.scss'
})
export class DialogWfHistoryComponent {

  //Inject Service
  wfService = inject(WfRelatedService);
  workFlowHistory: any[] = [];
constructor( public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,) {}

  ngOnInit(){
    this.getWorkFlowHistory();
  }

  getWorkFlowHistory(){
    this.wfService.getSupplierWorkflowHistoryApi(this.data?.supplierDet?.supplierId, this.data?.screenName).subscribe((res)=>{
      if(res){
        this.workFlowHistory = res;
      }
    })
  }
}
