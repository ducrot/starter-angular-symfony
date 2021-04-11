import { Component } from '@angular/core';
import { ConstantsService } from '@app/service/constants.service';
import { I18nService } from '@app/service/i18n.service';


@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent {

  public currentLang: string;
  public languages: Array<string>;

  constructor(
    private constants: ConstantsService,
    private i18nService: I18nService,
  ) {
    this.currentLang = this.i18nService.language;
    this.languages = this.i18nService.supportedLanguages;
  }

  onLanguageSelect({value: language}): void {
    this.i18nService.language = language;
  }

}
