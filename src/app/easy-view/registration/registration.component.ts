import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonService } from '@app/core/services/common.service';
import { LoginService } from '@app/core/services/login/login.service';
import { CategoryScopeService } from '@app/core/services/supplier-management/category-scope.service';
import { SupplierAttachmentService } from '@app/core/services/supplier-management/supplier-attachment.service';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, DatePipe, NgFor, NgIf],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
  storedData: any;
  supplier: any;
  SupDetails: any;
  savaAllCategoryAndScopeVm: any[];
  SecondarycontactDetails: any;

  constructor(private commonService: CommonService,
    private supplierAttact: SupplierAttachmentService,
    private categoryScopeService: CategoryScopeService,
    private loginservice: LoginService
  ) {

  }

  ngOnInit(): void {
    this.storedData = JSON.parse(localStorage.getItem('loginDetails')!);

    this.getSupplierInformation();
    this.getSupplierDetails();
    this.getCategoryScopeList();
    this.GetContactDetails();
  }

  getSupplierInformation(): void {
    this.commonService.getSupplier(this.storedData.supplierId).subscribe({
      next: (data) => {
        this.supplier = data;
      },
      error: (err) => {
        console.error('Error fetching supplier types', err);
      }
    });
  }

  getSupplierDetails() {
    this.supplierAttact.getSupplierDetails(this.storedData.supplierId).subscribe(res => {
      if (res) {
        this.SupDetails = res;
      }
    })
  }

  getCategoryScopeList() {
    this.categoryScopeService.getCategoryAndScopeDetails(this.storedData.supplierId)
      .subscribe({
        next: res => {
          this.savaAllCategoryAndScopeVm = res;
        }, error: error => { },
        complete: () => { }
      });
  }

  GetContactDetails() {
    this.loginservice.GetSupplierContact(this.storedData.supplierId).subscribe(response => {
      if (response.length !== 0) {
        this.SecondarycontactDetails = response;
      }
    });
  }

}
