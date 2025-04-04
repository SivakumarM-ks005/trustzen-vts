import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { NgFor, TitleCasePipe } from '@angular/common';
import { MatOption,  } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonService } from '../../core/services/common.service';
import { MatCheckbox } from '@angular/material/checkbox';
@Component({
  selector: 'app-compare-supplier-cqa',
  standalone: true,
  imports: [MatDialogTitle, MatIconButton,MatLabel, MatDialogClose,MatCheckbox, MatTooltip, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatSelect, NgFor, MatOption, MatInput, MatIcon, MatPaginator, MatDialogActions, MatButton, TitleCasePipe, TranslatePipe],
  templateUrl: './compare-supplier-cqa.component.html',
  styleUrl: './compare-supplier-cqa.component.scss'
})
export class CompareSupplierCqaComponent {

}
