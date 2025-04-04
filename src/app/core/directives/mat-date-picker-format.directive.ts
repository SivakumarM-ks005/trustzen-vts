import { DatePipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { SysParameterGeneralService } from '../services/sys-parameter-general.service';

@Directive({
  selector: '[appMatDatePickerFormat]',
  standalone: true
})
export class MatDatePickerFormatDirective implements OnInit {


  @Input('appMatDatePickerFormat') format = 'dd-MM-yyyy'; // Default format
 ngOnInit(): void {
  
  this.control.valueChanges?.subscribe(value=>{
    // const value = this.el.nativeElement.value;
    if (value) {
      const formattedDate = this.formatDate(value.toDate());
      this.control.control?.setValue(formattedDate, { emitEvent: false });
    }
  })
  
 }
  constructor(private el: ElementRef, private control: NgControl, private datePipe: DatePipe,private sysPar:SysParameterGeneralService) {}

  

  private formatDate(value: string): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value; // If invalid date, return as is
    console.log(date,'selected date')
    return this.sysPar.formatDate(date) || value;
  }

}
