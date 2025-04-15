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
    // this.getRelatedPartyDetail();
  }


}
