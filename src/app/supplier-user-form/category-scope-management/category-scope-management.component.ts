import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { CategoryAndScopeVm, ChildCategoryVm, CategoryDocTypeMas, ParentCategoryVm, SubCategoryVm } from '../../core/models/category-scope.model';
import { AdminService } from '../../core/services/admin/admin.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
import { PreQualificationProcessComponent } from '@app/pre-qualification-process/pre-qualification-process.component';

@Component({
  selector: 'app-category-scope-management',
  templateUrl: './category-scope-management.component.html',
  styleUrl: './category-scope-management.component.scss',
  standalone: true,
  imports: [NgIf, MatButton, MatTooltip, FormsModule, MatFormField, MatLabel, MatInput, MatAutocompleteTrigger, AutoCompleteDirective, MatAutocomplete, MatOption, MatError, MatSelect, CdkTextareaAutosize, MatHint, MatIcon, MatBadge]
})
export class CategoryScopeManagementComponent implements OnInit {
  @Input() supplierId: number;
  @Input() userId: number;
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
  @ViewChild('categoryAndScopeForm', { static: false }) categoryAndScopeForm: NgForm;
  formData = new FormData();
  editCategoryIndex: number;
  editedCategoryFlag: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() disableSaveCategoryEmit = new EventEmitter<boolean>();
  disableSave: boolean = false;
  previousTabClick: boolean = false;
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  @Output() tabValidCheckEmit = new EventEmitter();
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  disableStatusBased: boolean = true;
  attachToggle: boolean = false;
  status: any;
  isSubmitted = false;
  discriptionValidtion: boolean = false;
  @Output() NextFlag = new EventEmitter<boolean>();
  existingNotEditable: boolean = true;
  profileStatus: any;

  constructor(public categoryScopeService: CategoryScopeService,
    public commonService: CommonService,
    private adminService: AdminService,
    private dialog: MatDialog,
    public activateRouter: ActivatedRoute
  ) { }
  ngOnInit() {
    this.getParenCategories();
    this.getCategoryScopeList();
  }

  getParenCategories() {
    this.categoryScopeService.getParentCategoryList()
      .subscribe({
        next: res => {
          this.parentCategory = res;
          this.filterParentCategoryOptions = this.parentCategory;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { this.getDocumentTypes() }
      });
  }

  getSubCategories(parenId: number, subCategoryId: number = 0) {
    if (parenId > 0) {
      // if (subCategoryId === 0)
      this.clearSubAndChild();
      this.categoryScopeService.getSubCategoryList(parenId)
        .subscribe({
          next: res => {
            this.subCategory = res;
            this.filterSubCategoryOptions = this.subCategory;
            if (subCategoryId > 0)
              this.saveCategoryAndScopeVm.subCategoryId = subCategoryId;
          }, error: error => this.adminService.showMessage(error),
          complete: () => { }
        });
    }
  }

  getChildCategories(subId: number, childCategoryId: number = 0) {
    if (subId > 0) {
      // if (!this.editedCategoryFlag)
      this.clearChild();
      this.categoryScopeService.getChildCategoryList(subId)
        .subscribe({
          next: res => {
            this.childCategory = res;
            this.filterChildCategoryOptions = this.childCategory;
            if (childCategoryId > 0)
              this.saveCategoryAndScopeVm.childCategoryId = childCategoryId;
          }, error: error => this.adminService.showMessage(error),
          complete: () => { }
        });
    }
  }

  getCategoryScopeList() {
    this.categoryScopeService.getCategoryAndScopeDetails(this.supplierId)
      .subscribe({
        next: res => {
          this.tabValidCheckEmit.emit();
          this.savaAllCategoryAndScopeVm = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  getDocumentTypes() {
    this.categoryScopeService.getCategoryDocType()
      .subscribe({
        next: res => {
          this.documentType = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => {
          this.activateRouter?.params?.subscribe((response) => {
            if (response.status === 'In-Progress') {

              this.status = response.status;
              if (this.categoryAndScopeForm) {
                Object.keys(this.categoryAndScopeForm.controls).forEach((key) => {
                  this.categoryAndScopeForm.controls[key].disable();
                });
              }
              this.disableStatusBased = false;
            } else if (response.profile === 'manageprofile') {
              this.profileStatus = response.profile;
              this.existingNotEditable = false;
            }

          });
        }
      });
  }
  clearSubAndChild() {
    this.subCategory = new Array<SubCategoryVm>;
    this.filterSubCategoryOptions = new Array<SubCategoryVm>;
    this.saveCategoryAndScopeVm.subCategoryId = null;
    this.childCategory = new Array<ChildCategoryVm>();
    this.filterChildCategoryOptions = new Array<ChildCategoryVm>();
    if (!this.editedCategoryFlag)
      this.saveCategoryAndScopeVm.childCategoryId = null;
  }
  clearChild() {
    this.childCategory = new Array<ChildCategoryVm>();
    this.filterChildCategoryOptions = new Array<ChildCategoryVm>();
    this.saveCategoryAndScopeVm.childCategoryId = null;
  }
  clearValues(): boolean {
    // this.SaveDraftFlag.emit(this.commonService.CommonClearValues(this.categoryAndScopeForm, this.listOfFiles));

    if (this.categoryAndScopeForm?.form.valid) {
      if (this.saveCategoryAndScopeVm.typeId) {
        if (this.listOfFiles?.length !== 0) {
          this.SaveDraftFlag.emit(true)
        } else {
          this.SaveDraftFlag.emit(false)
        }
      } else {
        this.SaveDraftFlag.emit(true)
      }
    } else {
      this.SaveDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.categoryAndScopeForm, this.listOfFiles);
  }

  NextButtonValidation() {
    if (this.savaAllCategoryAndScopeVm?.length !== 0) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false);
    }
  }

  displayFnParent(parentId: number): string {
    return parentId > 0 ? this.filterParentCategoryOptions.find(ac => ac.parentCategoryId === parentId)?.parentCatgeory! : '';
  }
  displayFnSub(subId: number): string {
    return subId > 0 ? this.filterSubCategoryOptions.find(ac => ac.subCategoryId === subId)?.subCatgeory! : '';
  }
  displayFnChild(childId: number): string {
    return childId > 0 ? this.filterChildCategoryOptions.find(ac => ac.childCategoryId === childId)?.childCatgeory! : '';
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length) {
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        if (
          this.listOfFiles.find(obj => obj.fileInfo.name === selectedFile.name)) {
          this.adminService.showMessage('This File Already Exist.');
          this.fileInput.nativeElement.value = null;
          return;
        }
        let fileDetail: any = {};
        fileDetail.fileInfo = selectedFile;
        fileDetail.docId = 0;
        this.listOfFiles.push(fileDetail);
      }
      this.saveCategoryAndScopeVm.isFileChanged = true;
      this.fileInput.nativeElement.value = null;
      this.toggleAttach();
    }
  }

  editCategoryScope(index: number, el: HTMLElement) {
    el.scrollIntoView();
    this.editCategoryIndex = index;
    this.editedCategoryFlag = true;
    this.saveCategoryAndScopeVm = this.savaAllCategoryAndScopeVm[index];
    let subCatId = this.savaAllCategoryAndScopeVm[index].subCategoryId ?? 0;
    let childCatId = this.savaAllCategoryAndScopeVm[index].childCategoryId ?? 0;
    this.getSubCategories(this.saveCategoryAndScopeVm.parentCategoryId, subCatId);
    this.getChildCategories(subCatId, childCatId);
    this.listOfFiles = this.savaAllCategoryAndScopeVm[index].categoryAndScopeDocs;
  }
  clearCategories() {
    this.saveCategoryAndScopeVm = new CategoryAndScopeVm();
    this.subCategory = new Array<SubCategoryVm>;
    this.filterSubCategoryOptions = new Array<SubCategoryVm>;
    this.childCategory = new Array<ChildCategoryVm>();
    this.filterChildCategoryOptions = new Array<ChildCategoryVm>();
    this.fileList = [];
    this.listOfFiles = [];
    this.categoryAndScopeForm.reset();
    if (this.editedCategoryFlag) {
      this.editedCategoryFlag = false;
    }
  }

  preQualification(): void {

    const cancelDialogRef = this.dialog.open(PreQualificationProcessComponent, {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: true,
      width: '35%',
      height: '40%',
      position: {
        top: 'calc(10vw + 20px)',
      },
      panelClass: 'confirmdialog',
      data: {
        parentDialogRef: this.commonService.dataLostModalConfig,  // Passing the parent dialog reference
        moduleName: 'Supplier Category & Scope Management'
      },
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.editedCategoryFlag) {
          this.saveCategoryAndScopeVm.categoryScopeId = 0;
          this.saveCategoryAndScopeVm.supplierId = this.supplierId;
          this.saveCategoryAndScopeVm.userId = this.userId;
        }

        if (this.saveCategoryAndScopeVm.typeId && this.listOfFiles.length === 0) {
          this.adminService.showMessage('Please Upload documents.');
          this.disableSaveCategoryEmit.emit(false);
          this.disableSave = false;
          return;
        }
        if (this.saveCategoryAndScopeVm.isFileChanged) {
          this.listOfFiles.forEach((f) => {
            this.formData.append(this.saveCategoryAndScopeVm.fileNameId, f.fileInfo);
          });
        }
        this.formData.append('CategoryAndScope', JSON.stringify(this.saveCategoryAndScopeVm));
        this.categoryScopeService.saveCategoryAndScope(this.formData).subscribe(res => {
          if (res) {
            this.discriptionValidtion = false;
            this.nextTabEmit.emit(5);
            if (this.saveCategoryAndScopeVm.categoryScopeId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            this.isSubmitted = false;
            this.saveCategoryAndScopeVm.description = '';
            this.disableSaveCategoryEmit.emit(false);
            this.disableSave = false;
            this.formData = new FormData();
            this.saveCategoryAndScopeVm = new CategoryAndScopeVm();
            this.fileList = [];
            this.listOfFiles = [];
            this.categoryAndScopeForm.reset();
            this.editedCategoryFlag = false;
            this.attachToggle = false;
            this.filterParentCategoryOptions = this.parentCategory;
            this.filterSubCategoryOptions = this.subCategory;
            this.filterChildCategoryOptions = this.childCategory;
          }
        })

      } else {
        if (!this.editedCategoryFlag) {
          this.saveCategoryAndScopeVm.categoryScopeId = 0;
          this.saveCategoryAndScopeVm.supplierId = this.supplierId;
          this.saveCategoryAndScopeVm.userId = this.userId;
        }

        if (this.saveCategoryAndScopeVm.typeId && this.listOfFiles.length === 0) {
          this.adminService.showMessage('Please Upload documents.');
          this.disableSaveCategoryEmit.emit(false);
          this.disableSave = false;
          return;
        }
        if (this.saveCategoryAndScopeVm.isFileChanged) {
          this.listOfFiles.forEach((f) => {
            this.formData.append(this.saveCategoryAndScopeVm.fileNameId, f.fileInfo);
          });
        }
        this.formData.append('CategoryAndScope', JSON.stringify(this.saveCategoryAndScopeVm));
        this.categoryScopeService.saveCategoryAndScope(this.formData).subscribe(res => {
          if (res) {
            this.discriptionValidtion = false;
            if (this.saveCategoryAndScopeVm.categoryScopeId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            this.isSubmitted = false;
            this.saveCategoryAndScopeVm.description = '';
            this.disableSaveCategoryEmit.emit(false);
            this.disableSave = false;
            this.formData = new FormData();
            this.saveCategoryAndScopeVm = new CategoryAndScopeVm();
            this.fileList = [];
            this.listOfFiles = [];
            this.categoryAndScopeForm.reset();
            this.editedCategoryFlag = false;
            this.attachToggle = false;
            this.filterParentCategoryOptions = this.parentCategory;
            this.filterSubCategoryOptions = this.subCategory;
            this.filterChildCategoryOptions = this.childCategory;
          }
        })

      }
    });

  }

  addCategories(isNextClick: boolean = false) {
    this.isSubmitted = true;
    if (this.savaAllCategoryAndScopeVm?.length > 0 && !this.editedCategoryFlag) {
      let duplicateCheck = this.savaAllCategoryAndScopeVm.some(data => data.parentCategoryId === this.saveCategoryAndScopeVm?.parentCategoryId && data?.subCategoryId === this.saveCategoryAndScopeVm?.subCategoryId && data?.childCategoryId === this.saveCategoryAndScopeVm?.childCategoryId);
      if (duplicateCheck) {
        this.adminService.showMessage('The category information entered already exists. Please use a different combination.');
        return;
      }
    }

    if (!isNextClick && this.profileStatus === 'manageprofile') {
      this.preQualification();
    } else {
      if (isNextClick && this.savaAllCategoryAndScopeVm.length !== 0 && this.editedCategoryFlag && this.categoryAndScopeForm.dirty && this.categoryAndScopeForm.valid) {
        this.confirmatioPopUp(isNextClick);
      } else if (!isNextClick && this.categoryAndScopeForm.valid) {
        this.disableSaveCategoryEmit.emit(true);
        this.disableSave = true;
        if (!this.editedCategoryFlag) {
          this.saveCategoryAndScopeVm.categoryScopeId = 0;
          this.saveCategoryAndScopeVm.supplierId = this.supplierId;
          this.saveCategoryAndScopeVm.userId = this.userId;
        }

        if (this.saveCategoryAndScopeVm.typeId && this.listOfFiles.length === 0) {
          this.adminService.showMessage('Please Upload documents.');
          this.disableSaveCategoryEmit.emit(false);
          this.disableSave = false;
          return;
        }
        if (this.saveCategoryAndScopeVm.isFileChanged) {
          this.listOfFiles.forEach((f) => {
            this.formData.append(this.saveCategoryAndScopeVm.fileNameId, f.fileInfo);
          });
        }
        this.formData.append('CategoryAndScope', JSON.stringify(this.saveCategoryAndScopeVm));
        this.categoryScopeService.saveCategoryAndScope(this.formData).subscribe(res => {
          if (res) {
            this.discriptionValidtion = false;
            if (this.saveCategoryAndScopeVm.categoryScopeId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            this.isSubmitted = false;
            this.saveCategoryAndScopeVm.description = '';
            this.disableSaveCategoryEmit.emit(false);
            this.disableSave = false;
            this.formData = new FormData();
            this.saveCategoryAndScopeVm = new CategoryAndScopeVm();
            this.fileList = [];
            this.listOfFiles = [];
            this.categoryAndScopeForm.reset();
            this.editedCategoryFlag = false;
            this.attachToggle = false;
            this.filterParentCategoryOptions = this.parentCategory;
            this.filterSubCategoryOptions = this.subCategory;
            this.filterChildCategoryOptions = this.childCategory;
            this.getCategoryScopeList();
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
          }
        });
      } else if (isNextClick && !this.categoryAndScopeForm.valid) {
        if (this.savaAllCategoryAndScopeVm?.length !== 0) {
          this.nextTabEmit.emit();
        } else {
          this.isSubmitted = true;
          // for (let i in this.categoryAndScopeForm.controls) {
          //   this.categoryAndScopeForm.controls[i].markAsTouched();
          // };
          return
        }
      } else {
        if (this.categoryAndScopeForm.valid) {
          if (isNextClick) {
            this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
          } else {
            this.adminService.showMessage('Please fill in all mandatory fields before save');
          }
        }
      }
    }
  }

  deleteCategoryScope(index: number, fileNameId: string, categoryScopeId: number) {
    if (categoryScopeId > 0) {
      const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent,
        {
          disableClose: false,
          hasBackdrop: true,
          autoFocus: true,
          width: '35%',
          height: '40%',
          position: {
            top: 'calc(10vw + 20px)',
          },
          panelClass: 'confirmdialog',
          data: {
            parentDialogRef: this.commonService.deletetModalConfig,  // Passing the parent dialog reference
            deleteFlag: true
          },
        });
      this.commonService.deletetModalConfig;
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.categoryScopeService.deleteCategoryAndScope(categoryScopeId, true, this.userId).subscribe(res => {
            if (res) {
              this.getCategoryScopeList();
              this.adminService.showMessage('Category Information ' + (index + 1) + ' removed successfully.');
            }
          });
        } else {
          this.dialog.closeAll();
        }
      });
    }
  }
  // saveCategoryAndScope() {
  // this.disableSaveCategoryEmit.emit(true);
  // let saveAllValue = this.savaAllCategoryAndScopeVm.filter(x => x.isChangedFlag);
  // if (saveAllValue.length === 0) {
  //   this.disableSaveCategoryEmit.emit(false);
  //   this.adminService.showMessage('Add or Update category.');
  //   return;
  // }
  // if (this.categoryAndScopeForm.valid) {
  //   this.disableSaveCategoryEmit.emit(false);
  //   this.adminService.showMessage('Please click Add to entered value to save.');
  //   return;
  // }
  // this.formData.append('CategoryAndScope', JSON.stringify(saveAllValue));
  // this.categoryScopeService.saveCategoryAndScope(this.formData).subscribe(res => {
  //   if (res) {
  //     this.adminService.showMessage('Data on the form has been successfully saved.');
  //     this.disableSaveCategoryEmit.emit(false);
  //     this.getCategoryScopeList();
  //     this.formData = new FormData();
  //   }
  // });
  // }

  downloadFile(path: string) {
    this.commonService.downloadOrOpenFile(path);
  }

  deleteFile(file: any) {
    this.listOfFiles = this.listOfFiles.filter(x => x.fileInfo.name !== file.fileInfo.name);
    if (file.docId > 0) {
      this.categoryScopeService.deleteDocument(file.docId, this.userId).subscribe(res => { });
    }
  }
  // convertBytesToKb(bytes:number){
  //     return bytes / (1000 * 1000);
  // }

  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {
    const financialFields = Object.values(this.categoryAndScopeForm.controls).some(control => control.dirty || control.value);
    if (financialFields) {
      const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent,
        {
          disableClose: false,
          hasBackdrop: true,
          autoFocus: true,
          width: '35%',
          height: '40%',
          position: {
            top: 'calc(10vw + 20px)',
          },
          panelClass: 'confirmdialog',
          data: {
            parentDialogRef: this.commonService.dataLostModalConfig,  // Passing the parent dialog reference
            checkBtnValue: isNextClick ? "next" : isPreviousClick ? "previous" : ""
          },
        })
      // this.commonService.dataLostModalConfig);
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (isNextClick) {
            // this.addCategories();
            this.nextTabEmit.emit();
            return;
          } else {
            this.previousTabClick = true;
            this.dialogResult.emit(true);
            // this.addCategories();
          }
        } else {
          //New condition for previous No Btn
          if (isPreviousClick) {
            return;
          }
          if (isNextClick) {
            return;
            // this.nextTabEmit.emit();
          }
          else {
            this.dialogResult.emit(true);
          }
        }
      });
    } else {
      if (isNextClick) {
        if (this.savaAllCategoryAndScopeVm.length > 0) {
          this.nextTabEmit.emit();
        } else {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        }
      }
      else {
        this.categoryAndScopeForm.resetForm();
        this.dialogResult.emit(true);
      }
    }
  }

  onTypeChange() {
    if (this.saveCategoryAndScopeVm.typeId) {
      this.discriptionValidtion = true;
    } else {
      this.discriptionValidtion = false;
    }
  }

  toggleAttach() {
    this.attachToggle = !this.attachToggle;
  }
  closeAttach() {
    this.attachToggle = !this.attachToggle;
  }
}
