import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Compliance } from '../../core/Interface/compliance';
import { ComplianceCheckService } from '../../core/services/supplier-management/supplier-compliance-checklist.service';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonService } from '../../core/services/common.service';
import moment from 'moment';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
    selector: 'app-compliance-checklist',
    templateUrl: './compliance-checklist.component.html',
    styleUrl: './compliance-checklist.component.scss',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatLabel, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatRadioGroup, MatRadioButton, MatCheckbox]
})
export class ComplianceChecklistComponent {
  @Input() supplierId: number;
  fields: any[] = []; // Input to pass the field definitions
  dynamicForm!: FormGroup;
  formFields: Compliance[] = [];
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  isEdit: boolean = false;
  savedFields: any[] = [];
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  @Output() tabValidCheckEmit = new EventEmitter();

  previousTabClick: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, public complianceCheckService: ComplianceCheckService,
    public adminService: AdminService, public commonService: CommonService, private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getComplianceCheckList();
  }

  initializeForm(): void {
    const formControls: { [key: string]: any } = {};
    // Loop through fields to create controls
    this.fields.forEach(field => {
      const validators = [];
      // Add required validator if mandatoryFlag is true
      if (field.mandatoryFlag) {
        validators.push(Validators.required);
      }
      // Set the default value and validators for the field
      if (field.fieldType === 'Date') {
        formControls[field.controlName] = ['', validators.length ? validators : null];
      } else {
        formControls[field.controlName] = ['', validators.length ? validators : null];
      }
    });
    // Create the FormGroup
    this.dynamicForm = this.fb.group(formControls);
  }

  getSavedValues() {
    this.complianceCheckService.GetComplianceCheckListData(this.supplierId)
      .subscribe({
        next: (res: any) => {
          this.savedFields = res;
          this.savedFields.forEach(x => {
            x.controlName = x.complianceFieldName.replace(/\s/g, '');
            x.controlName = x.controlName.replaceAll('.', '');
          });
          if (this.savedFields.length > 0) {
            this.isEdit = true;
            this.fields.forEach(i => {
              const fieldDetail = this.savedFields.find(x => x.controlName === i.controlName);
              i.complianceFieldResponse = fieldDetail.complianceFieldResponse;
              i.complianceCheckId = fieldDetail.complianceCheckId;
            });
            this.rebind_data();
          }
        }, error: (error: any) => this.adminService.showMessage(error),
        complete: () => { }
      })
  }

  getComplianceCheckList(): void {
    this.complianceCheckService.getComplianceCheckList().subscribe({
      next: (data) => {
        this.fields = data;
        this.fields.forEach(x => {
          x.controlName = x.fieldName.replace(/\s/g, '');
          x.controlName = x.controlName.replaceAll('.', '');
        });
        this.initializeForm();
        this.getSavedValues();
      },
      error: (err) => {
        console.error('Error fetching field values', err);
      }
    });
  }
  onComplianceSubmit(isNextClick: boolean = false) {
    if (this.dynamicForm.valid) {
      if (isNextClick && !this.dynamicForm.dirty) {
        this.nextTabEmit.emit();
        return;
      }
      const jsonArray: Array<{ ComplianceCheckId: number; cvFieldId: string; complianceFieldName: string; complianceFieldResponse: any; LoggedIn: any; SupplierId: any }> = [];
      Object.keys(this.dynamicForm.controls).forEach(controlName => {
        let fieldValue = this.dynamicForm.get(controlName)?.value;
        const fieldDetail = this.fields.find(x => x.controlName === controlName);
        const result = this.fields.filter(field => field.controlName === controlName).map(field => field.cvFieldId);
        fieldDetail.fieldType === 'Date'
        if (fieldDetail.fieldType === 'Date') {
          fieldValue = moment(fieldValue).format('YYYY-MM-DDThh:mm:ssZ');
        }
        jsonArray.push({
          SupplierId: this.supplierId,
          LoggedIn: this.commonService.UserId,
          ComplianceCheckId: this.isEdit ? fieldDetail.complianceCheckId : 0,
          cvFieldId: result.toString(),
          complianceFieldName: fieldDetail.fieldName,
          complianceFieldResponse: fieldValue ? fieldValue.toString() : ''
        });
      });
      this.complianceCheckService.SaveComplianceCheckListData(jsonArray).subscribe(
        (res: any) => {
          this.adminService.showMessage('Data on the form has been saved successfully.');
          this.dynamicForm.reset();
          this.getComplianceCheckList();
          if(this.savedFields.length === 0){
            this.tabValidCheckEmit.emit();
          }  
          if (isNextClick) {
            setTimeout(() => {
              this.nextTabEmit.emit();
            }, 1000);
          }
          if (this.previousTabClick) {
            setTimeout(() => {
              this.dialogResult.emit(true);
            }, 1000);
          }               
        },
        (error: any) => {
          console.error('Error saving compliance data', error);
        });
    } else {
      this.dynamicForm.markAllAsTouched();
      if (isNextClick) {
        this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
      } else {
        this.adminService.showMessage('Please fill in all mandatory fields before save!.');
      }
    }
  }
  rebind_data() {
    const formControls: { [key: string]: any } = {};
    // this.dynamicForm =  new FormGroup(formControls);
    this.fields.forEach(field => {
      const validators = [];
      if (field.mandatoryFlag) {
        validators.push(Validators.required);
      }
      if (field.fieldType === 'Date') {
        formControls[field.controlName] = [new Date(field.complianceFieldResponse)];
      } else {
        formControls[field.controlName] = [field.complianceFieldResponse, validators.length ? validators : null];
      }
    });
    this.dynamicForm = this.fb.group(formControls);
  }

  confirmatioPopUp(): void {
    const financialFields = Object.values(this.dynamicForm.controls).some(control => control.dirty || control.value);
    if (financialFields && this.dynamicForm.dirty) {
      const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, this.commonService.dataLostModalConfig);
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.previousTabClick = true;
          this.onComplianceSubmit();
        } else {
          this.dialogResult.emit(true);
        }
      });
    } else {
      this.dynamicForm.reset();
      this.dialogResult.emit(true);
    }
  }
}

