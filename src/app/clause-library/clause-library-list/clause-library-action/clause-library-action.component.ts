import { Component, ViewChild } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ClauseLibraryListComponent } from '../clause-library-list.component';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-clause-library-action',
  standalone: true,
  templateUrl: './clause-library-action.component.html',
  imports: [MatMenuTrigger, MatIconModule, MatMenu, MatMenuItem]
})
export class ClauseLibraryActionComponent implements ICellRendererAngularComp {
  params: any;
  label: string;
  fromScreen: string = '';
  showDelete: boolean = false;
  disableEdit: boolean = false;
  @ViewChild(ClauseLibraryListComponent) clauseLibrary: ClauseLibraryListComponent;
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
    private clauseLibraryComp: ClauseLibraryListComponent
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
    if (this.fromScreen === 'clauseLibraryList') {
      this.clauseLibraryComp.editClause(this.params.node.data)
    }
  }
  delecteClause() {
    if (this.fromScreen === 'clauseLibraryList') {
      this.clauseLibraryComp.deleteClauseLibrary(this.params.node.data)
    }
  }
  addTags() {
    if (this.fromScreen === 'clauseLibraryList') {
      this.clauseLibraryComp.addTags(this.params.node.data)
    }
  }
}
