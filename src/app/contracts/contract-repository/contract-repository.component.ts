import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrackTraceComponent } from '../dialog/track-trace/track-trace.component';
import {RenewalGuidelinesComponent} from '../dialog/renewal-guidelines/renewal-guidelines.component';
import {ContractCancelComponent} from '../dialog/contract-cancel/contract-cancel.component';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
export interface TemplateList {
  contractId: string;
  createdDate: string;
  approvedDate: string;
  endDate: string;
  contractName: string;
  sourceDocRef: string;
  sourceDocDate: string;
  contractAdmin:string; 
  startDate:string;
  status: string;
}
const ELEMENT_DATA: TemplateList[] = [
  { contractId: 'FY2024-2060', createdDate: '18-Sep-2024',  startDate: '18-Sep-2024', approvedDate: '01-10-2024',endDate: '01-10-2024', contractName: 'template1', sourceDocRef: 'temp001', sourceDocDate: '29-09-2024',contractAdmin: 'Sam Williams', status: 'Workflow Approved'},
  { contractId: 'FY2024-2060', createdDate: '18-Sep-2024',  startDate: '18-Sep-2024', approvedDate: '01-10-2024',endDate: '01-10-2024', contractName: 'template1', sourceDocRef: 'temp001', sourceDocDate: '29-09-2024',contractAdmin: 'Sam Williams', status: 'Workflow Approved'},
  { contractId: 'FY2024-2060', createdDate: '18-Sep-2024',  startDate: '18-Sep-2024', approvedDate: '01-10-2024',endDate: '01-10-2024', contractName: 'template1', sourceDocRef: 'temp001', sourceDocDate: '29-09-2024',contractAdmin: 'Sam Williams', status: 'Workflow Approved'},
  { contractId: 'FY2024-2060', createdDate: '18-Sep-2024',  startDate: '18-Sep-2024', approvedDate: '01-10-2024',endDate: '01-10-2024', contractName: 'template1', sourceDocRef: 'temp001', sourceDocDate: '29-09-2024',contractAdmin: 'Sam Williams', status: 'Workflow Approved'},
  { contractId: 'FY2024-2060', createdDate: '18-Sep-2024',  startDate: '18-Sep-2024', approvedDate: '01-10-2024',endDate: '01-10-2024', contractName: 'template1', sourceDocRef: 'temp001', sourceDocDate: '29-09-2024',contractAdmin: 'Sam Williams', status: 'Workflow Approved'},
  { contractId: 'FY2024-2060', createdDate: '18-Sep-2024',  startDate: '18-Sep-2024', approvedDate: '01-10-2024',endDate: '01-10-2024', contractName: 'template1', sourceDocRef: 'temp001', sourceDocDate: '29-09-2024',contractAdmin: 'Sam Williams', status: 'Workflow Approved'},
  { contractId: 'FY2024-2060', createdDate: '18-Sep-2024',  startDate: '18-Sep-2024', approvedDate: '01-10-2024',endDate: '01-10-2024', contractName: 'template1', sourceDocRef: 'temp001', sourceDocDate: '29-09-2024',contractAdmin: 'Sam Williams', status: 'Workflow Approved'}
 
];
@Component({
    selector: 'app-contract-repository',
    templateUrl: './contract-repository.component.html',
    styleUrl: './contract-repository.component.scss',
    standalone: true,
    imports: [MatButton, MatTooltip, RouterLink, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatFormField, MatInput, MatMenuTrigger, MatMenu, MatMenuItem, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator]
})
export class ContractRepositoryComponent {
  constructor( private dialog: MatDialog, private route: Router){}
  displayedColumns: string[] = ['contractId','contractName', 'createdDate', 'startDate', 'endDate','sourceDocRef','sourceDocDate','contractAdmin','status', 'approvedDate','action'];
  displayedColumnsFilter: string[] = ['f-contractId','f-contractName', 'f-createdDate', 'f-startDate', 'f-endDate','f-sourceDocRef','f-sourceDocDate','f-contractAdmin', 'f-status','f-approvedDate','f-action'];
  dataSource = ELEMENT_DATA;

  contractform(){
    this.route.navigate([`/krya/contractForm`], { skipLocationChange: true, replaceUrl: true });
  }

  contractview(){
    this.route.navigate([`/krya/contractView`], { skipLocationChange: true, replaceUrl: true });
  }

  contractInsights(){
    this.route.navigate([`/krya/contractInsights`], { skipLocationChange: true, replaceUrl: true });
  }

  tractTrace(){
        this.dialog.open(TrackTraceComponent, {
          disableClose: true,
          hasBackdrop: true,
          backdropClass: '',
          autoFocus: true,
          width: '50%',
          height: '60%',
          position: {
            top: 'calc(3vw + 20px)',
            bottom: '',
            left: '',
            right: ''
          },
          panelClass: 'popUpMiddle',
        });
      }

      renewalGuidelines(){
        this.dialog.open(RenewalGuidelinesComponent, {
          disableClose: true,
          hasBackdrop: true,
          backdropClass: '',
          autoFocus: true,
          width: '90%',
          height: '75%',
          position: {
            top: 'calc(3vw + 20px)',
            bottom: '',
            left: '',
            right: ''
          },
          panelClass: 'popUpMiddle',
        });
      }

      cancelContract(){
        this.dialog.open(ContractCancelComponent, {
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
}
