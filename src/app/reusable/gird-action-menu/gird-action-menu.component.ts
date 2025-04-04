import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClauseLibraryListComponent } from '../../clause-library/clause-library-list/clause-library-list.component';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@Component({
  selector: 'app-gird-action-menu',
  templateUrl: './gird-action-menu.component.html',
  styleUrl: './gird-action-menu.component.scss',
  standalone: true,
  imports: [MatMenuTrigger, MatIcon, MatMenu, MatMenuItem]
})

export class GirdActionMenuComponent implements ICellRendererAngularComp {
  params: any;
  label: string;
  fromScreen: string = '';
  showDelete: boolean = false;
  disableEdit: boolean = false;
  // @ViewChild(ClauseLibraryListComponent) clauseLibrary: ClauseLibraryListComponent;
  modalConfig = {
    disableClose: true,
    hasBackdrop: true,
    backdropClass: '',
    autoFocus: true,
    width: '90%',
    height: '90%',
    position: {
      top: 'calc(20px + 20px)',
      bottom: '',
      left: '',
      right: ''
    },
    panelClass: 'popUpMiddle',
  }
  constructor(public dialog: MatDialog, private router: Router,
    private clauseLibraryComp: DashboardComponent,
  ) {
    this.fromScreen = this.router.url.split('/')[2]; //clauseLibraryList
  }
  agInit(params: any): void {
    this.params = params;
    this.label = this.params.label || null;
    this.showDelete = this.params.node.data.active;
    this.disableEdit = this.params.node.data.status === 'InActive';
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true
  }

  editClause() {
    // this.dialog.open(EditClauseLibraryComponent, this.modalConfig);
    // if (this.fromScreen === 'clauseLibraryList') {
    this.clauseLibraryComp.pqassesment(this.params.node.data, "")
    // }
  }
  delecteClause() {
    // this.dialog.open(DeleteClauseComponent, this.modalConfig);
    // if (this.fromScreen === 'clauseLibraryList') {
    this.clauseLibraryComp.deleteClauseLibrary(this.params.node.data)
    // }
  }
  addTags() {
    // this.dialog.open(EditClauseLibraryComponent, this.modalConfig);
    // if (this.fromScreen === 'clauseLibraryList') {
    // this.clauseLibraryComp.addTags(this.params.node.data)
    // }
  }
}
