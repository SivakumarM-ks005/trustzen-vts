import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { NgFor, TitleCasePipe } from '@angular/common';
import { MatOption,  } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonService } from '../../core/services/common.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { SupplierAttachmentService } from '@app/services/supplier-attachment.service';
import { SupplierUserFormService } from '@app/core/services/supplier-management/supplier.user.form.service';

@Component({
  selector: 'app-tax-payer',
  standalone: true,
  imports: [MatDialogTitle, MatIconButton,MatLabel, MatDialogClose,MatCheckbox, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatSelect, NgFor, MatOption, MatInput, MatIcon, MatPaginator, MatDialogActions, MatButton, TitleCasePipe, TranslatePipe],
  templateUrl: './tax-payer.component.html',
  styleUrl: './tax-payer.component.scss'
})
export class TaxPayerComponent implements OnInit {
  supplier: any;
  taxDetail: any;
  supDetails: any;
  addressDetails: any;
  mainOffice: any;
  otherAddress: any;
  

  constructor(private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private supplierAttact: SupplierAttachmentService,
    public supplierUserFormService: SupplierUserFormService,
  ){

  }

  ngOnInit(): void {
    console.log(this.data);
    
    this.getSupplierInformation();
    this.getSupplierDetails();
    this.getAddressDetails();
  }

  getSupplierInformation(): void {
    this.commonService.getSupplier(this.data?.supplierId).subscribe({
      next: (data) => {
        this.supplier = data
        let supplier = {
          'gst': '33AACCD3798F1ZN',
          'email': 'rlakshmaiah@dssiindia.com'
        }
        this.commonService.GetSearchTaxPlayer(supplier).subscribe(res => {
         this.taxDetail = res?.data;
        })
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  getSupplierDetails() {
    this.supplierAttact.getSupplierDetails(this.data?.SupplierId).subscribe(res => {
      if (res) {
        this.supDetails = res;
      }
    })
  }

  getAddressDetails() {
    this.supplierUserFormService.getAddressDetails(this.data?.supplierId).subscribe((res: any) => {
      if (res) {
        this.addressDetails = res;
        this.mainOffice = res.find((item: { mainOffixe: boolean; }) => item.mainOffixe === true);  
        this.otherAddress = res.find((item: { mainOffixe: boolean; }) => item.mainOffixe !== true); 
      }
    })
  }

  getFullAddress(address: any): string {
    if (
      address?.addressLine1 &&
      address?.cityName &&
      address?.stateName &&
      address?.countryName &&
      address?.zipCode
    ) {
      return `${address.addressLine1}, ${address.cityName}, ${address.stateName}, ${address.countryName} ${address.zipCode}`;
    }
    return 'N/A';
  }

}
