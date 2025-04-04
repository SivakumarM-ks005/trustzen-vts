import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { DialogDeactivateTemplateComponent } from '../dialog/dialog-deactivate-template/dialog-deactivate-template.component';
import { DialogFreezeTemplateComponent } from '../dialog/dialog-freeze-template/dialog-freeze-template.component';
import { DialogAssignCategoryEntityComponent } from '../dialog/dialog-assign-category-entity/dialog-assign-category-entity.component';
import { AssignCategoryEntityComponent } from '../dialog/assign-category-entity/assign-category-entity.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { WorkflowHistoryComponent } from '../../reusable/workflow-history/workflow-history.component';
import { MatButton } from '@angular/material/button';
import { DialogInitiateApprovalComponent } from '../../dialogs/dialog-initiate-approval/dialog-initiate-approval.component';


@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrl: './edit-template.component.scss',
  standalone: true,
  imports: [MatCheckbox, MatFormField, MatLabel, MatInput, FormsModule, MatTooltip, ReactiveFormsModule, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatSelect, MatOption, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, AngularEditorModule, WorkflowHistoryComponent, MatButton]
})
export class EditTemplateComponent {
  name = 'Angular 6';
  htmlContent = '';
  isDisabled: boolean = true;
  constructor(public dialog: MatDialog) { }
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
  deactivateTemplate() {
    this.dialog.open(DialogDeactivateTemplateComponent, {
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
  assignCategory() {
    this.dialog.open(DialogAssignCategoryEntityComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }

  initiateWorkFlow() {
    this.dialog.open(DialogInitiateApprovalComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '60%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }

  assignEntity() {
    this.dialog.open(AssignCategoryEntityComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      autoFocus: true,
      width: '85%',
      height: '75%',
      position: {
        top: 'calc(3vw + 20px)',
        bottom: '',
        left: '',
        right: ''
      },
      panelClass: 'popUpMiddle',
    });
  }
}
