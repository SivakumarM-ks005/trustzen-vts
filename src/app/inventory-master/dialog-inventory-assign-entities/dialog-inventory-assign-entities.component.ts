import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor, TitleCasePipe, DatePipe } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import { AdminService } from '@app/core/services/admin/admin.service';
import { InventoryService } from '@app/core/services/inventory/inventory.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-inventory-assign-entities',
  standalone: true,
  imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, MatLabel, FormsModule, ReactiveFormsModule, NgFor, MatPaginator, MatDialogActions, MatButton, TitleCasePipe, DatePipe, TranslatePipe],
  templateUrl: './dialog-inventory-assign-entities.component.html',
  styleUrl: './dialog-inventory-assign-entities.component.scss'
})
export class DialogInventoryAssignEntitiesComponent {

  //Inject services
  inventoryService = inject(InventoryService);
  adminService = inject(AdminService);

  assignEntity: FormGroup;
  inventoryData: any;
  storedEntitiyList: any;
  entirydata: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogInventoryAssignEntitiesComponent>) {
    this.assignEntity = this.fb.group({
      assignAll: [false],
      entityArray: this.fb.array([])
    })
  }

  ngOnInit(){
    this.inventoryData = this.data?.inventoryData;
    this.storedEntitiyList = this.data?.storedEntitiyList;
    this.assignEntitys(this.data?.entirydata);
  }

  assignEntitys(data: any) {
    this.entirydata = data;
    this.entirydata.forEach((res: any) => {
      res.inventryEntityId = res.companyId;
      res.entityName = res.companyName;
      this.storedEntitiyList?.forEach((v:any)=>{
        if(v.inventryEntityId === res.inventryEntityId){
          res.inventryEntityResponseId = v.inventryEntityResponseId;
          res.itemHeaderId = v.itemHeaderId;
          res.inventryStatus = "";
          res.active = true;
          res.deleteFlag = false;
          res.inventryEntityResponseAssign = v.inventryEntityResponseAssign;
        }
      })
      // if (this.storedEntitiyList?.find((x: any) => x.inventryEntityId === res.inventryEntityId)) {
      //   res.inventryEntityResponseAssign = true;
      // } else {
      //   res.inventryEntityResponseAssign = false;
      // }
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
        inventryEntityResponseId: [entity?.inventryEntityResponseId || undefined],
        itemHeaderId: [this.data?.itemHeaderId || undefined],
        inventryEntityId: [entity?.inventryEntityId],
        inventryEntityResponseAssign: [entity?.inventryEntityResponseAssign || false],
        inventryStatus: [entity?.inventryStatus || undefined],
        active: [entity?.active],
        deleteFlag: [entity?.deleteFlag],
        entityName: [entity?.entityName]
      }));
    })
    debugger
  }

  toggleAssignAll(ischecked: any) {
    this.entityArray.controls.forEach((group) => {
      group.get('inventryEntityResponseAssign')?.setValue(ischecked.target.checked);
    });
  }

  onIndividualAssignChange() {

    // Check if all individual checkboxes are checked
    const allChecked = this.entityArray.controls.every(
      (group) => group.get('inventryEntityResponseAssign')?.value === true
    );

    // Update the "Assign All" checkbox
    this.assignEntity.get('assignAll')?.setValue(allChecked);
  }

  submit() {
    const assignValues = this.entityArray.controls
      .filter((group: any) => (group.get('inventryEntityResponseAssign')?.value === true || group.get('inventryEntityResponseId')?.value)) // Filter only those with 'assign' true

    if (assignValues?.length === 0) {
      this.adminService.showMessage("Please select atleast one value");
      return;
    }

    let arrayData: any = [];
    assignValues.forEach(element => {
      arrayData.push(element.value)
    })

    for(let i =0; i < arrayData.length; i++){
      let v = arrayData[i];
      // const {inventryEntityResponseId, itemHeaderId, inventryStatus, active, deleteFlag} = arrayData[i];
      if(!v.inventryEntityResponseId)delete v.inventryEntityResponseId,delete v.itemHeaderId;
      if(!v.itemHeaderId)delete v.itemHeaderId;
      if(!v.inventryStatus)delete v.inventryStatus;
      if(!v.active)delete v.active;
      if(v.deleteFlag !== false)delete v.deleteFlag;
      if(v.entityName) delete v.entityName;
    }
    console.log(arrayData)
    this.inventoryService.saveInventoryAssignEntity(arrayData, this.data?.itemHeaderId).subscribe((res)=>{
      if(res){
        this.adminService.showMessage("Assign entity save successfull");
        this.dialogRef.close(true);
      }
    })
  }

}
