import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-add-address',
    templateUrl: './add-address.component.html',
    styleUrl: './add-address.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatInput, MatAutocompleteTrigger, MatAutocomplete, MatButton, NgFor, MatDialogActions, AsyncPipe]
})
export class AddAddressComponent implements OnInit {
  
  addressForm: FormGroup;
  taxForm: FormGroup;

  options: string[] = ['Local Company', 'Overseas'];
  filteredOptions: Observable<string[]> | undefined;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  constructor(
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<AddAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.inItAddressForm();
    this.inItTaxForm();
  }
  
  ngOnInit() { }

  inItAddressForm() {
    this.addressForm = this.fb.group({
      addressType: [this.data?.addressType || '', Validators.required],
      addressLine1: [this.data?.addressLine1 ||'', Validators.required],
      addressLine2: [this.data?.addressLine2 || ''],
      addressLine3: [this.data?.addressLine3 ||''],
      poBox: [this.data?.poBox ||''],
      country: [this.data?.country ||'', Validators.required],
      state: [this.data?.state ||'', Validators.required],
      city: [this.data?.city ||'', Validators.required],
      zipCode: [this.data?.zipCode ||''],
      mainOffixe: [this.data?.mainOffixe ||''],
    });
  }
  inItTaxForm() {
    this.taxForm = this.fb.group({
      taxDetails: this.fb.array([]),
    });

    // Populate tax details if editing existing data
    if (this.data?.taxInfo) {
      this.data.taxInfo.forEach((taxDetail: any) => {
        this.addTaxDetail(taxDetail);
      });
    }
  }

  
  get taxDetails(): FormArray {
    return this.taxForm.get('taxDetails') as FormArray;
  }

  // Method to add a tax detail entry to FormArray
  addTaxDetail(taxDetail?: any): void {
    const taxDetailForm = this.fb.group({
      taxType: [taxDetail?.taxType || '', Validators.required],
      registrationNumber: [taxDetail?.registrationNumber || '', Validators.required],
      taxExemption: [taxDetail?.taxExemption || ''],
    });
    this.taxDetails.push(taxDetailForm);
  }

  // Method to remove a tax detail entry
  removeTaxDetail(index: number): void {
    this.taxDetails.removeAt(index);
  }

  // Save the form data and pass it back to the parent
  onAddClick(): void {
    if (this.addressForm.valid && this.taxForm.valid) {
      const combinedData = {
        ...this.addressForm.value,
        taxInfo: this.taxForm.value.taxDetails,
      };
      this.dialogRef.close(combinedData);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

}

