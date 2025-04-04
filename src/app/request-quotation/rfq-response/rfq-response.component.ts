import { Component, inject, Input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { SupplierRfqRegretComponent } from '../supplier-rfq-regret/supplier-rfq-regret.component';
import {SupplierRfqResponseComponent } from '../supplier-rfq-response/supplier-rfq-response.component'
import { AdminService } from '@app/core/services/admin/admin.service';
import { RFQService } from '@app/core/services/rfq/rfq.service';
import { SharedService } from '@app/core/services/shared/shared.service';
import { CommonService } from '@app/core/services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rfq-response',
  standalone: true,
  imports: [MatDialogTitle, MatTabsModule, SupplierRfqRegretComponent, SupplierRfqResponseComponent, MatIconButton, MatDialogClose, MatTooltip, MatInputModule, MatIconModule, MatButtonModule, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule,
    MatFormField, MatCheckbox, MatLabel, MatSelect, MatOption, MatInput, MatDialogActions,
    MatDatepickerModule],
  templateUrl: './rfq-response.component.html',
  styleUrl: './rfq-response.component.scss'
})
export class RfqResponseComponent {

  interestedFlag: boolean = false;
  notInterestedFlag: boolean = false;
  reason : string = "";
  
  //Inject services
  alertService = inject(AdminService);
  componentService = inject(RFQService);
  shared = inject(SharedService);
  commonService = inject(CommonService);
  supplierId = this.commonService.SupplierId; 

  getDataFromRow: any;
  isEnableResponse: boolean = false;
  fieldsDisable: boolean = false;
  selectedIndex: number = 0;

  constructor(private router: Router){}

  ngOnInit(){
    if (this.shared.getActionValue().componentName !== '') {
      this.getDataFromRow = this.shared.getActionValue()?.data;
      this.shared.clearRefValue();
      this.checkIfDataRegret();
    }
  }

  checkIfDataRegret(){
    this.componentService.checkWhetherRegret(this.supplierId,this.getDataFromRow?.sourcingRFQ?.rfqId).subscribe((res:any)=>{
      if(res?.regret){
        this.isEnableResponse = false;
        this.fieldsDisable = true;
        this.reason = res?.reason;
        this.notInterestedFlag = true;
      }else{
        this.componentService.checkWhetherResponseRefGenerated(this.supplierId,this.getDataFromRow?.sourcingRFQ?.rfqId).subscribe((res:any)=>{
          if(res?.responseRefNo){
            this.shared.setRefValue(res?.responseRefNo);
            this.isEnableResponse = true;
            this.interestedFlag = true;
            this.fieldsDisable = true;
          }
        })
      }
    })
  }

  selectionChanges(action : string){
    if(action === 'I'){
      this.reason = "";
      this.notInterestedFlag = false;
    }else{
      this.interestedFlag = false;
    }
  }

  //Regret Button
  regretBtn(){
    if(this.reason){
      let objectData = {
        supplierId: this.supplierId,
        rfqId: this.getDataFromRow?.sourcingRFQ?.rfqId,
        createdUserId: this.getDataFromRow?.userId,
        interested: false,
        reason: this.reason,
        regret : true,
        created: new Date()
      }
      this.componentService.regretSubmit(objectData).subscribe((res:any)=>{
        if(res?.regret){
          this.isEnableResponse = false;
          this.fieldsDisable = true;
          this.reason = res?.reason;
          this.notInterestedFlag = true;
        }
      })
    }else{
      this.alertService.showMessage("Please select reason")
    }
  }

  //Create Button
  createResBtn(){
    let objectData = {
      supplierId: this.supplierId,
      rfqId: this.getDataFromRow?.sourcingRFQ?.rfqId,
      createdUserId: this.getDataFromRow?.userId,
      responseRefNo: "",
      created: new Date()
    }

    this.componentService.createResponseSubmit(objectData).subscribe((res:any)=>{
      if(res?.responseRefNo){
        this.shared.setRefValue(res?.responseRefNo);
        this.isEnableResponse = true;
        this.interestedFlag = true;
        this.fieldsDisable = true;
      }
    })
  }

  // Event handler to capture tab selection
  onTabChange(event: any) {
    this.selectedIndex = event.index; // Get the index of the selected tab
  }

  changeTabToNext(tabgroup: MatTabGroup, number: number){
    tabgroup.selectedIndex = number;
    this.selectedIndex = number;
  }

  //Cancel 
  cancelBtn(){
    this.router.navigate(['/krya/rfq-list'], { skipLocationChange: true,  replaceUrl: true });
  }
}
