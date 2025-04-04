import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
export type SystemGeneralSettings ={
  sysGeneralId: number;
  fromDate: string;  // ISO date string
  toDate: string;    // ISO date string
  decimalSymbol: string;
  noOfDigitsAftDec: string;  // Consider changing to `number` if applicable
  digitGroupingsymb: string;
  digitGrouping: string;
  timeFormat: string;
  dateFormat: string;
  singleLanguage: boolean;
  multiLanguage: boolean;
  sessionTimeOut: boolean;
  sessionTextField: number;
  sessionMinsSeconds: string;
  multiCurrencyTransaction: boolean;
  loggedIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class SysParameterGeneralService {
  allSysParamsGeneral:SystemGeneralSettings=
    {
      "sysGeneralId": 1,
      "fromDate": "2024-04-01T00:00:00",
      "toDate": "2025-03-31T00:00:00",
      "decimalSymbol": ".",
      "noOfDigitsAftDec": "2",
      "digitGroupingsymb": ",",
      "digitGrouping": "12,34,56,789",
      "timeFormat": "24 HR, HH:MM",
      "dateFormat": "dd-mm-yyyy",
      "singleLanguage": false,
      "multiLanguage": true,
      "sessionTimeOut": false,
      "sessionTextField": 0,
      "sessionMinsSeconds": "",
      "multiCurrencyTransaction": true,
      "loggedIn": 1
    }
  
  constructor(private datePipe: DatePipe) {}
 
  // Format a date with a custom format
  formatDate(date: Date | string, format: string = 'yyyy-MM-dd'): string | null {
    return this.datePipe.transform(date, format);
  }

  // Get today's date formatted
  getTodayFormatted(format: string = 'yyyy-MM-dd'): string | null {
    return this.datePipe.transform(new Date(), format);
  }

  // Convert date to a time format
  formatTime(date: Date | string, format: string = 'HH:mm:ss'): string | null {
    return this.datePipe.transform(date, format);
  }

  // Get a readable date format
  getReadableDate(date: Date | string): string | null {
    return this.datePipe.transform(date, 'EEEE, MMMM d, y'); // Example: Monday, March 12, 2025
  }
}
