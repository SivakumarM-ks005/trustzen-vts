import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef, ICellRendererParams } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions, MatDialog } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';
import { themeBalham } from 'ag-grid-community';
import { Router, RouterLink } from '@angular/router';
import { ItemMasterActionComponent } from '../item-master-action/item-master-action.component'
import { InventoryService } from '@app/core/services/inventory/inventory.service';
import { AdminService } from '@app/core/services/admin/admin.service';
import { SharedService } from '@app/core/services/shared/shared.service';
import { WfRelatedService } from '@app/core/services/workflow/wf-related.service';
import { DialogInventoryAssignEntitiesComponent } from '../dialog-inventory-assign-entities/dialog-inventory-assign-entities.component';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-item-master-list',
  standalone: true,
  imports: [MatDialogTitle, RouterLink, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, AgGridAngular, MatDialogActions, MatButton, TranslatePipe],
  templateUrl: './item-master-list.component.html',
  styleUrl: './item-master-list.component.scss'
})
export class ItemMasterListComponent {
  rowSelection: any;
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector = [5, 10, 25];
  public theme = themeBalham;

  //Inject Services
  wfService = inject(WfRelatedService); // Workflow Service
  inventoryService = inject(InventoryService); // Inventory Service
  adminService = inject(AdminService); // Admin Service
  shared = inject(SharedService);
  getStoredEntityData: any = [];
  getAssignEntityList: any;
  constructor(private router: Router,public dialog: MatDialog) {
    this.rowSelection = {
      mode: 'multiRow',
    };
  }

  ngOnInit(){
    this.getInventoryList();
    this.getAssignedEntityList();
    this.clearSignal();
  }

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    headerClass: 'ag-header-style',
  }
  rowData = [];

  itemMaster() {
    this.router.navigate([`/krya/itemMaster`], { skipLocationChange: true, replaceUrl: true })
  }

  colDefs: ColDef[] = [
    {
      headerName: 'Code ',
      valueGetter: (params:any) => {
        return params.data?.inventryItemHeader?.code;
      }
    },
    {
      valueGetter: (params:any) => {
        return params.data?.inventryItemHeader?.shortName;
      },
      headerName: 'Short Name'
    },
    {
      valueGetter: (params:any) => {
        return params.data?.inventryItemHeader?.itemType ? params.data?.inventryItemHeader?.itemType : "N/A";
      },
      headerName: 'Item Type',
    },
    {
      valueGetter: (params:any)=>{
        return params.data?.inventryItemUOM?.primaryUOMType ? params.data?.inventryItemUOM?.primaryUOMType : "N/A";
      },
      headerName: 'UOM'
    },
    {
      valueGetter: (params:any)=>{
        return params.data?.inventryItemStockStatus?.currentFreeStock ? params.data?.inventryItemStockStatus?.currentFreeStock : "N/A";
      },
      headerName: 'Free Stock',
    },
    {
      valueGetter: (params:any)=>{
        return params.data?.inventryItemStockStatus?.reservedStock ? params.data?.inventryItemStockStatus?.reservedStock : "N/A";
      },
      headerName: 'Reserved Qty',
    },
    {
      valueGetter: (params:any)=>{
        return params.data?.inventryItemStockStatus?.minOrderQty ? params.data?.inventryItemStockStatus?.minOrderQty : "N/A";
      },
      headerName: 'Min Order Qty',
    },
    {
      valueGetter: (params:any)=>{
        return params.data?.inventryItemStockStatus?.maxOrderQty ? params.data?.inventryItemStockStatus?.maxOrderQty : "N/A";
      },
      headerName: 'Max Order Qty',
    },
    {
      valueGetter: (params:any)=>{
        return params.data?.inventryItemStockStatus?.reOrderLevelQty ? params.data?.inventryItemStockStatus?.reOrderLevelQty : "N/A";
      },
      headerName: 'Reorder Qty',
    },
    {
      // valueGetter: (params:any)=>{
      //   return params.data?.inventryItemStockStatus?.reOrderLevelQty ? params.data?.inventryItemStockStatus?.reOrderLevelQty : "N/A";
      // },
      field: "RateType",
      headerName: 'Rate Type',
      cellRenderer: (params:any) => params.value ? params.value : "N/A",
    },
    {
      // valueGetter: (params:any)=>{
      //   return params.data?.inventryItemStockStatus?.reOrderLevelQty ? params.data?.inventryItemStockStatus?.reOrderLevelQty : "N/A";
      // },
      field: "Rate",
      headerName: 'Rate',
      cellRenderer: (params:any) => params.value ? params.value : "N/A",
    },
    {
      valueGetter: (params:any)=>{
        return params.data?.inventryItemHeader?.active ? "Active" : "Inactive";
      },
      headerName: 'Status',
    },
    {
      headerName: "Action", maxWidth: 120,
      cellRenderer: (ItemMasterActionComponent), filter: false, sortable: false,
      cellRendererParams: {
        context: {
          componentParent: this,
        },
      }
    },
  ];

  // Get Inventory List
  getInventoryList(){
    this.inventoryService.getAllInventoryList().subscribe((res:any)=>{
      if(res?.length > 0){
        this.rowData = res;
      }else{
        this.adminService.showMessage("No Saved Data")
      }
    },error=>{
      this.adminService.showMessage("Error while retrieving data")
    })
  }

  //NOTE - action click
  onActionClick(action: string, rowData: any){
    if (action === 'viewEdit') {
      this.editRow(action, rowData);
    }else{
      this.assignEntity(rowData);
    }
  }

  editRow(action:string,data:any){
    let obj = {
      componentName : "inventoryMasterList",
      action : action,
      valObject: data
    }
    this.shared.setActionValue(obj);
    this.router.navigate([`/krya/itemMaster`], { skipLocationChange: true, replaceUrl: true })
  }

  //SECTION - clear signal value;
  clearSignal(){
    let obj = {
      componentName : "",
      action : "",
      valObject: {}
    }
    this.shared.setActionValue(obj);
  }

  // Assign Enitity
  assignEntity(data:any) {
    let getItemId = data?.inventryItemHeader?.itemHeaderId ? data?.inventryItemHeader?.itemHeaderId : 0;
    // Get Saved Assigned Entity List
    this.inventoryService.getStoredAssignEntity(getItemId).subscribe((res:any)=>{
      if(res && res.length > 0){
        this.getStoredEntityData = res[0]?.inventryAssignEntityResponseRes;
      }
      const closedialog = this.dialog.open(DialogInventoryAssignEntitiesComponent, {
        disableClose: true,
        hasBackdrop: true,
        backdropClass: '',
        autoFocus: true,
        width: '85%',
        height: '80%',
        position: {
          top: 'calc(3vw + 20px)',
          bottom: '',
          left: '',
          right: ''
        },
        panelClass: 'popUpMiddle',
        data: {
          itemHeaderId: getItemId,
          storedEntitiyList: this.getStoredEntityData,
          entirydata: this.getAssignEntityList,
          inventoryData: data ? data : "",
        },
      });
      closedialog.afterClosed().subscribe((result:boolean) => {
        if (result === true) {
          if (getItemId) {
            this.getSavedAssignEntityList(getItemId);
          }
        }
      })
    },error=>{

    })
  }

  // Get Saved Assigned Entity List
  getSavedAssignEntityList(id?:any){
    this.getStoredEntityData = [];
    this.inventoryService.getStoredAssignEntity(id).subscribe((res:any)=>{
      if(res && res.length > 0){
        this.getStoredEntityData = res[0]?.inventryAssignEntityResponseRes;
      }
    },error=>{

    })
  }

  // Get Assign entity list
  getAssignedEntityList() {
    this.wfService.getEntityList().subscribe((res) => {
      if (res && res.length > 0) {
        this.getAssignEntityList = res;
      }
    }, error => {
    })
  }
}
