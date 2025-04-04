import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatePipe, NgFor, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { ContractService } from '../../../core/services/contract-service';
import { CommonService } from '../../../core/services/common.service';

@Component({
  selector: 'app-dialog-view-workflow',
  standalone: true,
  templateUrl: './dialog-view-workflow.component.html',
  styleUrl: './dialog-view-workflow.component.scss',
  imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, MatDialogActions, MatButton, TranslatePipe, DatePipe, NgFor],
})
export class DialogViewWorkflowComponent implements OnInit {
  contractTemplateId: number = 0;
  workFlowHistory: any;
  constructor(private contractService: ContractService,
    public commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getWFHistory();
  }
  getWFHistory() {
    this.contractService.getTemplateWorkFlowHistory(this.contractTemplateId, 0).subscribe({
      next: (data) => {
        this.workFlowHistory = data;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }
}
