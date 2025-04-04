import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule, NgModel } from '@angular/forms';
import moment from 'moment';
import { RelatedPartyDiscDto } from '../../../core/models/related-party-disc.model';
import { AdminService } from '../../../core/services/admin/admin.service';
import { CommonService } from '../../../core/services/common.service';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgIf, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AllowNumberOnlyDirective } from '../../../core/directives/allowNumberOnly.directive';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { LicenceActivityService } from '../../../core/services/supplier-management/licence-activity.service';
import { PreQualificationProcessComponent } from '@app/pre-qualification-process/pre-qualification-process.component';

@Component({
  selector: 'app-related-party-disc',
  templateUrl: './related-party-disc.component.html',
  styleUrl: './related-party-disc.component.scss',
  standalone: true,
  imports: [NgIf, MatButton, MatTooltip, FormsModule, MatFormField, MatLabel, MatInput, MatError, AllowNumberOnlyDirective, MatDatepickerInput, MatHint, MatDatepickerToggle, MatSuffix, MatDatepicker, DatePipe]
})
export class RelatedPartyDiscComponent implements OnInit {
  @Input() supplierId: number;
  @Input() userId: number;
  @ViewChild('relatedPartyForm', { static: false }) relatedPartyForm: NgForm;
  saveRelatedPartyVm: RelatedPartyDiscDto = new RelatedPartyDiscDto();
  saveAllRelatedPartyVm: RelatedPartyDiscDto[] = new Array<RelatedPartyDiscDto>();
  editFlag: boolean = false;
  disableSave: boolean = false;
  @Output() tabPreviousChild = new EventEmitter();
  @Output() tabNextChild = new EventEmitter();
  @Output() tabValidCheckEmitchild = new EventEmitter();
  @Output() SaveCerDraftFlag = new EventEmitter<boolean>();
  previousTabClick: boolean = false;
  disableStatusBased: boolean = true;
  @Output() pageUp = new EventEmitter();
  isSubmitted = false;
  @Output() NextFlag = new EventEmitter<boolean>();
  profileStatus: any;

  constructor(
    private licenceActivityService: LicenceActivityService,
    private adminService: AdminService,
    public commonService: CommonService,
    private dialog: MatDialog,
    private activateRouter: ActivatedRoute
  ) { }
  ngOnInit() {
    this.getRelatedPartyDetail();
  }
  getRelatedPartyDetail() {
    this.licenceActivityService.getRelatedPartyDiscDetail(this.supplierId)
      .subscribe({
        next: res => {
          this.saveAllRelatedPartyVm = res;
          this.saveAllRelatedPartyVm.forEach(item => {
            item.startDate = new Date(item.startDate);
          });
          // this.saveRelatedPartyVm.startDate = new Date(this.saveRelatedPartyVm.startDate);
          // this.editFlag = true
          this.tabValidCheckEmitchild.emit();
        }, error: error => this.adminService.showMessage(error),
        complete: () => {
          this.activateRouter?.params?.subscribe((response) => {
            if (response.status === 'In-Progress') {
              if (this.relatedPartyForm) {
                Object.keys(this.relatedPartyForm.controls).forEach((key) => {
                  this.relatedPartyForm.controls[key].disable();
                });
              }
              this.disableStatusBased = false;
            } else if (response.profile === 'manageprofile') {
              this.profileStatus = response.profile;
            }

          });
        }
      });
  }
  clearRelatedParty() {
    this.saveRelatedPartyVm = new RelatedPartyDiscDto();
    this.relatedPartyForm.reset();
    if (this.editFlag) {
      this.editFlag = false;
    }
  }
  clearValues(): boolean {
    // this.SaveCerDraftFlag.emit(this.commonService.CommonClearValues(this.relatedPartyForm));
    if (this.relatedPartyForm?.form.valid) {
      this.SaveCerDraftFlag.emit(true)
    } else {
      this.SaveCerDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.relatedPartyForm);
  }

  deleteRelatedParty(index: number, relatedPartyDiscId: number) {
    if (relatedPartyDiscId > 0) {
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
            deleteFlag: true
          },
        })


      // this.commonService.deletetModalConfig);
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.licenceActivityService.deleteRelatedPartyDisc(relatedPartyDiscId, true, this.userId).subscribe(res => {
            if (res) {
              // this.adminService.showMessage('Related Party Disclosure ' + (index + 1) + ' removed successfully.');
              this.adminService.showMessage('Deleted successfully.');
              this.getRelatedPartyDetail();
            }
          });
        } else {
          this.dialog.closeAll();
        }
      });
    }
  }
  editRelatedParty(index: number) {
    this.pageUp.emit();
    this.saveRelatedPartyVm = this.saveAllRelatedPartyVm[index];
    this.editFlag = true;
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
        moduleName: 'Related Party Disclosures'
      },
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.disableSave = true;
        this.saveRelatedPartyVm.supplierId = this.supplierId;
        this.saveRelatedPartyVm.userId = this.userId;
        this.saveRelatedPartyVm.startDate = moment(this.saveRelatedPartyVm.startDate).format('YYYY-MM-DDThh:mm:ssZ');
        this.licenceActivityService.saveRelatedPartyDisc(this.saveRelatedPartyVm).subscribe(res => {
          if (res) {
            // this.adminService.showMessage('Data on the form has been successfully saved.');
            if (this.saveRelatedPartyVm.relatedPartyDiscId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            // this.adminService.showMessage('Data on the form has been successfully '
            //   + (this.saveRelatedPartyVm.relatedPartyDiscId > 0 ? 'updated.' : 'saved.'));
            this.disableSave = false;
            this.editFlag = false;
            this.saveRelatedPartyVm = new RelatedPartyDiscDto();
            this.relatedPartyForm.reset();

            this.tabNextChild.emit(3);

            this.getRelatedPartyDetail();
          }
        });
      } else {
        this.disableSave = true;
        this.saveRelatedPartyVm.supplierId = this.supplierId;
        this.saveRelatedPartyVm.userId = this.userId;
        this.saveRelatedPartyVm.startDate = moment(this.saveRelatedPartyVm.startDate).format('YYYY-MM-DDThh:mm:ssZ');
        this.licenceActivityService.saveRelatedPartyDisc(this.saveRelatedPartyVm).subscribe(res => {
          if (res) {
            // this.adminService.showMessage('Data on the form has been successfully saved.');
            if (this.saveRelatedPartyVm.relatedPartyDiscId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            // this.adminService.showMessage('Data on the form has been successfully '
            //   + (this.saveRelatedPartyVm.relatedPartyDiscId > 0 ? 'updated.' : 'saved.'));
            this.disableSave = false;
            this.editFlag = false;
            this.saveRelatedPartyVm = new RelatedPartyDiscDto();
            this.relatedPartyForm.reset();

            this.getRelatedPartyDetail();
          }
        });
      }
    });

  }

  saveRelatedParty(isNextClick: boolean = false) {
    this.isSubmitted = true;
    if (!isNextClick && this.profileStatus === 'manageprofile') {
      this.preQualification();
    } else {
      if (isNextClick && this.saveAllRelatedPartyVm.length !== 0 && this.editFlag && this.relatedPartyForm.dirty && this.relatedPartyForm.valid) {
        this.confirmatioPopUp(isNextClick);
      } else if (!isNextClick && this.relatedPartyForm.valid) {
        this.disableSave = true;
        this.saveRelatedPartyVm.supplierId = this.supplierId;
        this.saveRelatedPartyVm.userId = this.userId;
        this.saveRelatedPartyVm.startDate = moment(this.saveRelatedPartyVm.startDate).format('YYYY-MM-DDThh:mm:ssZ');
        this.licenceActivityService.saveRelatedPartyDisc(this.saveRelatedPartyVm).subscribe(res => {
          if (res) {
            // this.adminService.showMessage('Data on the form has been successfully saved.');
            if (this.saveRelatedPartyVm.relatedPartyDiscId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            // this.adminService.showMessage('Data on the form has been successfully '
            //   + (this.saveRelatedPartyVm.relatedPartyDiscId > 0 ? 'updated.' : 'saved.'));
            this.disableSave = false;
            this.editFlag = false;
            this.saveRelatedPartyVm = new RelatedPartyDiscDto();
            this.relatedPartyForm.reset();
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
            this.getRelatedPartyDetail();
          }
        });
      } else if (isNextClick && !this.relatedPartyForm.valid) {
        if (this.saveAllRelatedPartyVm?.length !== 0) {
          this.tabNextChild.emit();
        } else {
          this.isSubmitted = true;
        }
      } else {
        if (this.relatedPartyForm.valid) {
          if (isNextClick) {
            this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
          } else {
            this.adminService.showMessage('Please fill in all mandatory fields before save');
          }
        }
      }
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numeric keys (0-9)
    // @HostListener('keydown', ['$event']) triggerEsc(e: KeyboardEvent) {
    //   if(charCode===27){
    //     event.preventDefault();
    //   }
    // }
    if (charCode === 27) {
      event.preventDefault();
    }
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  enforceMaxLength(event: Event, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }

  validateOwnership(event: any) {
    let inputValue = event.target.value;
    if (inputValue > 100) {
      event.target.value = 100;  // Restrict value to 100
    } else if (inputValue < 0) {
      event.target.value = 0;    // Prevent negative values
    }
  }


  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {
    const financialFields = Object.values(this.relatedPartyForm.controls).some(control => control.dirty || control.value);
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
            // this.saveRelatedParty();
            this.tabNextChild.emit();
            return;
          } else {
            this.previousTabClick = true;
            this.tabPreviousChild.emit(true);
            // this.saveRelatedParty();
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
        if (this.saveAllRelatedPartyVm.length > 0) {
          this.tabNextChild.emit();
        } else {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        }
      }
      else {
        this.relatedPartyForm.resetForm();
        this.tabPreviousChild.emit(true);
      }
    }
  }

  NextButtonValidation() {
    if (this.saveAllRelatedPartyVm?.length !== 0) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false);
    }
  }

}
