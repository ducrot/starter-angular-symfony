import { PbDatePipe } from '@protobuf-ts/runtime-angular';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * `LocalizedDatePipe` uses the language setting from `ngx-translate` and
 * `PbDatePipe`, which works exactly like the original angular `DatePipe`,
 * but also understands `google.protobuf.Timestamp` and `google.type.DateTime`.
 * @link https://angular.io/api/common/DatePipe
 */
@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {
  }

  transform(value: any, pattern: string = 'mediumDate'): any {
    const pbDatePipe: PbDatePipe = new PbDatePipe(this.translateService.currentLang);
    return pbDatePipe.transform(value, pattern);
  }
}
