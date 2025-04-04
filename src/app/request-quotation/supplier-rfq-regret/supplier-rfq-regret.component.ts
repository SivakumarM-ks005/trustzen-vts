import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { SharedService } from '@app/core/services/shared/shared.service';
import { RFQService } from '@app/core/services/rfq/rfq.service';
import { CommonService } from '@app/core/services/common.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-supplier-rfq-regret',
  standalone: true,
  imports: [MatTooltip, MatInputModule, MatIconModule, MatButtonModule, 
    FormsModule, ReactiveFormsModule, MatCheckbox, MatButton, MatDatepickerModule,
  DatePipe],
  templateUrl: './supplier-rfq-regret.component.html',
  styleUrl: './supplier-rfq-regret.component.scss'
})
export class SupplierRfqRegretComponent {

  //Inject Services
  shared = inject(SharedService);
  componentService = inject(RFQService);
  commonService = inject(CommonService);

  getDataFromRow: any;
  billAddressDetails: any;
  shipAddressDetails: any;

  ngOnInit() {
    if (this.shared.getActionValue().componentName !== '') {
      this.getDataFromRow = this.shared.getActionValue()?.data;
      this.setAddressData(this.getDataFromRow);
    } else {
    }
  }

  setAddressData(value:any){
    if(value?.rfqBillShipAddressTrans?.length > 0){
      value?.rfqBillShipAddressTrans?.forEach((element:any) => {
        if(element?.rfqBillShipAddressId === 1){
          this.billAddressDetails = element;
        }
        if(element?.rfqBillShipAddressId === 2){
          this.shipAddressDetails = element;
        }
      });
    }
  }
}
