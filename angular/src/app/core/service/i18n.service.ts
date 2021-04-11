import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ConstantsService } from '@app/service/constants.service';
import { Subscription } from 'rxjs';
import { Logger } from '@app/service/logger.service';

const languageKey = 'language';
const log = new Logger('I18nService');

/**
 * i18N service which works with ngx-translate.
 */
@Injectable({
  providedIn: 'root'
})
export class I18nService {

  defaultLanguage: string;
  supportedLanguages: string[];

  private langChangeSubscription!: Subscription;

  constructor(
    private translateService: TranslateService,
    private constants: ConstantsService,
  ) {
    this.defaultLanguage = constants.defaultLanguage;
    this.supportedLanguages = constants.supportedLanguages;
    this.language = '';

    // Warning: this subscription will always be alive for the app's lifetime
    this.langChangeSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem(languageKey, event.lang);
    });
  }

  /**
   * Gets the current language.
   * @return The current language code.
   */
  get language(): string {
    return this.translateService.currentLang;
  }

  /**
   * Sets the current language.
   * If no parameter is specified, the method tries to determine the language in the following order:
   * - The language is loaded from local storage (if present)
   * - or the language code from browser is used (if supported).
   * - else the default language is used (fallback).
   *
   * The current language is saved to the local storage.
   *
   * @param language The language code to set (or empty).
   */
  set language(language: string) {
    language = language || localStorage.getItem(languageKey) || this.translateService.getBrowserCultureLang();
    let isSupportedLanguage = this.supportedLanguages.includes(language);

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language = this.supportedLanguages.find((supportedLanguage) => supportedLanguage.startsWith(language)) || '';
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    log.debug(`Language set to ${language}`);
    this.translateService.use(language);
  }

  destroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

}
