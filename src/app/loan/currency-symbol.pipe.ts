import { Pipe, PipeTransform } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';

@Pipe({
  name: 'currencySymbol'
})
export class CurrencySymbolPipe implements PipeTransform {

  transform(value: string, format?: 'wide' | 'narrow'): string {
    if (!format) {
      format = 'wide';
    }
    return getCurrencySymbol(value, format);
  }

}
