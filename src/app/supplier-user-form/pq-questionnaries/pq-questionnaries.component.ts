import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComplianceCheckService } from '../../core/services/supplier-management/supplier-compliance-checklist.service';
import { CommonService } from '../../core/services/common.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin/admin.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatFormField, MatSuffix, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { SupplierUserFormService } from '../../core/services/supplier-management/supplier.user.form.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-pq-questionnaries',
  templateUrl: './pq-questionnaries.component.html',
  styleUrl: './pq-questionnaries.component.scss',
  standalone: true,
  imports: [MatTooltipModule, FormsModule, ReactiveFormsModule, NgFor, NgClass, MatExpansionModule, NgIf, MatFormField, MatInput, MatCheckbox, MatRadioGroup, MatRadioButton, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatIcon, MatBadge, MatLabel]
})
export class PqQuestionnariesComponent implements OnInit {

  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  previousTabClick: boolean = false;
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];
  @Output() tabValidCheckEmit = new EventEmitter();
  @Input() supplierId: number;
  formPQuestions: FormGroup;
  pqquestionnaries: any;
  showPopup = false;
  popupImage: SafeResourceUrl | null = null;
  questionAnswer: any;
  attachToggle: { [key: string]: boolean } = {};
  childattachToggle: { [key: string]: boolean } = {};
  isOpen: boolean = true;
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  @Output() NextFlag = new EventEmitter<boolean>();

  constructor(
    public complianceCheckService: ComplianceCheckService,
    public commonService: CommonService,
    public fb: FormBuilder,
    public adminService: AdminService,
    public supplierUserFormService: SupplierUserFormService,
    public activateRouter: ActivatedRoute
  ) {
    this.formPQuestions = this.fb.group({
      supplierClassification: [''],
      country: [''],
      Status: [''],
      sections: this.fb.array([]) // Initialize the sections array dynamically
    });
  }

  ngOnInit(): void {


  }


}
