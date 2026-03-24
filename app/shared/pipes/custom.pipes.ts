import { Pipe, PipeTransform } from '@angular/core';

/**
 * Safe HTML Pipe
 * Sanitizes HTML content for display
 */
@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) return '';
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

/**
 * Currency Pipe
 * Formats numbers as currency
 */
@Pipe({
  name: 'currency'
})
export class CurrencyFormatterPipe implements PipeTransform {
  transform(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value / 100);
  }
}

/**
 * Truncate Pipe
 * Truncates text to specified length
 */
@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
