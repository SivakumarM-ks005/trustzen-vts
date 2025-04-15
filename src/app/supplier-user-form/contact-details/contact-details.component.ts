import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor, UpperCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { LoginService } from '../../core/services/login/login.service';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { OnlyAllowedSymbolInputDirective } from '@app/core/directives/only-allowed-input.directive';
@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, UpperCasePipe, OnlyAllowedSymbolInputDirective, NgIf, MatButton, MatTooltip, MatFormField, MatLabel, MatSelect, MatOption, NgFor, MatError, MatInput, MatCheckbox]
})
export class ContactDetailsComponent implements OnInit {
  @Input() supplierId: number;
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  @Output() tabValidCheckEmit = new EventEmitter();
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  @Output() NextFlag = new EventEmitter<boolean>();

  constructor(
    private loginservice: LoginService,
    public supplierUserFormService: SupplierUserFormService,
    public adminService: AdminService,
    public commonService: CommonService,
    public activateRouter: ActivatedRoute
  ) {
    // Initializing with one contact form.
  }
  ngOnInit() {
    const storedData: any = localStorage.getItem('loginDetails');
    this.GetContactDetails();
    this.DropDownSupplierRole();
  }
  DropDownSupplierRole(): void {
    this.loginservice.getSupplierRole().subscribe(data => {

    });
  }
  GetContactDetails() {
    this.loginservice.GetSupplierContact(this.supplierId).subscribe(response => {
      this.tabValidCheckEmit.emit();
    });
  }
}

