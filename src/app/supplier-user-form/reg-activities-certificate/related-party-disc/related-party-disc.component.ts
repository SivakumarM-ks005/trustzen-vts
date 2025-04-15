import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { RelatedPartyDiscDto } from '../../../core/models/related-party-disc.model';
import { CommonService } from '../../../core/services/common.service';
import { NgIf, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AllowNumberOnlyDirective } from '../../../core/directives/allowNumberOnly.directive';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';

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
    public commonService: CommonService) { }
  ngOnInit() {
    // this.getRelatedPartyDetail();
  }


}
