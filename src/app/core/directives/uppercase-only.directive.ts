import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[uppercaseOnly]',
  standalone: true
})
export class UppercaseOnlyDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    
    // Convert the input value to uppercase
    const transformedValue = input.value.toUpperCase();
    
    // Update the input value
    input.value = transformedValue;
    
    // Update the form control value
    this.control?.control?.setValue(transformedValue, { emitEvent: false });
  }
}
