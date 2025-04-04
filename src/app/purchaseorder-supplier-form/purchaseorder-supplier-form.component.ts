import { Component } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-purchaseorder-supplier-form',
  standalone: true,
  imports: [AngularEditorModule , MatCheckboxModule, MatFormFieldModule, MatButtonModule, MatFormField, MatTooltipModule, MatIconButton, MatLabel,MatSelectModule, MatButtonModule, MatInputModule, MatDatepickerModule,],
  templateUrl: './purchaseorder-supplier-form.component.html',
  styleUrl: './purchaseorder-supplier-form.component.scss'
})
export class PurchaseorderSupplierFormComponent {

}
