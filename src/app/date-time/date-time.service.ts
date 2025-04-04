// date-time.service
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { SupplierUserFormService } from '../core/services/supplier-management/supplier.user.form.service';
import { CommonService } from '../core/services/common.service';


@Injectable({ providedIn: 'root' })
export class DateTimeService {
  public _format: string;
  private _locale: string;

  public constructor(private supplierUserFormService: SupplierUserFormService, private commonService: CommonService) {
    this._format = "DD-MM-YYYY";
    this._locale = "en-US";
    this.commonService.showFormat = this._format;
  }
  setDateFormat() {
    this.supplierUserFormService.GetSysParameterGeneral().subscribe(res => {
      if (res != null) {
        this._format = res.dateFormat.toUpperCase();
        switch (res.dateFormat) {
          case 'dd-mm-yyyy':
            this.commonService.showFormat = 'dd-MM-yyyy';
            return;
          case 'dd-mmm-yyyy':
            this.commonService.showFormat = 'dd-MMM-yyyy';
            return;
          case 'mm-dd-yyyy':
            this.commonService.showFormat = 'MM-dd-yyyy';
            return;
          case 'mmm-dd-yyyy':
            this.commonService.showFormat = 'MMM-dd-yyyy';
            return;
          case 'yyyy-mmm-dd':
            this.commonService.showFormat = 'yyyy-MMM-dd';
            return;
          case 'yyyy-mm-dd':
            this.commonService.showFormat = 'yyyy-MM-dd';
            return;
          default:
            this.commonService.showFormat = 'dd-MM-yyyy';
            return;
        }
      }
    });
  }
  public get format(): string {
    return this._format;
  }
  public set format(value: string) {
    this._format = value;
  }

  public get locale(): string {
    return this._locale;
  }
  public set locale(value: string) {
    this._locale = value;
  }
}