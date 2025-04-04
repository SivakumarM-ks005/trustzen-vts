import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyAllowedInput]',
  standalone: true // ✅ Works in Standalone Components
})
export class OnlyAllowedInputDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event']) 
  onInputChange(event: any) {
    let inputValue = event.target.value;
    let sanitizedValue = inputValue.replace(/[^a-zA-Z0-9'\-\s]/g, ''); // ✅ Allow only letters, numbers, ' and -
    
    if (inputValue !== sanitizedValue) {
      event.target.value = sanitizedValue;
      this.ngControl.control?.setValue(sanitizedValue); // ✅ Update Angular FormControl
    }
  }
}

@Directive({
    selector: '[appOnlyAllowedSymbol]',
    standalone: true // ✅ Works in Standalone Components
  })
  export class OnlyAllowedSymbolInputDirective {
    constructor(private ngControl: NgControl) {}
  
    @HostListener('input', ['$event']) 
    onInputChange(event: any) {
      let inputValue = event.target.value;
      let sanitizedValue = inputValue.replace(/[^a-zA-Z',.-]/g, ''); // ✅ Allow only letters, numbers, ' and -
      
      if (inputValue !== sanitizedValue) {
        event.target.value = sanitizedValue;
        this.ngControl.control?.setValue(sanitizedValue); // ✅ Update Angular FormControl
      }
    }
  }
