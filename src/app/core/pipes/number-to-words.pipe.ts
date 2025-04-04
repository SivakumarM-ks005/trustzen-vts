import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords',
  standalone: true
})
export class NumberToWordsPipe implements PipeTransform {

  a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  b = ['', '', 'Twenty', 'Thirty', 'Fourty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  transform(value: string): string {
    if (value?.length > 9) return 'overflow';
    let n = ('000000000' + value).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) != 0) ? (this.a[Number(n[1])] || (this.b[Number(n[1][0])] + ' ' + this.a[Number(n[1][1])])) + 'Crore ' : '';
    str += (Number(n[2]) != 0) ? (this.a[Number(n[2])] || (this.b[Number(n[2][0])] + ' ' + this.a[Number(n[2][1])])) + 'Lakh ' : '';
    str += (Number(n[3]) != 0) ? (this.a[Number(n[3])] || (this.b[Number(n[3][0])] + ' ' + this.a[Number(n[3][1])])) + 'Thousand ' : '';
    str += (Number(n[4]) != 0) ? (this.a[Number(n[4])] || (this.b[Number(n[4][0])] + ' ' + this.a[Number(n[4][1])])) + 'Hundred ' : '';
    str += (Number(n[5]) != 0) ? ((str != '') ? 'And ' : '') + (this.a[Number(n[5])] || (this.b[Number(n[5][0])] + ' ' + this.a[Number(n[5][1])])) : '';
    // str += ' Only';
    return str.trim();
  }
}

