import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonService } from '../../../core/services/common.service';
import moment from 'moment';
import { IssuingCountrylist, IssuingState, LicenseCategoryMasDto, LicenseCertificationDto, LicenseStatusMasDto, LicenseTypeMasDto } from '../../../core/models/licence-certificates.model';
import { AdminService } from '../../../core/services/admin/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { LoginService } from '../../../core/services/login/login.service';
import { LicenceActivityService } from '../../../core/services/supplier-management/licence-activity.service';
import { PreQualificationProcessComponent } from '@app/pre-qualification-process/pre-qualification-process.component';

@Component({
  selector: 'app-licence-certificates',
  templateUrl: './licence-certificates.component.html',
  styleUrl: './licence-certificates.component.scss',
  standalone: true,
  imports: [NgIf, MatButton, MatTooltip, FormsModule, MatFormField, MatLabel, MatSelect, MatOption, NgFor, MatError, MatInput, MatDatepickerInput, MatHint, MatDatepickerToggle, MatSuffix, MatDatepicker, MatIcon, MatBadge, DatePipe]
})
export class LicenceCertificatesComponent implements OnInit {
  @Input() supplierId: number;
  @Input() userId: number;
  issuingCountryList: IssuingCountrylist[] = [];
  issuingStateList: IssuingState[] = [];
  licenseCategoryList: LicenseCategoryMasDto[] = [];
  licenseStatusList: LicenseStatusMasDto[] = [];
  licenseTypeList: LicenseTypeMasDto[] = new Array<LicenseTypeMasDto>();
  saveLicenseVm: LicenseCertificationDto = new LicenseCertificationDto();
  saveAllLicenseVm: LicenseCertificationDto[] = new Array<LicenseCertificationDto>();
  @ViewChild('licenceCertificatesForm', { static: false }) licenceCertificatesForm: NgForm;
  listOfFiles: any[] = [];
  fileChange: boolean = false;
  editLicenseFlag: boolean = false;
  editLicenceIndex: number;
  formData = new FormData();
  disableSave: boolean = false;
  @Output() tabValidCheckEmitchild = new EventEmitter();
  previousTabClick: boolean = false;
  @Output() tabPreviousChild = new EventEmitter();
  @Output() tabNextChild = new EventEmitter();
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() SaveCerDraftFlag = new EventEmitter<boolean>();
  disableStatusBased: boolean = true;
  attachToggle: boolean = false;
  @Output() pageUp = new EventEmitter();
  status: any;
  isSubmitted = false;
  @Output() NextFlag = new EventEmitter<boolean>();
  profilStatus: any;

  constructor(
    private licenceActivityService: LicenceActivityService,
    private loginservice: LoginService,
    public commonService: CommonService,
    private adminService: AdminService,
    private dialog: MatDialog,
    public activateRouter: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.initDropDown();
    this.getCountryData();
  }

  // initDropDown() {
  //   this.licenseTypeList = [
  //     { id: 1, name: 'Import License' },
  //     { id: 2, name: 'Export License' },
  //     { id: 3, name: 'Authorized Distributor License' },
  //     { id: 4, name: 'Software Licensing' },
  //     { id: 5, name: 'Heavy Equipment Handling' },
  //     { id: 6, name: 'Vehicle and Transport License' },
  //   ];
  // }
  getCountryData() {
    this.loginservice.getCountry()
      .subscribe({
        next: (res: any) => {
          this.issuingCountryList = res;
        }, error: (error: any) => this.adminService.showMessage(error),
        complete: () => { this.getCategoryDetails(); }
      });
  }

  getCategoryDetails() {
    this.licenceActivityService.getLicenseCategory()
      .subscribe({
        next: res => {
          this.licenseCategoryList = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { this.getLicenseTypes() }
      });
  }
  getLicenseTypes() {
    this.licenceActivityService.getLicenseTypes()
      .subscribe({
        next: res => {
          this.licenseTypeList = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { this.getStatusDetails() }
      });
  }
  getStatusDetails() {
    this.licenceActivityService.getLicenseStatus()
      .subscribe({
        next: res => {
          this.licenseStatusList = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { this.getAllLicenseCertificationList(); }
      });
  }

  getStates(countryId: number): void {
    this.loginservice.GetCountryBaseaState(countryId)
      .subscribe({
        next: (res: any) => {
          this.issuingStateList = res;
        }, error: (error: any) => this.adminService.showMessage(error),
        complete: () => { }
      });
  }

  getAllLicenseCertificationList() {
    this.licenceActivityService.getLicenseCertifications(this.supplierId)
      .subscribe({
        next: res => {
          res.forEach((item, index) => {
            item.supplierId = item.supplierId;
            item.startDate = new Date(item.startDate);
            item.expiryDate = new Date(item.expiryDate);
            // item.relatedParty.startDate = new Date(item.relatedParty.startDate);
          });
          this.tabValidCheckEmitchild.emit();
          this.saveAllLicenseVm = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => {
          this.activateRouter?.params?.subscribe((response) => {
            if (response.status === 'In-Progress') {
              this.status = response.status;
              this.disableStatusBased = false;
              if (this.licenceCertificatesForm) {
                Object.keys(this.licenceCertificatesForm.controls).forEach((key) => {
                  this.licenceCertificatesForm.controls[key].disable();
                });
              }
            } else if (response.profile === 'manageprofile') {
              this.profilStatus = response.profile
            }
          });
        }
      });
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
        moduleName: 'Business Licenses and Certificates'
      },
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.listOfFiles.length === 0) {
          this.adminService.showMessage('Please upload documents.');
          return;
        }
        if (this.fileChange) {
          this.listOfFiles.forEach((fi) => {
            this.formData.append('licenseDocs', fi.fileInfo);
          });
        }
        this.saveLicenseVm.supplierId = this.supplierId;
        this.saveLicenseVm.userId = this.userId;
        this.saveLicenseVm.issueDate = moment(this.saveLicenseVm.issueDate).format('YYYY-MM-DDThh:mm:ssZ');
        this.saveLicenseVm.expiryDate = moment(this.saveLicenseVm.expiryDate).format('YYYY-MM-DDThh:mm:ssZ');
        this.formData.append('LicenseAndCertificate', JSON.stringify(this.saveLicenseVm));
        this.licenceActivityService.saveLicenseAndCertificate(this.formData).subscribe(res => {
          if (res) {
            if (this.saveLicenseVm.licenseCertificationId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            // this.adminService.showMessage('Data on the form has been '
            //   + (this.saveLicenseVm.licenseCertificationId > 0 ? 'updated successfully' : 'saved successfully'));
            this.disableSave = false;
            this.saveLicenseVm = new LicenseCertificationDto();
            this.listOfFiles = [];
            this.fileChange = false;
            this.editLicenseFlag = false;
            this.attachToggle = false;
            this.licenceCertificatesForm.reset();
            this.tabNextChild.emit(3);
            this.getAllLicenseCertificationList();
            this.formData = new FormData();
          }
        });
      } else {
        if (this.listOfFiles.length === 0) {
          this.adminService.showMessage('Please upload documents.');
          return;
        }
        if (this.fileChange) {
          this.listOfFiles.forEach((fi) => {
            this.formData.append('licenseDocs', fi.fileInfo);
          });
        }
        this.saveLicenseVm.supplierId = this.supplierId;
        this.saveLicenseVm.userId = this.userId;
        this.saveLicenseVm.issueDate = moment(this.saveLicenseVm.issueDate).format('YYYY-MM-DDThh:mm:ssZ');
        this.saveLicenseVm.expiryDate = moment(this.saveLicenseVm.expiryDate).format('YYYY-MM-DDThh:mm:ssZ');
        this.formData.append('LicenseAndCertificate', JSON.stringify(this.saveLicenseVm));
        this.licenceActivityService.saveLicenseAndCertificate(this.formData).subscribe(res => {
          if (res) {
            if (this.saveLicenseVm.licenseCertificationId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            // this.adminService.showMessage('Data on the form has been '
            //   + (this.saveLicenseVm.licenseCertificationId > 0 ? 'updated successfully' : 'saved successfully'));
            this.disableSave = false;
            this.saveLicenseVm = new LicenseCertificationDto();
            this.listOfFiles = [];
            this.fileChange = false;
            this.editLicenseFlag = false;
            this.attachToggle = false;
            this.licenceCertificatesForm.reset();
            this.getAllLicenseCertificationList();
            this.formData = new FormData();
          }
        });
      }
    });

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
      this.fileChange = true;
      this.fileInput.nativeElement.value = null;
    }
  }
  deleteFile(file: any) {
    this.listOfFiles = this.listOfFiles.filter(x => x.fileInfo.name !== file.fileInfo.name);
    if (file.docId > 0) {
      this.licenceActivityService.deleteDocument(file.docId, this.userId).subscribe(res => { });
    }
  }
  downloadFile(path: string) {
    this.commonService.downloadOrOpenFile(path);
  }
  ClearValues(): boolean {
    // this.SaveCerDraftFlag.emit(this.commonService.CommonClearValues(this.licenceCertificatesForm, this.listOfFiles));
    if (this.licenceCertificatesForm?.form.valid) {
      if (this.listOfFiles?.length !== 0) {
        this.SaveCerDraftFlag.emit(true)
      } else {
        this.SaveCerDraftFlag.emit(false)
      }
    } else {
      this.SaveCerDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.licenceCertificatesForm, this.listOfFiles);
  }
  clearLicenseCertificate() {
    this.saveLicenseVm = new LicenseCertificationDto();
    this.listOfFiles = [];
    this.licenceCertificatesForm.reset();
    if (this.editLicenseFlag) {
      this.editLicenseFlag = false;
    }
  }
  editLicenseActivity(index: number) {
    this.pageUp.emit();
    this.editLicenceIndex = index;
    this.editLicenseFlag = true;
    this.saveLicenseVm = this.saveAllLicenseVm[index];
    this.listOfFiles = this.saveAllLicenseVm[index].fileInfo;
    if (this.saveLicenseVm.issuingCountryId > 0) {
      this.getStates(this.saveLicenseVm.issuingCountryId);
    }
  }
  deletelicenseCertification(index: number, fileNameId: string, licenseCertificationId: number) {
    if (licenseCertificationId > 0) {
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
          parentDialogRef: this.commonService.dataLostModalConfig,  // Passing the parent dialog reference,
          deleteFlag: true
        },
      });
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.licenceActivityService.deleteOrUndoLicenseAndCertificate(licenseCertificationId, true, this.userId).subscribe(res => {
            if (res) {
              // this.adminService.showMessage('Licenses and certificates info ' + (index + 1) + ' removed successfully.');
              this.adminService.showMessage('Deleted successfully.');
              this.getAllLicenseCertificationList();
            }
          });
        } else {
          this.dialog.closeAll();
        }
      });
    }
    //  else {
    //   this.formData.delete(fileNameId);
    //   this.saveAllLicenseVm.splice(index, 1);
    // }
  }

  addLicenseCertificate(isNextClick: boolean = false) {
    this.isSubmitted = true;
    if (!isNextClick && this.profilStatus === 'manageprofile') {
       this.preQualification();
    } else {
      if (isNextClick && this.saveAllLicenseVm.length !== 0 && this.editLicenseFlag && this.licenceCertificatesForm.dirty && this.licenceCertificatesForm.valid) {
        this.confirmatioPopUp(isNextClick);
      } else
        if (!isNextClick && this.licenceCertificatesForm.valid) {
          if (this.listOfFiles.length === 0) {
            this.adminService.showMessage('Please upload documents.');
            return;
          }
          if (this.fileChange) {
            this.listOfFiles.forEach((fi) => {
              this.formData.append('licenseDocs', fi.fileInfo);
            });
          }
          this.saveLicenseVm.supplierId = this.supplierId;
          this.saveLicenseVm.userId = this.userId;
          this.saveLicenseVm.issueDate = moment(this.saveLicenseVm.issueDate).format('YYYY-MM-DDThh:mm:ssZ');
          this.saveLicenseVm.expiryDate = moment(this.saveLicenseVm.expiryDate).format('YYYY-MM-DDThh:mm:ssZ');
          this.formData.append('LicenseAndCertificate', JSON.stringify(this.saveLicenseVm));
          this.licenceActivityService.saveLicenseAndCertificate(this.formData).subscribe(res => {
            if (res) {
              if (this.saveLicenseVm.licenseCertificationId > 0) {
                this.adminService.showMessage('Data on the form has been updated successfully');
              } else {
                this.adminService.showMessage('Data on the form has been saved successfully');
              }
              // this.adminService.showMessage('Data on the form has been '
              //   + (this.saveLicenseVm.licenseCertificationId > 0 ? 'updated successfully' : 'saved successfully'));
              this.disableSave = false;
              this.saveLicenseVm = new LicenseCertificationDto();
              this.listOfFiles = [];
              this.fileChange = false;
              this.editLicenseFlag = false;
              this.attachToggle = false;
              this.licenceCertificatesForm.reset();
              if (isNextClick) {
                setTimeout(() => {
                  this.tabNextChild.emit();
                }, 1000);
              }
              if (this.previousTabClick) {
                setTimeout(() => {
                  this.tabPreviousChild.emit(true);
                }, 1000);
              }
              this.getAllLicenseCertificationList();
              this.formData = new FormData();
            }
          });

        } else if (isNextClick && !this.licenceCertificatesForm.valid) {
          if (this.saveAllLicenseVm?.length !== 0) {
            this.tabNextChild.emit();
          } else {
            this.isSubmitted = true;
          }
        } else {
          if (this.licenceCertificatesForm.valid) {
            if (isNextClick) {
              this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
            } else {
              this.adminService.showMessage('Please fill in all mandatory fields before save');
            }
          }
        }
    }
  }

  NextButtonValidation() {
    if (this.saveAllLicenseVm?.length !== 0) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false);
    }
  }

  enforceMaxLength(event: Event, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }
  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {
    const financialFields = Object.values(this.licenceCertificatesForm.controls).some(control => control.dirty || control.value);
    if (financialFields) {
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
          checkBtnValue: isNextClick ? "next" : isPreviousClick ? "previous" : ""
        },
      });
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (isNextClick) {
            // this.addLicenseCertificate();
            this.tabNextChild.emit();
            return;
          } else {
            this.previousTabClick = true;
            this.tabPreviousChild.emit(true);
            // this.addLicenseCertificate();
          }
        } else {
          if (isPreviousClick) {
            return;
          }
          if (isNextClick) {
            return;
            // this.tabNextChild.emit();
          }
          else {
            this.tabPreviousChild.emit(true);
          }
        }
      });
    } else {
      if (isNextClick) {
        if (this.saveAllLicenseVm.length > 0) {
          this.tabNextChild.emit();
        } else {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        }
      }
      else {
        this.licenceCertificatesForm.resetForm();
        this.tabPreviousChild.emit(true);
      }
    }
  }
  toggleAttach() {
    this.attachToggle = !this.attachToggle;
  }
  closeAttach() {
    this.attachToggle = !this.attachToggle;
  }
}
