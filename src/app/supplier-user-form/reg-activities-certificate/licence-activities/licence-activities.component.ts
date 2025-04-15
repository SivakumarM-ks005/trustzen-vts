import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivityVm, LicenseActivityDto, SubActivityVm } from '../../../core/models/licence-activities.model';
import { AdminService } from '../../../core/services/admin/admin.service';
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
    public activateRouter: ActivatedRoute
  ) { }
  ngOnInit() {

  }
}
