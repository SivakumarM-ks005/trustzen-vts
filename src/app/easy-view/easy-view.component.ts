import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RegistrationComponent } from './registration/registration.component';
import { SourcingEventsComponent } from "./sourcing-events/sourcing-events.component";
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { ContractComponent } from './contract/contract.component';
import { InvoiceStatusComponent } from './invoice-status/invoice-status.component';
import { CollaborationListComponent } from './collaboration-list/collaboration-list.component';
@Component({
  selector: 'app-easy-view',
  standalone: true,
  imports: [MatTabsModule, RegistrationComponent, SourcingEventsComponent, PurchaseOrderComponent, ContractComponent, InvoiceStatusComponent, CollaborationListComponent],
  templateUrl: './easy-view.component.html',
  styleUrl: './easy-view.component.scss'
})
export class EasyViewComponent {

}
