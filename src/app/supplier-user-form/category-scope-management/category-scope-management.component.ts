import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { CategoryAndScopeVm, ChildCategoryVm, CategoryDocTypeMas, ParentCategoryVm, SubCategoryVm } from '../../core/models/category-scope.model';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { AutoCompleteDirective } from '../../core/directives/autocomplete.directive';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { CategoryScopeService } from '../../core/services/supplier-management/category-scope.service';

@Component({
  selector: 'app-category-scope-management',
  templateUrl: './category-scope-management.component.html',
  styleUrl: './category-scope-management.component.scss',
  standalone: true,
  imports: [NgIf, MatButton, MatTooltip, FormsModule, MatFormField, MatLabel, MatInput, MatAutocompleteTrigger, AutoCompleteDirective, MatAutocomplete, MatOption, MatError, MatSelect, CdkTextareaAutosize, MatHint, MatIcon, MatBadge]
})
export class CategoryScopeManagementComponent implements OnInit {

  parentCategory: ParentCategoryVm[] = new Array<ParentCategoryVm>();
  filterParentCategoryOptions: ParentCategoryVm[] = new Array<ParentCategoryVm>();
  subCategory: SubCategoryVm[] = new Array<SubCategoryVm>();
  filterSubCategoryOptions: SubCategoryVm[] = new Array<SubCategoryVm>();
  childCategory: ChildCategoryVm[] = new Array<ChildCategoryVm>();
  filterChildCategoryOptions: ChildCategoryVm[] = new Array<ChildCategoryVm>();
  documentType: CategoryDocTypeMas[] = new Array<CategoryDocTypeMas>();
  fileList: File[] = new Array<File>();
  listOfFiles: any[] = [];
  saveCategoryAndScopeVm: CategoryAndScopeVm = new CategoryAndScopeVm();
  savaAllCategoryAndScopeVm: CategoryAndScopeVm[] = new Array<CategoryAndScopeVm>();

  constructor(public categoryScopeService: CategoryScopeService,
    public commonService: CommonService,
    public activateRouter: ActivatedRoute
  ) { }
  ngOnInit() {
  }

}
