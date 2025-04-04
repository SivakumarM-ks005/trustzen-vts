import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ContractService } from '../../../services/contract-service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatLabel, MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ContractTemplate, templateCategoryTransDto } from '../../../core/models/contract-template.model';
import { ChildCategoryVm, ParentCategoryVm, SubCategoryVm } from '../../../core/models/category-scope.model';
import { CategoryScopeService } from '../../../core/services/supplier-management/category-scope.service';
import { CommonService } from '../../../core/services/common.service';
import { AdminService } from '../../../core/services/admin/admin.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-dialog-assign-category-entity',
    templateUrl: './dialog-assign-category-entity.component.html',
    styleUrl: './dialog-assign-category-entity.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip,
       CdkScrollable, MatDialogContent, MatLabel, MatFormField, MatSelect, MatOption, 
       MatDialogActions, MatButton, TranslatePipe, DatePipe, ReactiveFormsModule, 
       FormsModule]
})
export class DialogAssignCategoryEntityComponent implements OnInit {
  templateData: ContractTemplate = new ContractTemplate();
  parentCategory: ParentCategoryVm[] = new Array<ParentCategoryVm>();
  subCategory: SubCategoryVm[] = new Array<SubCategoryVm>();
  childCategory: ChildCategoryVm[] = new Array<ChildCategoryVm>();
  saveTemplateCategory: templateCategoryTransDto = new templateCategoryTransDto();
  @ViewChild('templateCategoryForm', { static: false }) templateCategoryForm: NgForm;
  disableSave: boolean = false;
  userId: number = 0;

  constructor(public categoryScopeService: CategoryScopeService,
    public commonService: CommonService,
    private adminService: AdminService,
    private contractService: ContractService,
    private dialogRef: MatDialogRef<DialogAssignCategoryEntityComponent>,
  ) { }

  ngOnInit() {
    this.getParenCategories();
  }
  getParenCategories() {
    this.categoryScopeService.getParentCategoryList()
      .subscribe({
        next: res => {
          this.parentCategory = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { this.getAssignCategory() }
      });
  }
  getAssignCategory() {
    this.contractService.getTemplateCategory(this.templateData.contractTemplateId)
      .subscribe({
        next: res => {
          if (res) {
            this.saveTemplateCategory = res;
            let subCatId = res.subCategoryId ?? 0;
            let childCatId = res.childCategoryId ?? 0;
            this.getSubCategories(res.parentCategoryId, subCatId);
            this.getChildCategories(subCatId, childCatId);
          }
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  getSubCategories(parenId: number, subCategoryId: number = 0) {
    if (parenId > 0) {
      this.clearSubAndChild();
      this.categoryScopeService.getSubCategoryList(parenId)
        .subscribe({
          next: res => {
            this.subCategory = res;
            if (subCategoryId > 0)
              this.saveTemplateCategory.subCategoryId = subCategoryId;
          }, error: error => this.adminService.showMessage(error),
          complete: () => { }
        });
    }
  }

  getChildCategories(subId: number, childCategoryId: number = 0) {
    if (subId > 0) {
      this.clearChild();
      this.categoryScopeService.getChildCategoryList(subId)
        .subscribe({
          next: res => {
            this.childCategory = res;
            if (childCategoryId > 0)
              this.saveTemplateCategory.childCategoryId = childCategoryId;
          }, error: error => this.adminService.showMessage(error),
          complete: () => { }
        });
    }
  }

  clearSubAndChild() {
    this.subCategory = new Array<SubCategoryVm>;
    this.saveTemplateCategory.subCategoryId = null;
    this.childCategory = new Array<ChildCategoryVm>();
  }
  clearChild() {
    this.childCategory = new Array<ChildCategoryVm>();
    this.saveTemplateCategory.childCategoryId = null;
  }
  submit() {
    if (this.templateCategoryForm.valid) {
      this.disableSave = true;
      this.saveTemplateCategory.templateId = this.templateData.contractTemplateId;
      this.saveTemplateCategory.createdUserId = this.userId;
      this.contractService.saveTemplateCategory(this.saveTemplateCategory).subscribe(res => {
        if (res) {
          this.adminService.showMessage('Template category added sucessfully.');
          this.dialogRef.close(true);
          this.disableSave = false;
        }
      });
    } else {
      for (let i in this.templateCategoryForm.controls) {
        this.templateCategoryForm.controls[i].markAsTouched();
      };
      this.adminService.showMessage('Please fill in all mandatory fields before save!.');
    }
  }
}
