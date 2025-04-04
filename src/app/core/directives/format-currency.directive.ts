import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, LOCALE_ID, OnChanges, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[formatCurrency]',
    standalone: true
})
export class CurrencyMaskDirective implements OnChanges {
  // Inject system parameter (you can adjust this based on your use case)
  @Input() systemParameter: any;
  @Input() directValue:any;
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.directValue){
      this.onInput(null)
    }
  }
  constructor(private el: ElementRef, private control: NgControl,
    @Inject(LOCALE_ID) public locale: string) { }

  @HostListener('input', ['$event']) 
  onInput(event: Event|null) {
    const input = this.el.nativeElement as HTMLInputElement;

    let value =event? input.value:this.directValue;
    value =`${value}`.replace(new RegExp(`[${this.systemParameter?.digitGroupingsymb}]`, 'g'), '')
    // console.log('value',value);
    
  
    // Ensure two decimal places
    // const [integerPart, decimalPart] = value.split(`${this.systemParameter.decimalSymbol}`);

    
    // if(this.systemParameter?.noOfDigitsAftDec === '3'){
    //   if (decimalPart && decimalPart.length > 3) {
    //     value = `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart.substring(0, 3)}`;
    //   }
    // }else if(this.systemParameter?.noOfDigitsAftDec === '2'){
    // if (decimalPart && decimalPart.length > 2) {
    //   value = `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart.substring(0, 2)}`;
    // }
    // }else if(this.systemParameter?.noOfDigitsAftDec === '1'){
    //   if (decimalPart && decimalPart.length > 1) {
    //     value = `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart.substring(0, 1)}`;
    //   }
    // }else if(this.systemParameter?.noOfDigitsAftDec === '0'){
    //     value = `${integerPart}`
    // }

    // Format based on the grouping type
    if (this.systemParameter?.digitGrouping === '12,34,56,789') {
      const formattedIntegerPart = this.formatIndianNumber(value);
      const formattedValue = formattedIntegerPart;
      input.value = formattedValue;
      this.control!.control!.setValue(formattedValue);
    } else if (this.systemParameter?.digitGrouping === '123,456,789') {
      const formattedValue = this.formatWesternNumber(value);
      input.value = formattedValue;
      this.control!.control!.setValue(formattedValue);
    } else if (this.systemParameter?.digitGrouping === '123456,789') {
      const formattedValue = this.formatCustomNumber(value);
      input.value = formattedValue;
      this.control!.control!.setValue(formattedValue);
    } else{
      const formattedValue = value;
      input.value = formattedValue;
      this.control!.control!.setValue(formattedValue);
    }
  }

  private formatIndianNumber(value: string): string {
    if (!value) return '';
  
    const groupingSymbol = this.systemParameter?.digitGroupingsymb || ',';
  
    // Split the number into integer and decimal parts
    let [integerPart, decimalPart] = value.split(`${this.systemParameter?.decimalSymbol}`);
  
    // Format the integer part using Indian numbering system
    integerPart = integerPart.replace(/(\d+)(\d{3})$/, (match, p1, p2) => {
      return p1.replace(/\B(?=(\d{2})+(?!\d))/g, groupingSymbol) + groupingSymbol + p2;
    });
  console.log(decimalPart);
  
    // Return formatted value with decimal part if present
    return decimalPart !== undefined ? `${integerPart}${this.systemParameter.decimalSymbol}${decimalPart}` : integerPart;
  }
  
  

  // Format number for Western style (1,234,567)
  private formatWesternNumber(value: string): string {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, `${this.systemParameter?.digitGroupingsymb}`);
  }

  // Format custom number style, as per the example (123456,789)
  private formatCustomNumber(value: string): string {
    if (!value) return '';

    const groupingSymbol = this.systemParameter?.digitGroupingsymb || ','; // Use system grouping symbol

    // Remove existing grouping symbols
    value = value.replace(new RegExp(`[${groupingSymbol}]`, 'g'), '');

    // Split integer and decimal parts
    let [integerPart, decimalPart] = value.split(this.systemParameter?.decimalSymbol || '.');

    // Apply grouping only on the last 3 digits
    integerPart = integerPart.replace(/(\d+)(\d{3})$/, (_, p1, p2) => {
        return p1 + groupingSymbol + p2;
    });

    // Append decimal part if present
    return decimalPart !== undefined ? `${integerPart}${this.systemParameter?.decimalSymbol}${decimalPart}` : integerPart;
  }
}


  // Format number for Indian style (1,23,45,678)
  // private formatIndianNumber(value: string): string {
  //   if (!value) return '';
  //   let lastThree = value.slice(-3);
  //   let otherNumbers = value.slice(0, -3);
  //   if (otherNumbers !== '') lastThree = `${this.systemParameter.digitGroupingsymb}` + lastThree;
  //   return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, `${this.systemParameter.digitGroupingsymb}`) + lastThree;
  // }


// import { Directive, ElementRef, HostListener, Input, Inject, OnChanges, SimpleChanges } from '@angular/core';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { LOCALE_ID } from '@angular/core';

// @Directive({
//   selector: '[formatCurrency]',
//   standalone: true,
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: CurrencyMaskDirective,
//       multi: true,
//     },
//   ],
// })
// export class CurrencyMaskDirective implements ControlValueAccessor, OnChanges {
//   @Input() systemParameter: any = {
//     digitGroupingsymb: ',',
//     decimalSymbol: '.',
//     digitGrouping: '123,456,789',
//   }; // Default configuration

//   private onChange: (value: any) => void = () => {};
//   private onTouched: () => void = () => {};

//   constructor(private el: ElementRef, @Inject(LOCALE_ID) private locale: string) {}

//   // Listen to changes in the @Input() property
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['systemParameter']) {
//       const input = this.el.nativeElement as HTMLInputElement;
//       const value = input.value;
//       input.value = this.formatValue(value); // Reformat current value based on updated systemParameter
//     }
//   }

//   @HostListener('input', ['$event'])
//   onInput(event: Event): void {
//     const input = this.el.nativeElement as HTMLInputElement;
//     let value = input.value;

//     // Remove any grouping symbols and the decimal symbol
//     value = value
//       .replace(new RegExp(`\\${this.systemParameter.digitGroupingsymb}`, 'g'), '')
//       .replace(new RegExp(`\\${this.systemParameter.decimalSymbol}`, 'g'), '');

//     // Split integer and decimal part
//     const [integerPart, decimalPart] = value.split('.');

//     // Format the integer part based on the grouping style
//     let formattedValue = this.formatNumber(integerPart);

//     // Add the decimal part back if it exists
//     if (decimalPart) {
//       formattedValue += `${this.systemParameter.decimalSymbol}${decimalPart}`;
//     }

//     // Set the formatted value to the input element
//     input.value = formattedValue;

//     // Propagate the value to the form control
//     this.onChange(formattedValue);
//   }

//   private formatNumber(value: string): string {
//     const groupingSymbol = this.systemParameter.digitGroupingsymb;
//     const groupingStyle = this.systemParameter.digitGrouping;

//     let formattedValue = '';
//     let integerPart = value;

//     // Apply the correct format based on the grouping style
//     if (groupingStyle === '123,456,789') {
//       formattedValue = this.formatWesternNumber(integerPart, groupingSymbol);
//     } else if (groupingStyle === '1,23,45,678') {
//       formattedValue = this.formatIndianNumber(integerPart, groupingSymbol);
//     } else if (groupingStyle === '123456,789') {
//       formattedValue = this.formatCustomNumber(integerPart, groupingSymbol);
//     }

//     return formattedValue;
//   }

//   private formatWesternNumber(value: string, groupingSymbol: string): string {
//     return value.replace(/\B(?=(\d{3})+(?!\d))/g, groupingSymbol);
//   }

//   private formatIndianNumber(value: string, groupingSymbol: string): string {
//     let lastThree = value.slice(-3);
//     let otherNumbers = value.slice(0, -3);
//     if (otherNumbers) lastThree = groupingSymbol + lastThree;
//     return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, groupingSymbol) + lastThree;
//   }

//   private formatCustomNumber(value: string, groupingSymbol: string): string {
//     let firstPart = value.slice(0, 6);
//     let secondPart = value.slice(6);
//     secondPart = secondPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupingSymbol);
//     return firstPart + (secondPart ? groupingSymbol + secondPart : '');
//   }

//   // Implement ControlValueAccessor methods
//   writeValue(value: any): void {
//     if (value !== undefined) {
//       const formattedValue = this.formatValue(value);
//       this.el.nativeElement.value = formattedValue;
//     }
//   }

//   registerOnChange(fn: (value: any) => void): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: () => void): void {
//     this.onTouched = fn;
//   }

//   private formatValue(value: any): string {
//     const valueString = value?.toString() || '';
//     return this.formatNumber(valueString);
//   }
// }
