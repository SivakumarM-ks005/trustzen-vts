import { Component } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-contract-insights',
    templateUrl: './contract-insights.component.html',
    styleUrl: './contract-insights.component.scss',
    standalone: true,
    imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatButton, RouterLink]
})
export class ContractInsightsComponent {
  isAccordionState:boolean =true;
  isDisabled :boolean=true;

  constructor(private route: Router){

  }

  contarctRep(){
    this.route.navigate([`/krya/contractRepository`], { skipLocationChange: true, replaceUrl: true });
  }

}
