import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, NgModel, FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ContractService } from '../../../core/services/contract-service';
import { ClauseCategoryMas, ClauseClassificationMas, ClauseTypeMas } from '../../../core/models/contract-clause.model';
import { AdminService } from '../../../core/services/admin/admin.service';
import { MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgFor } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-dialog-clause-library',
    templateUrl: './dialog-clause-library.component.html',
    styleUrl: './dialog-clause-library.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, MatFormField, MatLabel, MatInput, MatError, CdkTextareaAutosize, MatHint, MatSelect, MatOption, MatCheckbox, NgFor, AngularEditorModule, MatDialogActions, MatButton, TranslatePipe]
})
export class DialogClauseLibraryComponent implements OnInit {
  refId: string;
  @ViewChild('clauseLibraryForm', { static: false }) clauseLibraryForm: NgForm;
  saveClauseVm: ClauseLibrary = new ClauseLibrary();
  searchText: string = '';
  classifySelection: string[] = [];
  classifyAll: string[]; htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };  
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  categoryData: ClauseCategoryMas[] = new Array<ClauseCategoryMas>();
  clauseTypeData: ClauseTypeMas[] = new Array<ClauseTypeMas>();
  clauseClassifyData: ClauseClassificationMas[] = new Array<ClauseClassificationMas>();
  constructor(private contractService: ContractService, private adminService: AdminService) {

  }
  ngOnInit(): void {
    // this.classifications.unshift({
    //   classifyId: 0, classification: 'Select All'
    // });
    this.saveClauseVm.refId = this.refId;
    this.saveClauseVm.contractClassification = [];
    this.getDropDownMas();
  }
  getDropDownMas() {
    this.contractService.getClauseDropDownTypes()
      .subscribe({
        next: res => {
          this.categoryData = res.categoryData;
          this.clauseTypeData = res.typeData;
          this.clauseClassifyData = res.classificationData;
        }, error: error => this.adminService.showMessage(error),
        complete: () => {
          // this.getAttachmentData(); 
        }
      });
  }
  filterCountries(event: any) {
    // this.searchText = event.target.value;
    // if (!this.searchText) {
    //   this.classifications = Object.values(this.classifications);
    // } else {
    //   this.classifications = this.classifications.filter(country =>
    //     country.classification.toLowerCase().includes(this.searchText.toLowerCase()),
    //   );
    // }
  }

  onTypeChange() {
    this.saveClauseVm.contractClassification
  }
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  saveClauseLibrary() {

  }
}

export class ClauseLibrary {
  refId: string;
  clauseName: string;
  description: string;
  categoryId: number;
  category: string;
  typeId: number;
  typeName: string;
  contractClassification: any[] = [];
  htmlContent: string;
  tagValue: string;
  createdDate: string;
  status: string;
}

export interface Food {
  value: string;
  viewValue: string;
}