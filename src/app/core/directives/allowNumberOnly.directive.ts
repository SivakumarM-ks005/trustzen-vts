import { Directive, HostListener } from '@angular/core';
@Directive({
    selector: '[allowNumberOnly]',
    standalone: true
})
export class AllowNumberOnlyDirective {
    constructor() { }
    @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
        e.preventDefault();
    }
    @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
        e.preventDefault();
    }
    @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
        e.preventDefault();
    }
    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Backspace' || event.code === 'ArrowLeft' ||
            event.code === 'ArrowRight' || event.code === 'Tab' || event.code === 'Comma' || event.code === 'Period' ||
            event.code === 'NumpadDecimal' ||
            event.code === 'Delete') {
            return true;
        }
        const charCode = event.key.charCodeAt(0);
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
        return;
    }
}