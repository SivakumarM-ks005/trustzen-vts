import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import moment from 'moment';
import { AdminService } from '../../core/services/admin/admin.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { MandatoryAttachmentTypeMas, OptionalAttachmentTypeMas, SaveAttachmentVm, SaveManAndOptAttachmentVm } from '../../core/models/supplier-attachment.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { nextTick } from 'process';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { SupplierAttachmentService } from '../../core/services/supplier-management/supplier-attachment.service';

@Component({
  selector: 'app-supplier-attachment',
  templateUrl: './supplier-attachment.component.html',
  styleUrl: './supplier-attachment.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, MatFormField, MatLabel, MatSelect, MatTooltip, MatOption, NgIf, MatError, MatInput, CdkTextareaAutosize, MatHint, MatIcon, MatBadge, MatButton]
})
export class SupplierAttachmentComponent implements OnInit {
  @Input() supplierId: number;
  @Input() userId: number;
  attachmentType: MandatoryAttachmentTypeMas[] = new Array<MandatoryAttachmentTypeMas>();
  filterAttachmentType: MandatoryAttachmentTypeMas[] = new Array<MandatoryAttachmentTypeMas>();
  manAttachmentType: OptionalAttachmentTypeMas[] = new Array<OptionalAttachmentTypeMas>();
  filterManAttachmentType: any;
  facility: number;
  saveManAttachment: SaveAttachmentVm = new SaveAttachmentVm();
  saveAllManData: any[] = [];
  saveOptAttachment: SaveAttachmentVm = new SaveAttachmentVm();
  saveAllOptAttachment: SaveAttachmentVm[] = new Array<SaveAttachmentVm>();
  loggedUserDetails: any;
  @ViewChild('mandatoryForm', { static: false }) mandatoryForm: NgForm;
  @ViewChild('optionalForm', { static: false }) optionalForm: NgForm;
  manFileList: File[] = new Array<File>();
  manListOfFiles: any[] = [];
  optFileList: File[] = new Array<File>();
  optListOfFiles: any[] = [];
  showOptionalAttachFlag: boolean = false;
  saveData: SaveManAndOptAttachmentVm = new SaveManAndOptAttachmentVm();
  @Output() SaveDraftFlag = new EventEmitter<boolean>();
  manFileChange: boolean = false;
  optFileChange: boolean = false;
  @Output() disableSaveAttachEmit = new EventEmitter<boolean>();
  previousTabClick: boolean = false;
  @Output() dialogResult = new EventEmitter<boolean>();
  @Output() nextTabEmit = new EventEmitter();
  @ViewChild('manFileInput') manFileInput: ElementRef;
  @ViewChild('optFileInput') optFileInput: ElementRef;
  @Output() tabValidCheckEmit = new EventEmitter();
  numberOfMandatoryAttachments: number = 3;
  editedOptionalFlag: boolean = false;
  mandatoryFormList!: FormGroup;
  disableStatusBased: boolean = true;
  attachOptionalToggle: boolean = false;
  status: any;
  isSubmitted = false;
  @Output() NextFlag = new EventEmitter<boolean>();
  saveAllAttachment: any;

  constructor(private attachmentService: SupplierAttachmentService,
    public commonService: CommonService,
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public activateRouter: ActivatedRoute
  ) {
    this.mandatoryFormList = this.fb.group({
      mandatoryFormInfos: this.fb.array([]),
    });
  }
  ngOnInit() {
    this.loggedUserDetails = JSON.parse(localStorage.getItem('loginDetails')!);
    this.saveManAttachment.uploadedUserName = this.loggedUserDetails ? this.loggedUserDetails.userName : '';
    this.saveManAttachment.uploadedDate = moment(new Date()).format(this.commonService.showFormat.toUpperCase());
    this.saveOptAttachment.uploadedUserName = this.loggedUserDetails ? this.loggedUserDetails.userName : '';
    this.saveOptAttachment.uploadedDate = moment(new Date()).format(this.commonService.showFormat.toUpperCase());
    // projectDetailsInfos: this.fb.array([]);
    // for (let i = 0; i < this.numberOfMandatoryAttachments; i++) {
    //   this.saveManAttachment.controlValidate = ''
    //   this.saveAllManData.push(this.saveManAttachment)
    // }

    this.getAttachmentTypeMas();

    this.activateRouter?.params?.subscribe((response) => {

      if (response.profile === 'manageprofile') {
        this.status = response.profile;
        this.mandatoryFormList.disable();
        this.mandatoryFormList.get('mandatoryFormInfos')?.disable();
      }

    });
  }

  // createMandatoryForm(): FormGroup {
  //   return this.fb.group({
  //     attachmentTypeId: [null, Validators.required],
  //     uploadedUserName: [this.saveManAttachment.uploadedUserName],
  //     uploadedDate: [this.saveManAttachment.uploadedDate],
  //     description: ['', [Validators.required, Validators.maxLength(1500)]],
  //     supplierId: [this.supplierId],
  //     fileInfo: this.fb.array([])
  //   });
  // }
  get mandatoryFormInfos(): FormArray {
    return this.mandatoryFormList.get('mandatoryFormInfos') as FormArray;
  }
  getFilesArray(index: number): FormArray {
    return this.mandatoryFormInfos.at(index).get('fileInfo') as FormArray;
  }
  getAttachmentTypeMas() {
    this.attachmentService.getAttachmentTypes()
      .subscribe({
        next: res => {
          this.manAttachmentType = res.mandatoryAttachmentTypes;
          this.filterManAttachmentType = this.manAttachmentType;
          this.attachmentType = res.optionalAttachmentTypes;
          this.filterAttachmentType = this.attachmentType;
          this.tabValidCheckEmit.emit();
        }, error: error => this.adminService.showMessage(error),
        complete: () => { this.getAttachmentData(); }
      });
  }
  createMandatoryForm(savedValue: any): FormGroup {
    return this.fb.group({
      mandatoryAttachmentId: [savedValue.mandatoryAttachmentId || 0],
      attachmentTypeId: [savedValue.attachmentTypeId || '', Validators.required],
      uploadedUserName: [savedValue.uploadedUserName || this.saveManAttachment.uploadedUserName],
      uploadedDate: [savedValue.uploadedDate ? moment(new Date(savedValue.uploadedDate)).format(this.commonService.showFormat.toUpperCase()) : this.saveManAttachment.uploadedDate],
      description: [savedValue.description || '', [Validators.required, Validators.maxLength(1500)]],
      supplierId: [savedValue.supplierId || this.supplierId],
      userId: [savedValue.userId || this.userId],
      attachToggle: [false],
      fileInfo: this.fb.array(savedValue.fileInfo || [])
    });
  }
  initializeForms(count: number): void {
    for (let i = 0; i < count; i++) {
      this.mandatoryFormInfos.push(this.createMandatoryForm({}));
      this.mandatoryFormInfos.at(i).get('uploadedDate')?.disable();
      this.mandatoryFormInfos.at(i).get('uploadedUserName')?.disable();
    }
    // this.mandatoryFormInfos
    // (<FormArray>this.mandatoryFormInfos)
    //   .controls
    //   .forEach(control => {
    //     if (control.value.uploadedDate){
    //       control.value.uploadedDate.disable();
    //     }
    //   })

  }
  getAttachmentData() {
    this.attachmentService.getAttachmentDetails(this.supplierId)
      .subscribe({
        next: res => {
          if (this.status === 'manageprofile') {
            this.commonService.getSupplier(this.supplierId).subscribe({
              next: (data) => {

                if (moment(localStorage.getItem('expiryDate')).format('YYYY-MM-DDTHH:mm:ssZ') !== moment(data.expiryDate).format('YYYY-MM-DDTHH:mm:ssZ')) {
                  // Define the default data
                  const defaultData = {
                    "mandatoryAttachmentId": 1,
                    "optAttachmentId": 0,
                    "attachmentTypeId": 1,
                    "attachmentType": "Commercial/Trade License",
                    "description": "",
                    "attachment": null,
                    "uploadedBy": 40,
                    "uploadedByUser": {
                      "userId": 40,
                      "applicantionId": 1,
                      "userName": "deltallc"
                    },
                    "uploadedUserName": "deltallc",
                    "uploadedDate": "2025-03-03T05:00:58.793013",
                    "active": false,
                    "deleteFlag": false,
                    "createdUserId": 0,
                    "supplierId": 29,
                    "userId": 40,
                    "fileInfo": [
                    ]
                  };

                  // Ensure mandatoryFormInfos is a FormArray
                  const mandatoryFormInfos = this.mandatoryFormInfos; // Equivalent to this.mandatoryFormList.get('mandatoryFormInfos') as FormArray

                  // Clear existing FormArray to avoid duplicates
                  mandatoryFormInfos.clear();

                  // Add defaultData as the first entry
                  mandatoryFormInfos.push(this.createMandatoryForm(defaultData));
                  mandatoryFormInfos.at(0).get('uploadedDate')?.disable();
                  mandatoryFormInfos.at(0).get('uploadedUserName')?.disable();

                  // Loop through existing attachments and add them
                  if (res.mandatoryAttachment && Array.isArray(res.mandatoryAttachment)) {
                    res.mandatoryAttachment.forEach((manAttach: any, index: number) => {
                      mandatoryFormInfos.push(this.createMandatoryForm(manAttach));
                      mandatoryFormInfos.at(index + 1).get('attachmentTypeId')?.disable();
                      mandatoryFormInfos.at(index + 1).get('description')?.disable();
                      mandatoryFormInfos.at(index + 1).get('uploadedDate')?.disable();
                      mandatoryFormInfos.at(index + 1).get('uploadedUserName')?.disable();
                    });
                  }

                  if (this.numberOfMandatoryAttachments > res.mandatoryAttachment.length) {
                    this.initializeForms((this.numberOfMandatoryAttachments - res.mandatoryAttachment.length));
                  }
                } else if (moment(localStorage.getItem('issuedDate')).format('YYYY-MM-DDTHH:mm:ssZ') !== moment(data.issuedDate).format('YYYY-MM-DDTHH:mm:ssZ')) {

                  // Define the default data
                  const defaultData = {
                    "mandatoryAttachmentId": 1,
                    "optAttachmentId": 0,
                    "attachmentTypeId": 4,
                    "attachmentType": "Commercial/Trade License",
                    "description": "",
                    "attachment": null,
                    "uploadedBy": 40,
                    "uploadedByUser": {
                      "userId": 40,
                      "applicantionId": 1,
                      "userName": "deltallc"
                    },
                    "uploadedUserName": "deltallc",
                    "uploadedDate": "2025-03-03T05:00:58.793013",
                    "active": false,
                    "deleteFlag": false,
                    "createdUserId": 0,
                    "supplierId": 29,
                    "userId": 40,
                    "fileInfo": [
                    ]
                  };

                  // Ensure mandatoryFormInfos is a FormArray
                  const mandatoryFormInfos = this.mandatoryFormInfos; // Equivalent to this.mandatoryFormList.get('mandatoryFormInfos') as FormArray

                  // Clear existing FormArray to avoid duplicates
                  mandatoryFormInfos.clear();

                  // Add defaultData as the first entry
                  mandatoryFormInfos.push(this.createMandatoryForm(defaultData));
                  mandatoryFormInfos.at(0).get('uploadedDate')?.disable();
                  mandatoryFormInfos.at(0).get('uploadedUserName')?.disable();

                  // Loop through existing attachments and add them
                  if (res.mandatoryAttachment && Array.isArray(res.mandatoryAttachment)) {
                    res.mandatoryAttachment.forEach((manAttach: any, index: number) => {
                      mandatoryFormInfos.push(this.createMandatoryForm(manAttach));
                      mandatoryFormInfos.at(index + 1).get('attachmentTypeId')?.disable();
                      mandatoryFormInfos.at(index + 1).get('description')?.disable();
                      mandatoryFormInfos.at(index + 1).get('uploadedDate')?.disable();
                      mandatoryFormInfos.at(index + 1).get('uploadedUserName')?.disable();
                    });
                  }

                  if (this.numberOfMandatoryAttachments > res.mandatoryAttachment.length) {
                    this.initializeForms((this.numberOfMandatoryAttachments - res.mandatoryAttachment.length));
                  }
                }
              }
            })
          } else {
            this.saveAllAttachment = res?.mandatoryAttachment
            if (res.mandatoryAttachment.length > 0) {
              res.mandatoryAttachment.forEach((manAttach: any, index: number) => {
                this.mandatoryFormInfos.push(this.createMandatoryForm(manAttach));
                this.mandatoryFormInfos.at(index).get('uploadedDate')?.disable();
                this.mandatoryFormInfos.at(index).get('uploadedUserName')?.disable();
              });
              if (this.numberOfMandatoryAttachments > res.mandatoryAttachment.length) {
                this.initializeForms((this.numberOfMandatoryAttachments - res.mandatoryAttachment.length));
              }
            }
            else {
              this.initializeForms(this.numberOfMandatoryAttachments);
            }
            // this.saveManAttachment = res.mandatoryAttachment;
            // this.manFileList = res.mandatoryAttachment.fileInfo;
            // this.manListOfFiles = res.mandatoryAttachment.fileInfo;
            // this.saveManAttachment.uploadedDate =
            //   moment(new Date(this.saveManAttachment.uploadedDate)).format(this.commonService.hindDateFormat);
            // } else {
            //   this.saveManAttachment.uploadedUserName = this.loggedUserDetails ? this.loggedUserDetails.userName : '';
            //   this.saveManAttachment.uploadedDate = moment(new Date()).format(this.commonService.hindDateFormat);
            // }
            this.showOptionalAttachFlag = res.optionalAttachFlag;
            if (this.showOptionalAttachFlag) {
              res.optionalAttachment.forEach((item: any) => {
                item.uploadedDate =
                  moment(new Date(item.uploadedDate)).format(this.commonService.showFormat.toUpperCase());
              });
              this.saveAllOptAttachment = res.optionalAttachment;
              this.saveOptAttachment = new SaveAttachmentVm();
              this.saveOptAttachment.uploadedUserName = this.loggedUserDetails ? this.loggedUserDetails.userName : '';
              this.saveOptAttachment.uploadedDate = moment(new Date()).format(this.commonService.showFormat.toUpperCase());
              // this.saveOptAttachment = res.optionalAttachment;
              // this.optFileList = res.optionalAttachment.fileInfo;
              // this.optListOfFiles = res.optionalAttachment.fileInfo;
              // this.saveOptAttachment.uploadedDate =
              //   moment(new Date(this.saveOptAttachment.uploadedDate)).format(this.commonService.hindDateFormat);
            }
          }
        }, error: error => this.adminService.showMessage(error),
        complete: () => {
          this.activateRouter?.params?.subscribe((response) => {
            if (response.status === 'In-Progress') {
              this.status = response.status;
              this.mandatoryFormList.disable();
              this.mandatoryFormList.get('mandatoryFormInfos')?.disable();
              this.disableStatusBased = false;
            } else if (response.profile === 'manageprofile') {
              this.status = response.status;
              this.mandatoryFormList.disable();
              this.mandatoryFormList.get('mandatoryFormInfos')?.disable();
            }

          });
        }
      });

  }

  displayAction(actionLookupId: number): string {
    return actionLookupId > 0 ? this.filterAttachmentType.find(ac => ac.attachmentTypeId === actionLookupId)?.attachmentType! : '';
  }
  displayMandatoryAction(actionLookupId: number): string {
    return actionLookupId > 0 ? this.filterManAttachmentType.find((ac: { attachmentTypeId: number; }) => ac.attachmentTypeId === actionLookupId)?.attachmentType! : '';
  }

  onMandatoryFileChange(event: any, index: number) {
    const files = event.target.files;
    if (files.length) {
      const filesArray = this.getFilesArray(index);
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        // if (
        //   this.manListOfFiles.find(obj => obj.fileInfo.name === selectedFile.name)) {
        //   this.adminService.showMessage('This File Already Exist.');
        //   this.manFileInput.nativeElement.value = null;
        //   return;
        // }.
        const existingDocIndex = filesArray.controls.findIndex(
          (docGroup: AbstractControl) => {
            const group = docGroup as FormGroup;
            return group.value.fileInfo.name === selectedFile.name;
          }
        );

        if (existingDocIndex >= 0) {
          const message = `File ${selectedFile.name} already exists.`;
          this.adminService.showMessage(message);
          this.manFileInput.nativeElement.value = null;
          return;
        }
        let fileDetail: any = {};
        fileDetail.fileInfo = selectedFile;
        fileDetail.docId = 0;
        // filesArray.push(fileDetail);
        filesArray.push(this.fb.control(fileDetail));
      }
      // this.manListOfFiles = this.getFilesArray(index).value;
      // var selectedFile = event.target.files[0];
      // this.manFileList.push(selectedFile);
      // this.manListOfFiles.push(selectedFile);
      this.manFileChange = true;
      this.manFileInput.nativeElement.value = null;
      this.toggleAttach(index);
    }
  }
  onOptionalFileChange(event: any) {
    const files = event.target.files;
    if (files.length) {
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        if (
          this.optListOfFiles.find(obj => obj.fileInfo.name === selectedFile.name)) {
          this.adminService.showMessage('This File Already Exist.');
          this.optFileInput.nativeElement.value = null;
          return;
        }
        let fileDetail: any = {};
        fileDetail.fileInfo = selectedFile;
        fileDetail.docId = 0;
        this.optFileList.push(fileDetail);
      }
      this.optListOfFiles = this.optFileList;
      // var selectedFile = event.target.files[0];
      // this.optFileList.push(selectedFile);
      // this.optListOfFiles.push(selectedFile);
      this.optFileChange = true;
      this.optFileInput.nativeElement.value = null;
      this.toggleAttachOptional();
    }
  }
  editOptionalAttach(index: number) {
    this.editedOptionalFlag = true;
    this.saveOptAttachment = this.saveAllOptAttachment[index];
    this.optListOfFiles = this.saveAllOptAttachment[index].fileInfo;
    this.optFileList = this.optListOfFiles;
    this.activateRouter?.params?.subscribe((response) => {
      if (response.status === 'In-Progress') {
        this.mandatoryFormList.disable();
        this.mandatoryFormList.get('mandatoryFormInfos')?.disable();
        this.disableStatusBased = false;
      } else if (response.profile === 'manageprofile') {
        this.status = response.profile;
      }
    });
  }
  deleteMandatoryFile(mIdx: number, fileIndex: number, docId: number) {
    // this.manFileList.splice(index, 1);
    // this.manListOfFiles = this.manFileList;
    this.getFilesArray(mIdx).removeAt(fileIndex);
    if (docId > 0) {
      this.attachmentService.deleteDocument(docId, this.userId).subscribe(res => { });
    }
  }

  deleteOptionalFile(index: number, docId: number) {
    this.optFileList.splice(index, 1);
    this.optListOfFiles = this.optFileList;
    if (docId > 0) {
      this.attachmentService.deleteDocument(docId, this.userId).subscribe(res => { });
    }
  }

  saveAttachments(isNextClick: boolean = false, isOptionalSave: boolean = false) {
    this.isSubmitted = true;

    if (isNextClick && this.saveAllOptAttachment.length !== 0 && this.mandatoryFormList.dirty || isNextClick && this.saveAllOptAttachment.length !== 0 && this.optionalForm.dirty) {
      this.confirmatioPopUp(isNextClick);
    } else if (!isNextClick && this.mandatoryFormList.valid) {
      const formData = new FormData();
      if (!isOptionalSave) {
        if (this.mandatoryFormList.valid) {
          let formValue = this.mandatoryFormList.value;
          let itsBreaked = false;
          for (let index = 0; index < formValue.mandatoryFormInfos.length; index++) {
            if (formValue.mandatoryFormInfos[index].fileInfo.length === 0) {
              this.adminService.showMessage('Please upload files on Attachment ' + (index + 1));
              itsBreaked = true;
              break;
            }
          }
          if (itsBreaked) {
            return;
          }
        } else {
          this.mandatoryFormList.markAllAsTouched();
          if (isNextClick) {
            this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
          } else {
            this.adminService.showMessage('Please fill in all mandatory fields before save!.');
          }
          return;
        }
      }

      if (this.showOptionalAttachFlag && (this.optionalForm.dirty || this.editedOptionalFlag)) {
        if (this.optionalForm.valid) {
          if (this.optFileList.length === 0) {
            this.adminService.showMessage('Please upload optional document');
            return;
          }
          if (this.optFileChange) {
            this.optListOfFiles.forEach(fl => {
              formData.append('optional', fl.fileInfo);
            });
          }
          this.saveOptAttachment.supplierId = this.supplierId;
          this.saveOptAttachment.userId = this.userId;
        }
        else {
          for (let i in this.optionalForm.controls) {
            this.optionalForm.controls[i].markAsTouched();
          }
          if (isNextClick) {
            this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
          } else {
            this.adminService.showMessage('Please fill in all mandatory fields before save!.');
          }
          return;
        }
      }
      if (isNextClick) {
        if (this.showOptionalAttachFlag) {
          if (!this.mandatoryFormList.dirty || !this.optionalForm.dirty) {
            this.nextTabEmit.emit();
            return;
          }
        } else {
          if (!this.mandatoryFormList.dirty) {
            this.nextTabEmit.emit();
            return;
          }
        }
      }
      this.disableSaveAttachEmit.emit(true);
      this.saveData.manAttachFlag = !isOptionalSave;
      this.saveData.optionalAttachFlag = (this.showOptionalAttachFlag && (this.optionalForm.dirty || this.editedOptionalFlag));
      this.saveData.saveMandatoryDto = this.mandatoryFormList.value.mandatoryFormInfos;
      this.saveData.saveOptionalDto = this.saveOptAttachment;
      this.saveData.saveMandatoryDto.forEach((item, idx) => {
        item.fileNameId = 'mandatory' + idx;
        item.fileInfo.forEach(fl => {
          formData.append(item.fileNameId, fl.fileInfo);
        });
      });
      formData.append('attachDto', JSON.stringify(this.saveData));
      this.attachmentService.saveAttachments(formData).subscribe(res => {
        if (res) {
          if (this.saveAllOptAttachment.length !== 0) {
            this.adminService.showMessage('Data on the form has been updated successfully');
          } else {
            this.adminService.showMessage('Data on the form has been saved successfully');
          }
          this.saveManAttachment = new SaveAttachmentVm();
          this.manFileChange = false;
          this.manFileList = [];
          this.manListOfFiles = [];
          this.mandatoryFormList.reset();
          this.mandatoryFormList?.clearValidators();
          this.mandatoryFormList = this.fb.group({
            mandatoryFormInfos: this.fb.array([]),
          });

          if (this.showOptionalAttachFlag) {
            this.saveOptAttachment = new SaveAttachmentVm();
            this.showOptionalAttachFlag = false;
            this.optFileChange = false;
            this.optFileList = [];
            this.optListOfFiles = [];
            this.optionalForm.reset();
            this.attachOptionalToggle = false;
            if (this.editedOptionalFlag) {
              this.editedOptionalFlag = false;
            }
          }
          if (this.saveManAttachment.mandatoryAttachmentId === 0) {
            this.tabValidCheckEmit.emit();
          }
          this.getAttachmentTypeMas();
          this.disableSaveAttachEmit.emit(false);
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

    } else if (isNextClick && !this.mandatoryFormList.dirty) {
      this.nextTabEmit.emit();
      this.isSubmitted = true;
    } else if (this.mandatoryFormList.valid) {
      if (isNextClick) {
        this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
      } else {
        this.adminService.showMessage('Please fill in all mandatory fields before save');
      }
    }
  }

  isOptionDisabled(optionId: number, currentIndex: number): boolean {
    const selectedValues = this.mandatoryFormInfos.value.map((group: any) => group.attachmentTypeId);
    return selectedValues.includes(optionId) && selectedValues[currentIndex] !== optionId;
  }

  // confirmatioPopUp(isNextClick: boolean = false): void {

  //   const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, this.commonService.dataLostModalConfig);
  //   cancelDialogRef.afterClosed().subscribe(result => {
  //     if (result) {

  //       // this.PQquestionnaries();

  //     } else {
  //       if (isNextClick) {
  //         this.nextTabEmit.emit();

  //       }

  //     }
  //   });

  // }

  downloadFile(path: string) {
    this.commonService.downloadOrOpenFile(path);
  }
  clearOptionalValue() {
    this.optionalForm.resetForm();
  }
  deleteOptionaAttach(optDocId: number, index: number) {
    if (optDocId > 0) {
      const cancelDialogRef = this.dialog.open(ConfirmationDialogComponent, {
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
        },
      })
      // this.commonService.deletetModalConfig);
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.attachmentService.deleteOptionalAttach(optDocId, true, this.userId).subscribe(res => {
            if (res) {
              this.getAttachmentTypeMas();
              this.adminService.showMessage('Optional Attachment ' + (index + 1) + ' removed successfully.');
            }
          });
        } else {
          this.dialog.closeAll();
        }
      });
    }
  }

  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {
    let mandatoryFields: boolean = false;
    let optionalFields: boolean = false;
    mandatoryFields = Object.values(this.mandatoryFormList.controls).some(control => control.dirty || control.value);
    if (this.showOptionalAttachFlag) {
      optionalFields = Object.values(this.optionalForm.controls).some(control => control.dirty || control.value);
    }
    if ((mandatoryFields && this.mandatoryFormList.dirty) || (optionalFields && this.optionalForm.dirty)) {
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
            // this.saveAttachments();
            this.nextTabEmit.emit();
            return
          } else {
            this.previousTabClick = true;
            // this.saveAttachments();
            this.dialogResult.emit(true);
          }
        } else {
          //New condition for previous No Btn
          if (isPreviousClick) {
            return;
          }
          if (isNextClick) {
            return;
          }
          this.dialogResult.emit(true);
        }
      });
    }
    else {
      if (isNextClick) {
        this.nextTabEmit.emit();
      }
      else {
        this.dialogResult.emit(true);
      }
    }
    //   // this.mandatoryFormList.resetForm();
    //   this.mandatoryFormList = this.fb.group({
    //     mandatoryFormInfos: this.fb.array([]),
    //   });
    //   if (this.showOptionalAttachFlag) {
    //     this.optionalForm.resetForm();
    //   }
    //   this.dialogResult.emit(true);
    // }
    // if (this.mandatoryForm != undefined && this.optionalForm != undefined) {
    //   mandatoryFields = Object.values(this.mandatoryForm.controls).some(control => control.dirty || control.value);
    //   optionalFields = Object.values(this.optionalForm.controls).some(control => control.dirty || control.value);
    // } else {
    //   mandatoryFields = Object.values(this.mandatoryForm.controls).some(control => control.dirty || control.value);
    // }

    // if (optionalFields && mandatoryFields) {
    //   this.commonService.openCancelDialog(this.mandatoryForm, this.optionalForm, this.dialogResult);
    // } else if (!optionalFields && mandatoryFields) {
    //   this.commonService.openCancelDialog(this.mandatoryForm, null, this.dialogResult);
    // }    
  }
  toggleAttach(index: number) {
    const evaluationCategories = this.mandatoryFormList.get('mandatoryFormInfos') as FormArray;
    evaluationCategories.at(index).get('attachToggle')?.setValue(!evaluationCategories.at(index).get('attachToggle')?.value);
  }
  closeAttach(index: number) {
    const evaluationCategories = this.mandatoryFormList.get('mandatoryFormInfos') as FormArray;
    evaluationCategories.at(index).get('attachToggle')?.setValue(!evaluationCategories.at(index).get('attachToggle')?.value);
  }
  toggleAttachOptional() {
    this.attachOptionalToggle = !this.attachOptionalToggle;
  }
  closeAttachOptional() {
    this.attachOptionalToggle = !this.attachOptionalToggle;
  }

  ClearValues(): boolean {
    // this.SaveDraftFlag.emit(this.commonService.CommonClearValues(this.financialForm));
    if (this.mandatoryFormList.valid) {
      if (this.optionalForm?.form.valid) {
        this.SaveDraftFlag.emit(true)
      } else {
        this.SaveDraftFlag.emit(false)
      }
    } else {
      this.SaveDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.mandatoryFormList);
  }

  NextButtonValidation() {
    if (this.saveAllAttachment?.length !== 0) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false)
    }
  }

}
