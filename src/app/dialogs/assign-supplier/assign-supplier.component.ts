import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { RFQService } from '@app/core/services/rfq/rfq.service';

@Component({
  selector: 'app-assign-supplier',
  standalone: true,
  imports: [NgIf, MatTooltip, MatDialogClose, MatButton, MatDialogModule,
    NgClass, MatFormField, MatCheckbox, MatLabel, MatSelect, MatOption, NgFor, MatError, MatInput, MatDialogActions, ReactiveFormsModule, FormsModule,
    MatBadge, MatIconButton],
  templateUrl: './assign-supplier.component.html',
  styleUrl: './assign-supplier.component.scss'
})
export class AssignSupplierComponent implements OnInit {

  searchSupplierForm: FormGroup;
  supplierForm!: FormGroup;
  suppliers: any;
  parentCategory: any = [];
  subCategory: any = [];
  childCategory: any = [];

  constructor(public dialogRef: MatDialogRef<AssignSupplierComponent>, @Inject(MAT_DIALOG_DATA) public data: any,  // Inject the data passed to the dialog
    private fb: FormBuilder, private rfqService: RFQService) {
    this.dialogRef.disableClose = true;
    console.log('this.datda', this.data);

  }

  ngOnInit(): void {
    this.searchSupplierForm = this.fb.group({
      supplierCode: [''],
      supplierName: [''],
      grade: [''],
      parentCategory: [''],
      subCategory: [''],
      childCategory: ['']
    })

    this.supplierForm = this.fb.group({
      selectedSuppliers: this.fb.array([]), // FormArray to track selected suppliers
      selectAll: [false] // Boolean to track select all state
    });

    this.getParentCategory();
  }

  getParentCategory(){
    this.rfqService.getParentCategory().subscribe(res => {
      this.parentCategory = res;
    })
  }

  getSubCategories(event: any): void{
    // this.parentCategory[index]
    this.subCategory = [];
    this.childCategory = [];
    this.rfqService.getSubCategory(event.value).subscribe(res =>{
      this.subCategory = res;
    })
  }

  getChildCategories(event: any): void{
    // this.parentCategory[index]
    this.childCategory = [];
    this.rfqService.getChildCategory(event.value).subscribe(res =>{
      this.childCategory = res;
    })
  }

  search() {
    this.rfqService.getAllAssignSupplier(this.searchSupplierForm.value).subscribe(res => {
      this.suppliers = res
    })
  }

  // ✅ Getter for FormArray
  get selectedSuppliers(): FormArray {
    return this.supplierForm.get('selectedSuppliers') as FormArray;
  }

  // ✅ Toggle a single supplier selection
  toggleSelection(supplier: any, event: any): void {
    if (event.checked) {
      this.selectedSuppliers.push(this.fb.control(supplier));
    } else {
      const index = this.selectedSuppliers.controls.findIndex(control => control.value.supplierRefNo === supplier.supplierRefNo);
      if (index > -1) {
        this.selectedSuppliers.removeAt(index);
      }
    }
    this.updateSelectAllState();
  }

  // ✅ Check if a supplier is selected
  isSelected(supplier: any): boolean {
    return this.selectedSuppliers.controls.some(control => control.value.supplierRefNo === supplier.supplierRefNo);
  }

  // ✅ Select/Deselect All suppliers
  toggleSelectAll(event: any): void {
    this.selectedSuppliers.clear();
    if (event.checked) {
      this.suppliers.forEach((supplier: any) => this.selectedSuppliers.push(this.fb.control(supplier)));
    }
  }

  // ✅ Update "Select All" checkbox state
  updateSelectAllState(): void {
    this.supplierForm.patchValue({
      selectAll: this.selectedSuppliers.length === this.suppliers.length
    });
  }

  // ✅ Remove supplier from selected list
  removeSupplier(index: number): void {
    this.selectedSuppliers.removeAt(index);
    this.updateSelectAllState();
  }

  addAssignSupplier() {
    this.dialogRef.close(this.selectedSuppliers.value);
  }
}
