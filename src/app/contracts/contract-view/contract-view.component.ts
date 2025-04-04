import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatRadioButton } from '@angular/material/radio';
import { TermsConditionComponent } from '../tabs/terms-condition/terms-condition.component';
import { TransactionSpecificTCComponent } from '../tabs/transaction-specific-tc/transaction-specific-tc.component';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-contract-view',
    templateUrl: './contract-view.component.html',
    styleUrl: './contract-view.component.scss',
    standalone: true,
    imports: [MatButton, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormField, MatLabel, MatSelect, MatTooltip, MatOption, MatInput, FormsModule, ReactiveFormsModule, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatCheckbox, MatTabGroup, MatTab, MatRadioButton, TermsConditionComponent, TransactionSpecificTCComponent, MatIcon, RouterLink]
})
export class ContractViewComponent {
  isAccordionState:boolean =true;
  isDisabled :boolean=true;

  constructor(private router: Router){

  }

  contractRep(){
    this.router.navigate([`/krya/contractRepository`], { skipLocationChange: true, replaceUrl: true });
  }
}
