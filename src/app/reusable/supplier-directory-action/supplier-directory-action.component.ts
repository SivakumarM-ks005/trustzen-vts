import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { PqApplicationComponent } from '../../supplier-user-form/pq-application/pq-application.component';
import { ICellRendererParams } from 'ag-grid-community';
import {AssignedEntitiesComponent} from '../../dialogs/assigned-entities/assigned-entities.component'
import { WfRelatedService } from '@app/core/services/workflow/wf-related.service';
import { SuspensionTerminationService } from '@app/core/services/suspension&termination/suspension-termination.service';

@Component({
  selector: 'app-supplier-directory-action',
  standalone: true,
  imports: [MatMenuTrigger, MatIcon, MatMenu, MatMenuItem],
  templateUrl: './supplier-directory-action.component.html',
  styleUrl: './supplier-directory-action.component.scss'
})
export class SupplierDirectoryActionComponent implements ICellRendererAngularComp {
  componentService = inject(SuspensionTerminationService);
  
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
  entitydata: any;
  getSusTermEntityListArray: never[];
  constructor(public dialog: MatDialog, private router: Router,
    private clauseLibraryComp: PqApplicationComponent,
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
    this.clauseLibraryComp.pqassesment(this.params.node.data, 'view/edit')
    // }
  }
  saveTerminate() {
    this.clauseLibraryComp.pqassesment(this.params.node.data, 'suspension/terminate')
  }
  delecteClause() {
    this.clauseLibraryComp.pqassesment(this.params.node.data, 'suspension/terminate')
    // this.dialog.open(DeleteClauseComponent, this.modalConfig);
    // if (this.fromScreen === 'clauseLibraryList') {
    // this.clauseLibraryComp.deleteClauseLibrary(this.params.node.data)
    // }
  }
  addTags() {
    // this.dialog.open(EditClauseLibraryComponent, this.modalConfig);
    // if (this.fromScreen === 'clauseLibraryList') {
    // this.clauseLibraryComp.addTags(this.params.node.data)
    // }
  }
  assignedEntities() {
    this.getSusTermEntityListArray = [];
    this.componentService.getSusTermEntityList(this.params?.node?.data?.supplierId).subscribe((res:any)=>{
      if(res?.success && res?.data?.length > 0){
        res?.data?.forEach((element:any, index:any) => {
          const entityNameArray = JSON.parse(element?.historyRecord?.entityNames);
          element.historyRecord.entityName = entityNameArray[index];
        });
        this.getSusTermEntityListArray = res?.data;
        this.entitydata = [];
        this.assignEntitys();
      }else{
        this.entitydata = [];
        this.assignEntitys(); //Call Assign entity API
      }
    },error=>{
      this.entitydata = [];
      this.assignEntitys(); //Call Assign entity API
    })
  }

  //Get Assign entityList
  assignEntitys(){
    this.componentService.getStoredEntityListApi(this.params?.node?.data?.supplierId).subscribe({
      next: (data) => {
        // if(data?.length > 0){
        //   data.forEach((element:any, index:any) => {
        //     element.entityId = element.companyId;
        //     element.entityName = element.companyName;
        //   });
        // }
        const statusMap = new Map<number, string>();

        this.getSusTermEntityListArray.forEach((item:any) => {
          statusMap.set(item.historyRecord?.entityIds, item.historyRecord?.status!); // Assuming status is defined in array2
        });
        data.forEach((item:any) => {
          if (statusMap.has(item.entityId)) {
            item.status = statusMap.get(item.entityId);
          }
        });
      
        this.entitydata = data;
        this.dialog.open(AssignedEntitiesComponent, {
          disableClose: false,
          hasBackdrop: true,
          backdropClass: '',
          autoFocus: true,
          width: '80%',
          height: '60%',
          position: {
            top: 'calc(3vw + 20px)',
            bottom: '',
            left: '',
            right: ''
          },
          panelClass: 'popUpMiddle',
          data: this.entitydata
        });
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }
}

