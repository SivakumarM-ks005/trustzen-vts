import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonService } from '../../core/services/common.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatLabel } from '@angular/material/form-field';
import { NgFor, TitleCasePipe, DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';

@Component({
    selector: 'app-dialog-supplier-manual-map',
    templateUrl: './dialog-supplier-manual-map.component.html',
    styleUrl: './dialog-supplier-manual-map.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, MatLabel, NgFor, MatPaginator, MatDialogActions, MatButton, TitleCasePipe, DatePipe, TranslatePipe]
})
export class DialogSupplierManualMapComponent implements OnInit {

  erpSupplier: { supplierCode: string; supplierName: string; comLicense: string; siteId: string; siteName: string; taxRegistration: string; submittedDate: string; status: string; }[];
  mapErp: any;
  userId: string | null;
  SupDetails: any;
  SupplierManagement: any;
  constructor(
    private dialogRef: MatDialogRef<DialogSupplierManualMapComponent>,
    public commonService: CommonService,
    public adminService: AdminService, private supplierAttact: SupplierAttachmentService, @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.SupplierManagement = this.data?.SupplierManagement;
    this.erpSupplier = this.data?.erpSupplier;
    this.getSupplierDetails();
    // this.getMapErp();
  }
  getSupplierDetails() {
    this.supplierAttact.getSupplierDetails(this.data?.supplierId).subscribe(res => {
      if (res) {
        this.SupDetails = res;

      }
    })
  }
  // getMapErp() {
  //   this.commonService.getMapErp(this.data?.supplierId).subscribe({
  //     next: (data: any) => {
  //       this.erpSupplier = data;
  //     }
  //   })
  // }

  onIndividualMapErpChange(data: any) {
    this.mapErp = data;
  }

  map() {
    let mapErp = {
      "userId": this.userId,
      "mapErps": [
        {
          "mapErpId": this.mapErp?.mapErpId,
          "mapCode": true
        }
      ],
      "supplierId": this.data?.supplierId
    }
    this.commonService.updateMapErp(mapErp).subscribe({
      next: (data: any) => {

        this.dialogRef.close(false);
      },
      error: (err: any) => {
        // this.adminService.showMessage('Supplier already exist');
      }
    })
    // this.dialogRef.close(false);
  }

  create() {
    this.commonService.saveMapErp(this.data?.supplierId).subscribe({
      next: (data: any) => {

        this.dialogRef.close();
      },
      error: (err: any) => {
        this.adminService.showMessage('Supplier already exist');
      }
    })
  }

}
