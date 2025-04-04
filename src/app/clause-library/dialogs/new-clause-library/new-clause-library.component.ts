import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatError, MatHint, MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { ClauseLibrary, ClauseCategoryMas, ClauseTypeMas, ClauseClassificationMas } from '../../../core/models/contract-clause.model';
import { AdminService } from '../../../core/services/admin/admin.service';
import { ContractService } from '../../../core/services/contract-service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatCheckbox } from '@angular/material/checkbox';
@Component({
  selector: 'app-new-clause-library',
  templateUrl: './new-clause-library.component.html',
  styleUrl: './new-clause-library.component.scss',
  standalone: true,
  imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatTooltip,
    CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, MatSelect,
    MatOption, AngularEditorModule, FormsModule, MatDialogActions, MatButton,
    TranslatePipe, MatHint, CdkTextareaAutosize, MatCheckbox, MatError]
})
export class NewClauseLibraryComponent implements OnInit {
  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '8rem',
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
  mode = 'add';
  isEditMode: boolean = false;
  isAddTag: boolean = false;
  refId: string;
  dataValue: any;
  @ViewChild('clauseLibraryForm', { static: false }) clauseLibraryForm: NgForm;
  saveClauseVm: ClauseLibrary = new ClauseLibrary();
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  categoryData: ClauseCategoryMas[] = new Array<ClauseCategoryMas>();
  clauseTypeData: ClauseTypeMas[] = new Array<ClauseTypeMas>();
  clauseClassifyData: ClauseClassificationMas[] = new Array<ClauseClassificationMas>();
  disableSave: boolean = false;
  userId: number = 0;
  constructor(private contractService: ContractService,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<NewClauseLibraryComponent>
  ) { }
  ngOnInit(): void {
    // this.classifications.unshift({
    //   classifyId: 0, classification: 'Select All'
    // });
    let loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
    this.userId = loggedUserDetails.userId;
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
          if (this.isEditMode) {
            this.saveClauseVm = this.dataValue;
            this.saveClauseVm.contractClassification = JSON.parse(this.saveClauseVm.classificationStr);
          }
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
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
  activeOrDeActivate() {
    this.contractService.deActivateClauseLibrary(
      this.saveClauseVm.clauseLibraryId
    ).subscribe(res => {
      if (res) {
        this.adminService.showMessage('Ref# ' + this.saveClauseVm.refId + (this.saveClauseVm.status === 'Active' ? ' DeActivated sucessfully' : ' Activated sucessfully'));
        this.dialogRef.close(true);
      }
    });
  }

  saveClauseLibrary() {
    if (this.clauseLibraryForm.valid) {
      this.disableSave = true;
      this.saveClauseVm.userId = this.userId;
      this.saveClauseVm.status = 'Active';
      this.saveClauseVm.classificationStr = JSON.stringify(this.saveClauseVm.contractClassification);
      this.contractService.saveClauseLibrary(this.saveClauseVm).subscribe(res => {
        if (res) {
          this.adminService.showMessage('Data on the form has been successfully '
            + (this.saveClauseVm.clauseLibraryId > 0 ? 'updated.' : 'saved.'));
          this.disableSave = false;
          this.dialogRef.close(true);
        }
      });
    } else {
      for (let i in this.clauseLibraryForm.controls) {
        this.clauseLibraryForm.controls[i].markAsTouched();
      };
      this.adminService.showMessage('Please fill in all mandatory fields before save!.');
    }
  }

}



// export class ClauseLibrary {
//   refId: string;
//   clauseName: string;
//   description: string;
//   categoryId: number;
//   category: string;
//   typeId: number;
//   typeName: string;
//   contractClassification: any[] = [];
//   htmlContent: string;
//   tagValue: string;
//   createdDate: string;
//   status: string;
// }