import { Pipe, PipeTransform } from '@angular/core';

/**
 * nl2br pipe
 *
 * Usage:
 * <p [innerHTML]="body | nl2br"></p>
 */
@Pipe({name: 'nl2br'})
export class Nl2brPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) { return value; }
    const breakTag = '<br>';
    return (value + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  }
}
