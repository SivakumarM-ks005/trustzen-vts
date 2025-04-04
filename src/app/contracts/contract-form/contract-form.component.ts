import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogFreezeTemplateComponent } from '../dialog/dialog-freeze-template/dialog-freeze-template.component';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { PartyInformationComponent } from '../tabs/party-information/party-information.component';
import { RolesResponsibilitiesComponent } from '../tabs/roles-responsibilities/roles-responsibilities.component';
import { TermsConditionComponent } from '../tabs/terms-condition/terms-condition.component';
import { TransactionSpecificTCComponent } from '../tabs/transaction-specific-tc/transaction-specific-tc.component';
import { CommercialsComponent } from '../tabs/commercials/commercials.component';
import { MilestoneComponent } from '../tabs/milestone/milestone.component';
import { ComplianceComponent } from '../tabs/compliance/compliance.component';
import { DocumentsComponent } from '../tabs/documents/documents.component';
import { WorkflowHistoryComponent } from '../../reusable/workflow-history/workflow-history.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrl: './contract-form.component.scss',
  standalone: true,
  imports: [MatButton, MatFormField, MatLabel, MatSelect, MatTooltip, MatOption, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatInput, FormsModule, ReactiveFormsModule, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatCheckbox, MatTabGroup, MatTab, PartyInformationComponent, RolesResponsibilitiesComponent, TermsConditionComponent, TransactionSpecificTCComponent, CommercialsComponent, MilestoneComponent, ComplianceComponent, DocumentsComponent, WorkflowHistoryComponent, RouterLink]
})
export class ContractFormComponent {
  isAccordionState: boolean = true;
  constructor(private dialog: MatDialog, private route: Router) { }
  freezeTemplate() {
    this.dialog.open(DialogFreezeTemplateComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '40%',
      height: '30%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }

  contarctRep(){
    this.route.navigate([`/krya/contractRepository`], { skipLocationChange: true, replaceUrl: true });
  }
}
