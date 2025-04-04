import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ICellRendererParams } from 'node_modules/ag-grid-community/dist/types/src/rendering/cellRenderers/iCellRenderer';
import { Router, RouterLink } from '@angular/router';
import { NewRfqComponent } from '../new-rfq/new-rfq.component';
import { MatDialog,  MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {DialogQueriesClarificationsComponent} from '../../dialogs/dialog-queries-clarifications/dialog-queries-clarifications.component'
import {DialogRfqCancelComponent} from '../../dialogs/dialog-rfq-cancel/dialog-rfq-cancel.component';
import {DialogRfqExtensionComponent} from '../../dialogs/dialog-rfq-extension/dialog-rfq-extension.component';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import {DialogBafoLafoComponent} from '../../dialogs/dialog-bafo-lafo/dialog-bafo-lafo.component';
import {ApprovalSummaryComponent} from '../../dialogs/approval-summary/approval-summary.component'
@Component({
  selector: 'app-rfq-action-menu',
  standalone: true,
  imports: [MatMenuTrigger, MatIconModule,  MatDialogTitle,MatDatepickerInput, MatDatepickerToggle, MatDatepicker, MatDialogClose, MatDialogContent, MatDialogActions, MatMenu,RouterLink, MatMenuItem],
  templateUrl: './rfq-action-menu.component.html',
  styleUrl: './rfq-action-menu.component.scss'
})

export class RfqActionMenuComponent {
params: any;
element: any;

  constructor(
    private router: Router,
    public dialog: MatDialog
  ) {
  }
  queriesClarification() {
    this.dialog.open(DialogQueriesClarificationsComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '90%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }

  rfqCancel() {
    this.dialog.open(DialogRfqCancelComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '50%',
      height: '40%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }
  rfqExtension() {
    this.dialog.open(DialogRfqExtensionComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '80%',
      height: '50%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }
  rfqBafoLafo() {
    this.dialog.open(DialogBafoLafoComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '90%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }

  approvalSummary() {
    this.dialog.open(ApprovalSummaryComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '90%',
      height: '80%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }
  agInit(params: any): void {
    this.params = params;
    this.element = params.node.data;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true
  }

  viewOrEditRFQ(data: any){
    this.router.navigate([`/krya/new-rfq/${data?.sourcingRFQ?.rfqId}`], { skipLocationChange: true, replaceUrl: true })
    // this.updaterfq.UpdateRFQ(data);
  }

}
