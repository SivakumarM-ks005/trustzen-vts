import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivityVm, LicenseActivityDto, SubActivityVm } from '../../../core/models/licence-activities.model';
import { AdminService } from '../../../core/services/admin/admin.service';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { CommonService } from '../../../core/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { AutoCompleteDirective } from '../../../core/directives/autocomplete.directive';
import { MatOption } from '@angular/material/core';
import { LicenceActivityService } from '../../../core/services/supplier-management/licence-activity.service';
import { MatIconModule } from '@angular/material/icon';
import { PreQualificationProcessComponent } from '@app/pre-qualification-process/pre-qualification-process.component';

@Component({
  selector: 'app-licence-activities',
  templateUrl: './licence-activities.component.html',
  styleUrl: './licence-activities.component.scss',
  standalone: true,
  imports: [NgIf, MatButton, MatTooltip, FormsModule, MatIconModule, MatInputModule, MatFormField, MatLabel, MatInput, MatAutocompleteTrigger, AutoCompleteDirective, MatAutocomplete, MatOption, MatError]
})
export class LicenceActivitiesComponent implements OnInit {
  @Input() supplierId: number;
  @Input() userId: number;
  activityList: ActivityVm[] = new Array<ActivityVm>();
  filterActivity: ActivityVm[] = new Array<ActivityVm>();
  subActivityList: SubActivityVm[] = new Array<SubActivityVm>();
  filterSubActivity: SubActivityVm[] = new Array<SubActivityVm>();
  saveLicenseActivity: LicenseActivityDto = new LicenseActivityDto();
  saveAllLicenseActivity: LicenseActivityDto[] = new Array<LicenseActivityDto>();
  @ViewChild('licenceActivityForm', { static: false }) licenceActivityForm: NgForm;
  editActivityFlag: boolean = false;
  editActivityIndex: number;
  disableSave: boolean = false;
  @Output() tabPreviousChild = new EventEmitter();
  @Output() tabNextChild = new EventEmitter();
  @Output() tabValidCheckEmitchild = new EventEmitter();
  @Output() SaveActDraftFlag = new EventEmitter<boolean>();
  @Output() pageUp = new EventEmitter();
  previousTabClick: boolean = false;
  disableStatusBased: boolean = true;
  isSubmitted = false;
  @Output() NextFlag = new EventEmitter<boolean>();
  profileStatus: any;

  constructor(
    private licenceActivityService: LicenceActivityService,
    private adminService: AdminService,
    private commonService: CommonService,
    private dialog: MatDialog,
    public activateRouter: ActivatedRoute
  ) { }
  ngOnInit() {
    // this.initDropDown();
    this.getActivities();
    this.getLicenseActivityDetails();
    // }
    // initDropDown() {


    // this.activityList = [
    //   { activityId: 1, activity: "Healthcare" },
    //   { activityId: 2, activity: "Infrastructure" },
    //   { activityId: 3, activity: "Telecom" }
    // ];
    // this.filterActivity = this.activityList;

    // this.subActivityList = [
    //   { subActivityId: 1, subActivity: "Health Care Centre" },
    //   { subActivityId: 2, subActivity: "Roadways" },
    //   { subActivityId: 3, subActivity: "Mobile Services Bandwidth Services" }
    // ];
    // this.filterSubActivity = this.subActivityList;
  }
  getActivities() {
    this.licenceActivityService.getLicenseActivities()
      .subscribe({
        next: res => {
          this.subActivityList = [];
          this.filterSubActivity = [];
          this.activityList = res;
          this.filterActivity = this.activityList;
        }, error: error => this.adminService.showMessage(error),
        complete: () => {
          // this.getSubActivities() 
        }
      });
  }
  getSubActivities(activityId: number) {
    this.licenceActivityService.getLicenseSubActivities(activityId)
      .subscribe({
        next: res => {
          this.subActivityList = res;
          this.filterSubActivity = this.subActivityList;
        }, error: error => this.adminService.showMessage(error),
        complete: () => { }
      });
  }
  ClearValues(): boolean {
    // this.SaveActDraftFlag.emit(this.commonService.CommonClearValues(this.licenceActivityForm));
    if (this.licenceActivityForm?.form.valid) {
      this.SaveActDraftFlag.emit(true)
    } else {
      this.SaveActDraftFlag.emit(false)
    }
    return this.commonService.CommonClearValues(this.licenceActivityForm);
  }
  getLicenseActivityDetails() {
    this.licenceActivityService.getLicenseActivityDetails(this.supplierId)
      .subscribe({
        next: res => {
          this.tabValidCheckEmitchild.emit();
          this.saveAllLicenseActivity = res;
        }, error: error => this.adminService.showMessage(error),
        complete: () => {
          this.activateRouter?.params?.subscribe((response) => {
            if (response.status === 'In-Progress') {
              if (this.licenceActivityForm) {
                Object.keys(this.licenceActivityForm.controls).forEach((key) => {
                  this.licenceActivityForm.controls[key].disable();
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
  displayFnActivity(activityId: number): string {
    return activityId > 0 ? this.filterActivity.find(ac => ac.activityId === activityId)?.activity! : '';
  }
  displayFnSubActivity(subActivityId: number): string {
    return subActivityId > 0 ? this.filterSubActivity.find(ac => ac.subActivityId === subActivityId)?.subActivity! : '';
  }
  editActivities(index: number) {
    // el.scrollIntoView();
    this.pageUp.emit();
    this.saveLicenseActivity = this.saveAllLicenseActivity[index];
    this.editActivityFlag = true;
    this.editActivityIndex = index;
  }
  clearActivities() {
    this.saveLicenseActivity = new LicenseActivityDto();
    this.licenceActivityForm.reset();
    if (this.editActivityFlag) {
      this.editActivityFlag = false;
    }
  }
  addActivities(isNextClick: boolean = false) {
    this.isSubmitted = true;
    if (this.saveAllLicenseActivity?.length > 0) {
      let duplicateCheck = this.saveAllLicenseActivity.some(data => data.activityId === this.saveLicenseActivity?.activityId && data?.subActivityId === this.saveLicenseActivity?.subActivityId);
      if (duplicateCheck) {
        this.adminService.showMessage('Activity and SubActivity already added!');
        return;
      }
    }

    if (!isNextClick && this.profileStatus === 'manageprofile') {
      this.preQualification();
    } else {

      if (isNextClick && this.saveAllLicenseActivity.length !== 0 && this.editActivityFlag && this.licenceActivityForm.dirty && this.licenceActivityForm.valid) {
        this.confirmatioPopUp(isNextClick);
      } else if (!isNextClick && this.licenceActivityForm.valid) {
        this.saveLicenseActivity.supplierId = this.supplierId;
        this.saveLicenseActivity.userId = this.userId;
        this.licenceActivityService.saveActivityAndSubActivity(this.saveLicenseActivity).subscribe(res => {
          if (res) {
            if (this.saveLicenseActivity.licensedActivityId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            // this.adminService.showMessage('Data on the form has been successfully '
            //   + (this.saveLicenseActivity.licensedActivityId > 0 ? 'Updated.' : 'Saved.'));
            this.disableSave = false;
            this.saveLicenseActivity = new LicenseActivityDto();
            this.licenceActivityForm.reset();
            this.filterActivity = this.activityList;
            this.filterSubActivity = this.subActivityList;
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
            this.getLicenseActivityDetails();
            this.licenceActivityForm.reset();
            this.filterActivity = this.activityList;
            this.filterSubActivity = this.subActivityList;
          }
        });
      } else if (isNextClick && !this.licenceActivityForm.valid) {
        if (this.saveAllLicenseActivity?.length !== 0) {
          this.tabNextChild.emit();
        } else {
          this.isSubmitted = true;
        }
      } else {
        if (this.licenceActivityForm.valid) {
          if (isNextClick) {
            this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
          } else {
            this.adminService.showMessage('Please fill in all mandatory fields before save');
          }
        }
      }
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
        moduleName: 'Licensed Activities and Sub-Activities'
      },
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveLicenseActivity.supplierId = this.supplierId;
        this.saveLicenseActivity.userId = this.userId;
        this.licenceActivityService.saveActivityAndSubActivity(this.saveLicenseActivity).subscribe(res => {
          if (res) {
            if (this.saveLicenseActivity.licensedActivityId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            // this.adminService.showMessage('Data on the form has been successfully '
            //   + (this.saveLicenseActivity.licensedActivityId > 0 ? 'Updated.' : 'Saved.'));
            this.disableSave = false;
            this.saveLicenseActivity = new LicenseActivityDto();
            this.licenceActivityForm.reset();
            this.filterActivity = this.activityList;
            this.filterSubActivity = this.subActivityList;

            this.tabNextChild.emit(3);


            this.getLicenseActivityDetails();
            this.licenceActivityForm.reset();
            this.filterActivity = this.activityList;
            this.filterSubActivity = this.subActivityList;
          }
        });
      }else{
        this.saveLicenseActivity.supplierId = this.supplierId;
        this.saveLicenseActivity.userId = this.userId;
        this.licenceActivityService.saveActivityAndSubActivity(this.saveLicenseActivity).subscribe(res => {
          if (res) {
            if (this.saveLicenseActivity.licensedActivityId > 0) {
              this.adminService.showMessage('Data on the form has been updated successfully');
            } else {
              this.adminService.showMessage('Data on the form has been saved successfully');
            }
            // this.adminService.showMessage('Data on the form has been successfully '
            //   + (this.saveLicenseActivity.licensedActivityId > 0 ? 'Updated.' : 'Saved.'));
            this.disableSave = false;
            this.saveLicenseActivity = new LicenseActivityDto();
            this.licenceActivityForm.reset();
            this.filterActivity = this.activityList;
            this.filterSubActivity = this.subActivityList;
            this.getLicenseActivityDetails();
            this.licenceActivityForm.reset();
            this.filterActivity = this.activityList;
            this.filterSubActivity = this.subActivityList;
          }
        });
      }
    });

  }

  deleteActivities(index: number, licenceActivityId: number) {
    if (licenceActivityId > 0) {
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
            parentDialogRef: this.commonService.dataLostModalConfig,  // Passing the parent dialog reference,
            deleteFlag: true
          },
        });


      // this.commonService.deletetModalConfig);
      cancelDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.licenceActivityService.deleteLicenseActity(licenceActivityId, true, this.userId).subscribe(res => {
            if (res) {
              // this.adminService.showMessage('Activity & sub activity ' + (index + 1) + ' removed successfully.');
              this.adminService.showMessage('Deleted successfully.');
              this.getLicenseActivityDetails();
            }
          });
        } else {
          this.dialog.closeAll();
        }
      });
    }
  }

  NextButtonValidation() {
    if (this.saveAllLicenseActivity?.length !== 0) {
      this.NextFlag.emit(true);
    } else {
      this.NextFlag.emit(false);
    }
  }
  // saveActivities() {
  //   this.disableSave = true;
  //   let saveAllValue = this.saveAllLicenseActivity.filter(x => x.isChangedFlag);
  //   if (saveAllValue.length === 0) {
  //     this.adminService.showMessage('Add or Update one Activity.');
  //     this.disableSave = false;
  //     return;
  //   }
  //   if (this.licenceActivityForm.valid) {
  //     this.adminService.showMessage('Please click Add to entered value to save.');
  //     this.disableSave = false;
  //     return;
  //   }
  //   this.licenceActivityService.saveActivityAndSubActivity(saveAllValue).subscribe(res => {
  //     if (res) {
  //       this.adminService.showMessage('Data on the form has been successfully saved.');
  //       this.disableSave = false;
  //       this.getLicenseActivityDetails();
  //     }
  //   });
  // }

  confirmatioPopUp(isNextClick: boolean = false, isPreviousClick: boolean = false): void {
    const financialFields = Object.values(this.licenceActivityForm.controls).some(control => control.dirty || control.value);
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
            // this.addActivities();
            this.tabNextChild.emit();
            return;
          } else {
            this.previousTabClick = true;
            this.tabPreviousChild.emit(true);
            // this.addActivities();
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
        if (this.saveAllLicenseActivity.length > 0) {
          this.tabNextChild.emit();
        } else {
          this.adminService.showMessage(`Complete all mandatory fields and click 'Save as Draft' to proceed.`);
        }
      }
      else {
        this.licenceActivityForm.resetForm();
        this.tabPreviousChild.emit(true);
      }
    }
  }

  //New sub activities with activity ID 
  onSelectionLicenceChange(event: any) {
    this.getSubActivities(event?.option?.value)
  }
}
