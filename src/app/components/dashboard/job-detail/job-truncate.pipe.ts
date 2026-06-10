import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength = 60): string {
    if (!value) return '';
    const str = String(value);
    if (str.length <= maxLength) return str;

    // keep the start and end of the URL for recognizability
    const left = Math.ceil(maxLength * 0.6);
    const right = Math.max(0, maxLength - left - 3); // reserve 3 for '...'
    if (right === 0) {
      return str.slice(0, maxLength - 3) + '...';
    }
    return `${str.slice(0, left)}...${str.slice(str.length - right)}`;
  }
}
