import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../../services/contract-service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatLabel } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';
import { ContractTemplate, EntityDto, TemplateEntityTransDto } from '../../../core/models/contract-template.model';
import { CommonService } from '../../../core/services/common.service';
import { AdminService } from '../../../core/services/admin/admin.service';
import { FormsModule, NgModel } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-assign-category-entity',
    templateUrl: './assign-category-entity.component.html',
    styleUrl: './assign-category-entity.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, MatLabel, MatPaginator, MatDialogActions, MatButton, TranslatePipe, MatCheckbox, FormsModule, DatePipe]
})
export class AssignCategoryEntityComponent implements OnInit {
  templateData: ContractTemplate = new ContractTemplate();
  userId: number = 0;
  entityData: EntityDto[] = new Array<EntityDto>();
  assignAll: boolean = false;
  saveEntity: TemplateEntityTransDto[] = new Array<TemplateEntityTransDto>();
  disableSave: boolean = false;

  constructor(
    public commonService: CommonService,
    private adminService: AdminService,
    private contractService: ContractService,
    private dialogRef: MatDialogRef<AssignCategoryEntityComponent>,
  ) { }

  ngOnInit() {
    this.getEntityDetails();
  }
  getEntityDetails() {
    this.entityData = ELEMENT_DATA;
    this.entityData.forEach(x => x.isChecked = false);
    this.getSavedEntities();
  }

  getSavedEntities() {
    this.contractService.getTemplateEntity(this.templateData.contractTemplateId)
      .subscribe({
        next: res => {
          if (res.length > 0) {
            res.forEach(item => {
              const index = this.entityData.findIndex(x => x.entityId === item.entityId);
              this.entityData[index].isChecked = true;
            });
            if (this.entityData.filter(x => !x.isChecked).length === 0) {
              this.assignAll = true;
            }
          }
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }

  selectAll(event: MatCheckboxChange) {
    this.entityData.forEach(x => x.isChecked = event.checked);
  }
  selectRow(event: MatCheckboxChange) {
    if (this.entityData.filter(x => !x.isChecked).length === 0) {
      this.assignAll = true;
    } else {
      this.assignAll = false;
    }
  }
  submit() {
    if (this.entityData.filter(x => x.isChecked).length === 0) {
      this.adminService.showMessage('Check atleast one entity.');
      return;
    }
    this.disableSave = true;
    this.saveEntity = new Array<TemplateEntityTransDto>()
    this.entityData.filter(x => x.isChecked).forEach(item => {
      let entityData = new TemplateEntityTransDto();
      entityData.templateId = this.templateData.contractTemplateId;
      entityData.entityId = item.entityId;
      entityData.isChecked = item.isChecked;
      entityData.createdUserId = this.userId;
      this.saveEntity.push(entityData);
    });
    this.contractService.saveTemplateEntity(this.saveEntity).subscribe(res => {
      if (res) {
        this.adminService.showMessage('Template entity added sucessfully.');
        this.dialogRef.close(true);
        this.disableSave = false;
      }
    });
  }
}

const ELEMENT_DATA: EntityDto[] = [
  { entityId: 1, entityCode: 'ATC001', description: 'Entity Template', entityName: 'Asian Trading Company', status: 'Active', reason: 'Info com', isChecked: false },
  { entityId: 2, entityCode: 'BA098', description: 'SK CLAUSE', entityName: 'Best appliances', status: 'Active', reason: 'CTS', isChecked: false },
  { entityId: 3, entityCode: 'CD098', description: 'Align circle', entityName: 'Zam Zam Appliances', status: 'Active', reason: 'TCS', isChecked: false },

];