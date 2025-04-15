import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonService } from '../../../core/services/common.service';
import { IssuingCountrylist, IssuingState, LicenseCategoryMasDto, LicenseCertificationDto, LicenseStatusMasDto, LicenseTypeMasDto } from '../../../core/models/licence-certificates.model';
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
    public commonService: CommonService,
    public activateRouter: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.initDropDown();
    // this.getCountryData();
  }

}
