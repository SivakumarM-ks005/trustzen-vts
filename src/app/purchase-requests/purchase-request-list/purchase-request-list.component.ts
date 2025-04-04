import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core'; 
import { themeBalham } from 'ag-grid-community';
import {PrActionMenuComponent} from '../pr-action-menu/pr-action-menu.component'
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RestApiService } from '@app/services/rest-api.service';
import { SharedService } from '@app/core/services/shared/shared.service';
import { catchError, of, Subscription } from 'rxjs';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-purchase-request-list',
  standalone: true,
  imports: [MatDialogTitle,RouterLink, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, AgGridAngular, MatDialogActions, MatButton, TranslatePipe],
  templateUrl: './purchase-request-list.component.html',
  styleUrl: './purchase-request-list.component.scss'
})
export class PurchaseRequestListComponent implements OnInit ,OnDestroy{
  rowSelection:any;
  actionMenu: any;
  rowHeight = 20;
  pagination = true;
  paginationPageSize = 5;
  paginationPageSizeSelector =[5,10, 25];
  public theme = themeBalham;
  routeSubscribe:Subscription;
  constructor(private apiService:RestApiService,private sharedService:SharedService,private router:Router,private route:ActivatedRoute){
    this.rowSelection = {
      mode: 'multiRow',
  };
  
  }
  navigateTo=()=>this.router.navigate(['/krya/addPurchaseRequestList'],{ skipLocationChange: true, replaceUrl: true });
 ngOnDestroy(): void {
     this.routeSubscribe.unsubscribe();
 }
  ngOnInit(): void {
    this.routeSubscribe= this.route.queryParams.subscribe(routeData=>{
        this.getPRList(routeData?.id||0)
       });

  }
  getPRList(id?:number){
    let baseUrl = 'PurchaseRequisition/GetPurchaseRequisition';
    // if(id)baseUrl=`PurchaseRequisition/GetPurchaseRequisitionById?prId=${id}`;
    this.apiService.getData(baseUrl).pipe(catchError(err=>of(this.mockPRList))).subscribe((res:any)=>{
        // res = this.mockPRList;
        let rowData:any[]=[]
     res.forEach((data:any)=>{
        if(data.purchaseRequisitionInfo && data.prItemsSection && data.prItemsSection.length!=0) {
          rowData.push({ 
            ref: data.purchaseRequisitionInfo?.refNo, 
            Rfx: "--", 
            CreatedDate:data.purchaseRequisitionInfo.createdDate||'26-Nov-2025', 
            ApprovedDate: '--',
            ShortName:data.purchaseRequisitionInfo?.shortName||'--',
            PurchaseCategory:data.purchaseRequisitionInfo?.purchaseCategory || '--',
            Buyer:data.purchaseRequisitionInfo?.uploadedBy,
            Status:data.purchaseRequisitionInfo?.prStatus,
            PRdata:data
          })  
        }
  
      })
      this.rowData = rowData ;
     if(id){
        let selectedData= this.rowData.find((data:any)=>data.PRdata.purchaseRequisitionInfo?.purchaseRequisitionInfoID==id);
        this.onActionClick('viewEdit',selectedData);}
      console.log(this.rowData)
      })
  }
  defaultColDef:ColDef ={
    flex:1,
      filter:true,
      floatingFilter:true,
      headerClass :'ag-header-style',
    }
  rowData:any[] =[]
colDefs: ColDef[] = [
  { field: "ref",
    headerName :'Ref #',
    maxWidth:70,
    cellClass: 'cellCenter'
   
  },
  { field: "Rfx",
    headerName :'Rfx Ref# '
  },
  { field: "CreatedDate",
    headerName :'Created Date'
  },
  { field: "ApprovedDate",
    headerName :'Approved Date'
  },
  { field: "ShortName",
    headerName :'Short Name'
  },
  { field: "PurchaseCategory",
    headerName :'Purchase Category',
    width:270,
  },
  { field: "Buyer",
    headerName :'Buyer',
    maxWidth:120,
  },
  { field: "Status",
    headerName :'Status',
    maxWidth:120,
  },
  {
          headerName: "Action", maxWidth: 120,
          cellRenderer: PrActionMenuComponent, filter: false, sortable: false,
          cellRendererParams: {
            context: {
              componentParent: this,
            },
          }
        },
];

  //NOTE - action click
  onActionClick(action: string, rowData: any){
    if (action === 'viewEdit') {
      this.router.navigate(['/krya/addPurchaseRequestList'], { skipLocationChange: true, replaceUrl: true });
      this.sharedService.setData({sharedId:'PR_Data',sharedName:'PR_lists',sharedType:'selected',sharedData:rowData.PRdata})
      // this.editRow(action, rowData);
    }else{
      // this.assignEntity(rowData);
    }
  }

  editRow(action:string,){

  }
  mockPRList=[
    {
        "userId": 5,
        "prEntityLevel": {
            "loggedIn": 0,
            "prEntityLevelID": 20,
            "entityNameID": 3,
            "level1ID": "001",
            "level2ID": "001",
            "level3ID": "001",
            "level4ID": "001",
            "prStatus": "Draft"
        },
        "purchaseRequisitionInfo": {
            "purchaseRequisitionInfoID": 28,
            "sourceID": 2,
            "refNo": "PR21",
            "createdDate": "2025-03-22",
            "indentor": "",
            "assignedBuyerID": 1,
            "shortName": "PR",
            "description": "",
            "fromDepartment": "",
            "needByDate": "2025-03-29",
            "budgetCheckID": 1,
            "currencyID": 2,
            "toleranceValue": 10,
            "purchaseClassificationID": 1,
            "spendTypeID": 1,
            "allowPartialResponse": true,
            "substituteItems": true,
            "prApprovedValue": 0
        },
        "prItemsSection": [
            {
                "prItemsSectionID": 13,
                "serialNo": null,
                "codeID": "001",
                "typeID": "Goods",
                "descriptionID": "Procurezen",
                "uomId": "Pieces",
                "quantity": "10",
                "rate": "1",
                "value": "10",
                "spendCategory1ID": "Category one",
                "spendCategory2ID": "Category two",
                "spendCategory3ID": "Category two",
                "totalAmount": null
            }
        ],
        "prAssignSupplier": [
            {
                "prAssignSupplierID": 27,
                "serialNo": null,
                "supplierCode": "SP-01",
                "supplierName": "UNIMECH AEROSPACE",
                "grade": "1",
                "status": "Active",
                "selectAll": true
            }
        ],
        "prRemarks": {
            "prRemarksID": 21,
            "buyerRemarks": "RB test",
            "supplierRemarks": "RS test"
        },
        "prDocumentSection": [
            {
                "prDocumentSectionID": 12,
                "documentNameID": 1,
                "description": "dsfa",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " system update popup.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            },
            {
                "prDocumentSectionID": 13,
                "documentNameID": 2,
                "description": "fdsaafds",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " system update popup.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            },
            {
                "prDocumentSectionID": 14,
                "documentNameID": 3,
                "description": "DSDGF",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " system update popup.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            },
            {
                "prDocumentSectionID": 15,
                "documentNameID": 4,
                "description": "FSG",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " system update popup.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            },
            {
                "prDocumentSectionID": 16,
                "documentNameID": 5,
                "description": "FG",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " Capture.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            },
            {
                "prDocumentSectionID": 17,
                "documentNameID": 6,
                "description": "gf",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " system update popup.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            },
            {
                "prDocumentSectionID": 18,
                "documentNameID": 7,
                "description": "gsf",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " system update popup.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            },
            {
                "prDocumentSectionID": 19,
                "documentNameID": 8,
                "description": "sdfg",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " Capture.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            },
            {
                "prDocumentSectionID": 20,
                "documentNameID": 9,
                "description": "fda",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " Capture.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            },
            {
                "prDocumentSectionID": 21,
                "documentNameID": 10,
                "description": "dsafewr",
                "serialNo": null,
                "fileType": " image/png ",
                "fileName": " Capture.PNG ",
                "uploadedBy": "Buyer",
                "uploadedDate": "2025-03-22T00:00:00"
            }
        ]
    }
]
}
