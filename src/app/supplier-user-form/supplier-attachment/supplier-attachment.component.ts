import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import moment from 'moment';
import { AdminService } from '../../core/services/admin/admin.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { MandatoryAttachmentTypeMas, OptionalAttachmentTypeMas, SaveAttachmentVm, SaveManAndOptAttachmentVm } from '../../core/models/supplier-attachment.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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

    // this.getAttachmentTypeMas();

    this.activateRouter?.params?.subscribe((response) => {

      if (response.profile === 'manageprofile') {
        this.status = response.profile;
        this.mandatoryFormList.disable();
        this.mandatoryFormList.get('mandatoryFormInfos')?.disable();
      }

    });
  }


}
