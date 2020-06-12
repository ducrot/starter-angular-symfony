import { Component, EventEmitter, Output } from '@angular/core';
import { ConstantsService } from '@app/service/constants.service';
import { SessionService } from '@app/service/session.service';
import { I18nService } from '@app/service/i18n.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

  appName: string;
  companyName: string;
  currentLang: string;
  selected: string;
  languages: Array<string>;

  constructor(
    private readonly session: SessionService,
    private constants: ConstantsService,
    private i18nService: I18nService,
  ) {
    this.appName = this.constants.appName;
    this.companyName = this.constants.companyName;
    this.currentLang = this.i18nService.language;
    this.languages = this.i18nService.supportedLanguages;
  }

  onLanguageSelect({ value: language }): void {
    this.i18nService.language = language;
  }

  onLogoutClick(event: Event): void {
    this.session.destroySession();
  }

  public isAuthenticated(): boolean {
    return this.session.isAuthenticated;
  }

}
