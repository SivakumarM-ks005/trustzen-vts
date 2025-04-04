import { Component, inject, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatLabel } from '@angular/material/form-field';
import { NgFor, TitleCasePipe, DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';
import { WfRelatedService } from '@app/core/services/workflow/wf-related.service';
import { AdminService } from '@app/core/services/admin/admin.service';

@Component({
    selector: 'app-dialog-supplier-assign-entity',
    templateUrl: './dialog-supplier-assign-entity.component.html',
    styleUrl: './dialog-supplier-assign-entity.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, MatLabel, FormsModule, ReactiveFormsModule, NgFor, MatPaginator, MatDialogActions, MatButton, TitleCasePipe, DatePipe, TranslatePipe]
})
export class DialogSupplierAssignEntityComponent implements OnInit {

  SupDetails: any;
  assignEntity: FormGroup;
  entirydata: { serial: string; entityCode: string; entityName: string; status: string; reason: string; description: string; }[];
  assignAllChecked = false;

  //WF service inject
  wfService = inject(WfRelatedService);
  //Admin service inject
  adminService = inject(AdminService);
  userId: number;
  storedEntitiyList: any[] = [];
  SupplierManagement: any;

  constructor(
    private supplierAttact: SupplierAttachmentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogSupplierAssignEntityComponent>
  ) {
    this.assignEntity = this.fb.group({
      assignAll: [false],
      entityArray: this.fb.array([])
    })
  }

  ngOnInit(): void {
    const storedData: any = localStorage.getItem('loginDetails');
    this.SupplierManagement = this.data?.SupplierManagement;
    this.userId = JSON.parse(storedData).userId;
    JSON.parse(localStorage.getItem('loginDetails')!);
    this.getSupplierDetails();
    this.storedEntitiyList = this.data?.storedEntitiyList
    this.assignEntitys(this.data?.entirydata);
  }

  assignEntitys(data: any) {
    this.entirydata = data;
    this.entirydata.forEach((res: any) => {
      res.pqSupplierEntityId = 0;
      res.supplierId = this.data?.supplierId;
      res.entityId = res.companyId;
      res.entityName = res.companyName;
      if (this.storedEntitiyList?.find((x: any) => x.entityId === res.entityId)) {
        res.isChecked = true;
      } else {
        res.isChecked = false;
      }
      res.createdUserId = this.userId;
    });
    this.setEntity(this.entirydata);

  }

  get entityArray(): FormArray {
    return this.assignEntity.get('entityArray') as FormArray;
  }

  setEntity(entitys: any) {
    const entityFormArray = this.assignEntity.get('entityArray') as FormArray;
    entitys.forEach((entity: any) => {
      const group = entityFormArray.push(this.fb.group({
        pqSupplierEntityId: [entity?.pqSupplierEntityId || 0],
        supplierId: [this.data?.supplierId],
        entityId: [entity?.entityId],
        entityName: [entity?.entityName],
        isChecked: [entity?.isChecked],
        createdUserId: [entity?.createdUserId]
      }));
    })

  }

  getSupplierDetails() {
    this.supplierAttact.getSupplierDetails(this.data?.supplierId).subscribe(res => {
      if (res) {
        this.SupDetails = res;

      }
    })
  }

  toggleAssignAll(ischecked: any) {
    this.entityArray.controls.forEach((group) => {
      group.get('isChecked')?.setValue(ischecked.target.checked);
    });
  }

  onIndividualAssignChange() {
    
    // Check if all individual checkboxes are checked
    const allChecked = this.entityArray.controls.every(
      (group) => group.get('isChecked')?.value === true
    );

    // Update the "Assign All" checkbox
    this.assignEntity.get('assignAll')?.setValue(allChecked);
  }

  submit() {
    const assignValues = this.entityArray.controls
      .filter((group: any) => group.get('isChecked')?.value === true) // Filter only those with 'assign' true

    if (assignValues?.length === 0) {
      this.adminService.showMessage("Please select atleast one value");
      return;
    }

    let arrayData: any = [];
    assignValues.forEach(element => {
      arrayData.push(element.value)
    })

    this.wfService.UpdateassignEntity(arrayData).subscribe(res => {
      if (res) {
        this.adminService.showMessage("Entity assigned successfully")
        this.dialogRef.close(true);
      }
    },error=>{
      this.adminService.showMessage("Error occured")
    })

  }

}
