import { Pipe, PipeTransform } from '@angular/core';

/**
 * log pipe
 *
 * Usage:
 * {{'some text' | log}}
 * {{ object | log}}
 */
@Pipe({name: 'log'})
export class LogPipe implements PipeTransform {
  public transform(value: object): void {
    console.log(value);
    return;
  }
}
